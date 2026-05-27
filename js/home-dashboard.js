/**
 * 首页：热力图由 JS 渲染（HTML 仅保留空容器，避免数千行静态 DOM）
 */
(function () {
  var CONFIG = window.HOME_CONFIG || {
    displayStart: '',
    heatmapWeeks: 26,
    statsSource: 'posts',
    apiUrl: ''
  };

  var tooltip = document.getElementById('home-tooltip');
  var heatmap = document.getElementById('home-heatmap-grid');

  function byId(id) {
    return document.getElementById(id);
  }

  function parseDate(str) {
    var parts = String(str).slice(0, 10).split('-').map(Number);
    return new Date(parts[0], parts[1] - 1, parts[2]);
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

  function getDisplayStart() {
    if (CONFIG.displayStart) {
      return parseDate(CONFIG.displayStart);
    }
    var weeks = Number(CONFIG.heatmapWeeks) || 26;
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    return addDays(today, -weeks * 7);
  }

  function normalizeRecords(raw) {
    if (!Array.isArray(raw)) return [];
    return raw.map(function (row) {
      if (Array.isArray(row)) {
        return {
          todayTime: row[0],
          dailyNoteCount: row[1],
          dailyNoteWordCount: row[2]
        };
      }
      return row;
    });
  }

  function getPostRecords() {
    return normalizeRecords(window.HOME_POST_STATS);
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

  function wordLevel(count, thresholds) {
    if (!count || count <= 0) return 0;
    for (var i = thresholds.length - 1; i >= 0; i--) {
      if (count >= thresholds[i]) return i + 1;
    }
    return 1;
  }

  function computeThresholds(map) {
    var values = [];
    map.forEach(function (row) {
      if (row.dailyNoteWordCount > 0) {
        values.push(row.dailyNoteWordCount);
      }
    });
    if (!values.length) return [1, 1, 1, 1];
    values.sort(function (a, b) { return a - b; });
    var q = function (p) {
      return values[Math.min(Math.floor(values.length * p), values.length - 1)];
    };
    return [q(0.25), q(0.5), q(0.75), q(1)].map(function (v) {
      return Math.max(1, v);
    });
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

  function showTooltip(cell, clientX, clientY) {
    if (!tooltip || !cell) return;
    var count = Number(cell.dataset.count);
    if (!count) {
      tooltip.textContent = cell.dataset.date + '：无发文';
    } else {
      tooltip.textContent = cell.dataset.date + '：' + count + ' 篇 · ' +
        Number(cell.dataset.words).toLocaleString() + ' 字';
    }
    tooltip.classList.add('visible');
    tooltip.style.left = clientX + 'px';
    tooltip.style.top = (clientY - 12) + 'px';
  }

  function hideTooltip() {
    if (tooltip) tooltip.classList.remove('visible');
  }

  function bindHeatmapEvents() {
    if (!heatmap) return;
    heatmap.addEventListener('mouseover', function (e) {
      var cell = e.target.closest('.home-heatmap__cell:not(.is-future)');
      if (!cell || !heatmap.contains(cell)) return;
      showTooltip(cell, e.clientX, e.clientY);
    });
    heatmap.addEventListener('mousemove', function (e) {
      var cell = e.target.closest('.home-heatmap__cell:not(.is-future)');
      if (!cell || !heatmap.contains(cell)) return;
      showTooltip(cell, e.clientX, e.clientY);
    });
    heatmap.addEventListener('mouseleave', hideTooltip);
  }

  function renderHeatmap(map) {
    if (!heatmap) return;
    heatmap.textContent = '';

    var displayStart = getDisplayStart();
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var thresholds = computeThresholds(map);

    var startPad = displayStart.getDay();
    var gridStart = addDays(displayStart, -startPad);
    var endPad = 6 - today.getDay();
    var gridEnd = addDays(today, endPad);
    var fragment = document.createDocumentFragment();

    for (var d = new Date(gridStart.getTime()); d <= gridEnd; d = addDays(d, 1)) {
      var key = formatDate(d);
      var inRange = d >= displayStart && d <= today;
      var isFuture = d > today;
      var row = map.get(key);
      var words = row ? row.dailyNoteWordCount : 0;
      var count = row ? row.dailyNoteCount : 0;
      var level = inRange && count > 0 ? wordLevel(words, thresholds) : 0;

      var cell = document.createElement('span');
      cell.className = 'home-heatmap__cell' + (isFuture ? ' is-future' : '');
      cell.dataset.level = String(level);
      cell.dataset.date = key;
      cell.dataset.words = String(words);
      cell.dataset.count = String(count);
      fragment.appendChild(cell);
    }

    heatmap.appendChild(fragment);
  }

  function fetchRecords() {
    if (CONFIG.statsSource === 'posts' || !CONFIG.apiUrl) {
      return Promise.resolve(getPostRecords());
    }
    return fetch(CONFIG.apiUrl)
      .then(function (res) {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then(function (data) {
        var list = Array.isArray(data) ? data : (data.data || data.records || []);
        return list.length ? normalizeRecords(list) : getPostRecords();
      })
      .catch(function () {
        return getPostRecords();
      });
  }

  function bindHeaderScroll() {
    var header = document.querySelector('header.site-header');
    if (!header) return;
    function onScroll() {
      header.classList.toggle('scrolled', window.scrollY > 8);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  function init() {
    bindHeaderScroll();
    fetchRecords().then(function (records) {
      var map = buildMap(records);
      updateYesterday(map);
      renderHeatmap(map);
      bindHeatmapEvents();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
