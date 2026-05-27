/**
 * 首页：热力图 tooltip + 可选 API 刷新昨日数据（热力图由 Hexo 服务端预渲染）
 */
(function () {
  var CONFIG = window.HOME_CONFIG || {};
  var tooltip = document.getElementById('home-tooltip');
  var heatmap = document.getElementById('home-heatmap-grid');

  function byId(id) {
    return document.getElementById(id);
  }

  function formatDate(d) {
    var y = d.getFullYear();
    var m = String(d.getMonth() + 1);
    var day = String(d.getDate());
    if (m.length < 2) m = '0' + m;
    if (day.length < 2) day = '0' + day;
    return y + '-' + m + '-' + day;
  }

  function addDays(date, n) {
    var d = new Date(date.getTime());
    d.setDate(d.getDate() + n);
    return d;
  }

  function getPostRecords() {
    return Array.isArray(window.HOME_POST_STATS) ? window.HOME_POST_STATS : [];
  }

  function buildMap(records) {
    var map = new Map();
    records.forEach(function (row) {
      var key = typeof row.todayTime === 'string'
        ? row.todayTime.slice(0, 10)
        : row.todayTime;
      map.set(key, row);
    });
    return map;
  }

  function updateYesterday(map) {
    var elCount = byId('home-yesterday-count');
    var elWords = byId('home-yesterday-words');
    var elDate = byId('home-yesterday-date');
    if (!elCount || !elWords || !elDate) return;

    var t = new Date();
    t.setHours(0, 0, 0, 0);
    var yesterday = addDays(t, -1);
    var key = formatDate(yesterday);
    var row = map.get(key);

    elCount.textContent = row ? row.dailyNoteCount : 0;
    elWords.textContent = row
      ? row.dailyNoteWordCount.toLocaleString()
      : '0';
    elDate.textContent = '统计日期：' + key;
  }

  function showTooltip(e) {
    if (!tooltip) return;
    var el = e.target;
    var count = Number(el.dataset.count);
    if (!count) {
      tooltip.textContent = el.dataset.date + '：无发文';
    } else {
      tooltip.textContent = el.dataset.date + '：' + count + ' 篇 · ' +
        Number(el.dataset.words).toLocaleString() + ' 字';
    }
    tooltip.classList.add('visible');
    moveTooltip(e);
  }

  function moveTooltip(e) {
    if (!tooltip) return;
    tooltip.style.left = e.clientX + 'px';
    tooltip.style.top = (e.clientY - 12) + 'px';
  }

  function hideTooltip() {
    if (tooltip) tooltip.classList.remove('visible');
  }

  function bindHeatmapTooltips() {
    if (!heatmap) return;
    heatmap.querySelectorAll('.home-heatmap__cell:not(.is-future)').forEach(function (cell) {
      cell.addEventListener('mouseenter', showTooltip);
      cell.addEventListener('mousemove', moveTooltip);
      cell.addEventListener('mouseleave', hideTooltip);
    });
  }

  function maybeRefreshFromApi() {
    if (CONFIG.statsSource === 'posts' || !CONFIG.apiUrl) return;
    fetch(CONFIG.apiUrl)
      .then(function (res) {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then(function (data) {
        var list = Array.isArray(data) ? data : (data.data || data.records || []);
        if (list.length) updateYesterday(buildMap(list));
      })
      .catch(function () { /* 保留服务端渲染结果 */ });
  }

  function init() {
    bindHeatmapTooltips();
    maybeRefreshFromApi();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
