/**
 * 樱花飘落 — 单片花瓣轮廓 + 慢速飘落
 * 花瓣形状参考 sakura 系主题常用的「圆头 + 顶部小缺口」轮廓
 * https://github.com/honjun/hexo-theme-sakura
 */
(function (window) {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  var cfg = window.SAKURA_CONFIG || {};
  var zIndex = cfg.zIndex != null ? cfg.zIndex : 30;

  var LAYERS = [
    { count: 18, size: [4, 6], speed: [0.08, 0.22], opacity: [0.45, 0.62], drift: [0.12, 0.35] },
    { count: 14, size: [6, 9], speed: [0.18, 0.38], opacity: [0.58, 0.75], drift: [0.25, 0.55] },
    { count: 8, size: [9, 13], speed: [0.28, 0.5], opacity: [0.72, 0.88], drift: [0.35, 0.7] }
  ];

  if (cfg.count) {
    var n = Math.max(1, cfg.count);
    var c0 = Math.round(n * 0.45);
    var c1 = Math.round(n * 0.35);
    LAYERS[0].count = c0;
    LAYERS[1].count = c1;
    LAYERS[2].count = Math.max(0, n - c0 - c1);
  }

  // 亮背景上加深饱和度，避免花瓣「看不见」
  var PALETTE = [
    'hsla(350,72%,82%,',
    'hsla(348,78%,78%,',
    'hsla(345,82%,75%,',
    'hsla(340,70%,80%,',
    'hsla(346,85%,72%,',
    'hsla(342,68%,78%,',
    'hsla(352,65%,85%,',
    'hsla(338,80%,74%,'
  ];

  var raf = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function (cb) { return window.setTimeout(cb, 1000 / 60); };

  var canvas = document.createElement('canvas');
  canvas.id = 'sakura-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText = [
    'position:fixed',
    'left:0',
    'top:0',
    'width:100%',
    'height:100%',
    'pointer-events:none',
    'z-index:' + zIndex
  ].join(';');

  document.body.appendChild(canvas);

  var ctx = canvas.getContext('2d');
  var petals = [];
  var w = 0;
  var h = 0;
  var animId = null;

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  function resize() {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;
  }

  /**
   * 单片樱花瓣（顶部小凹口 + 圆润两侧），不是圆形/五瓣花
   */
  function tracePetal(c, s) {
    var hw = s * 0.85;
    c.beginPath();
    c.moveTo(0, s);
    c.quadraticCurveTo(hw * 1.1, s * 0.15, hw * 0.2, -s * 0.85);
    c.quadraticCurveTo(hw * 0.05, -s * 0.55, 0, -s * 0.65);
    c.quadraticCurveTo(-hw * 0.05, -s * 0.55, -hw * 0.2, -s * 0.85);
    c.quadraticCurveTo(-hw * 1.1, s * 0.15, 0, s);
    c.closePath();
  }

  function createPetal(layer, randomY) {
    return {
      x: Math.random() * w,
      y: randomY ? Math.random() * h : -(Math.random() * h * 0.4),
      size: rand(layer.size[0], layer.size[1]),
      opacity: rand(layer.opacity[0], layer.opacity[1]),
      speedY: rand(layer.speed[0], layer.speed[1]),
      drift: rand(layer.drift[0], layer.drift[1]),
      driftFreq: rand(0.0003, 0.0009),
      phase: Math.random() * Math.PI * 2,
      flutter: rand(0.03, 0.1),
      flutterFreq: rand(0.002, 0.005),
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: rand(0.0008, 0.004) * (Math.random() > 0.5 ? 1 : -1),
      wobblePhase: Math.random() * Math.PI * 2,
      wobbleSpeed: rand(0.0005, 0.0018),
      wobbleBase: rand(0.55, 0.85),
      wobbleAmp: rand(0.12, 0.28),
      colorIdx: Math.floor(Math.random() * PALETTE.length)
    };
  }

  function initPetals() {
    petals = [];
    LAYERS.forEach(function (layer) {
      for (var i = 0; i < layer.count; i++) {
        petals.push(createPetal(layer, true));
      }
    });
  }

  function tick(time) {
    if (!ctx) return;
    ctx.clearRect(0, 0, w, h);

    var currentFill = '';

    petals.forEach(function (p) {
      p.y += p.speedY;
      p.x +=
        Math.sin(p.phase + time * p.driftFreq) * p.drift +
        Math.sin(p.phase * 2.7 + time * p.flutterFreq) * p.flutter;
      p.rotation += p.rotationSpeed;

      if (p.y > h + p.size * 2) {
        p.y = -p.size * 2;
        p.x = Math.random() * w;
      }
      if (p.x > w + p.size * 2) p.x = -p.size * 2;
      else if (p.x < -p.size * 2) p.x = w + p.size * 2;

      var qOpacity = Math.round(p.opacity * 20) / 20;
      var nextFill = PALETTE[p.colorIdx] + qOpacity + ')';
      if (nextFill !== currentFill) {
        currentFill = nextFill;
        ctx.fillStyle = currentFill;
      }

      var wobble = p.wobbleBase + Math.sin(p.wobblePhase + time * p.wobbleSpeed) * p.wobbleAmp;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.scale(wobble, 1);
      ctx.shadowColor = 'rgba(190, 80, 110, 0.35)';
      ctx.shadowBlur = 3;
      ctx.shadowOffsetY = 1;
      tracePetal(ctx, p.size);
      ctx.fill();
      ctx.restore();
    });

    animId = raf(tick);
  }

  function start() {
    if (animId != null) return;
    animId = raf(tick);
  }

  function stop() {
    if (animId != null) {
      cancelAnimationFrame(animId);
      animId = null;
    }
  }

  resize();
  initPetals();
  start();

  window.addEventListener('resize', resize);

  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible') start();
    else stop();
  });
})(window);
