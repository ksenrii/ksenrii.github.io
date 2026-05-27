/**
 * 首页：热力图由 JS 渲染 + 悬停/点击显示 tooltip
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
  var pinnedCell = null;

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

  function resolveCell(target) {
    if (!target || !target.closest) return null;
    var cell = target.closest('.home-heatmap__cell');
    if (!cell || !heatmap || !heatmap.contains(cell)) return null;
    if (cell.classList.contains('is-future')) return null;
    return cell;
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

    var x = clientX;
    var y = clientY;
    if (typeof x !== 'number' || typeof y !== 'number') {
      var rect = cell.getBoundingClientRect();
      x = rect.left + rect.width / 2;
      y = rect.top;
    }

    tooltip.style.left = x + 'px';
    tooltip.style.top = y + 'px';
    tooltip.classList.add('visible');
    tooltip.setAttribute('aria-hidden', 'false');
  }

  function hideTooltip() {
    if (!tooltip) return;
    tooltip.classList.remove('visible');
    tooltip.setAttribute('aria-hidden', 'true');
    pinnedCell = null;
  }

  function bindHeatmapEvents() {
    if (!heatmap) return;

    heatmap.addEventListener('mouseover', function (e) {
      var cell = resolveCell(e.target);
      if (!cell || pinnedCell) return;
      showTooltip(cell, e.clientX, e.clientY);
    });

    heatmap.addEventListener('mousemove', function (e) {
      var cell = resolveCell(e.target);
      if (!cell || pinnedCell) return;
      showTooltip(cell, e.clientX, e.clientY);
    });

    heatmap.addEventListener('mouseout', function (e) {
      if (pinnedCell) return;
      var fromCell = resolveCell(e.target);
      if (!fromCell) return;
      var toCell = resolveCell(e.relatedTarget);
      if (!toCell) hideTooltip();
    });

    heatmap.addEventListener('click', function (e) {
      var cell = resolveCell(e.target);
      if (!cell) return;
      e.preventDefault();
      e.stopPropagation();
      if (pinnedCell === cell) {
        hideTooltip();
        return;
      }
      pinnedCell = cell;
      showTooltip(cell, e.clientX, e.clientY);
    });

    heatmap.addEventListener('focusin', function (e) {
      var cell = resolveCell(e.target);
      if (!cell) return;
      showTooltip(cell);
    });

    heatmap.addEventListener('focusout', function (e) {
      if (pinnedCell) return;
      var fromCell = resolveCell(e.target);
      if (!fromCell) return;
      var toCell = resolveCell(e.relatedTarget);
      if (!toCell) hideTooltip();
    });

    heatmap.addEventListener('touchstart', function (e) {
      var touch = e.changedTouches[0];
      if (!touch) return;
      var cell = resolveCell(document.elementFromPoint(touch.clientX, touch.clientY));
      if (!cell) return;
      pinnedCell = cell;
      showTooltip(cell, touch.clientX, touch.clientY);
    }, { passive: true });

    document.addEventListener('click', function (e) {
      if (!pinnedCell) return;
      if (heatmap.contains(e.target)) return;
      hideTooltip();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') hideTooltip();
    });
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
      cell.setAttribute('title', '');
      cell.setAttribute('tabindex', inRange && !isFuture ? '0' : '-1');
      cell.setAttribute('role', 'gridcell');
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
