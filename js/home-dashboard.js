(function () {
  var CONFIG = window.HOME_CONFIG || {
    displayStart: '2026-01-01',
    statsSource: 'posts',
    apiUrl: ''
  };

  var tooltip = document.getElementById('home-tooltip');

  function $(id) {
    return document.getElementById(id);
  }

  function parseDate(str) {
    var parts = str.split('-').map(Number);
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

  function getYesterday() {
    var t = new Date();
    t.setHours(0, 0, 0, 0);
    return addDays(t, -1);
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

  /** 从 Hexo 构建时注入的 _posts 统计 */
  function getPostRecords() {
    return Array.isArray(window.HOME_POST_STATS) ? window.HOME_POST_STATS : [];
  }

  function fetchRecords() {
    if (CONFIG.statsSource === 'posts') {
      return Promise.resolve(getPostRecords());
    }
    if (!CONFIG.apiUrl) {
      return Promise.resolve(getPostRecords());
    }
    return fetch(CONFIG.apiUrl)
      .then(function (res) {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then(function (data) {
        var list = Array.isArray(data) ? data : (data.data || data.records || []);
        return list.length ? list : getPostRecords();
      })
      .catch(function () {
        return getPostRecords();
      });
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

  function renderYesterday(map) {
    var yesterday = getYesterday();
    var key = formatDate(yesterday);
    var row = map.get(key);
    $('yesterday-count').textContent = row ? row.dailyNoteCount : 0;
    $('yesterday-words').textContent = row
      ? row.dailyNoteWordCount.toLocaleString()
      : 0;
    $('yesterday-date').textContent = '统计日期：' + key;
  }

  function showTooltip(e) {
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
    tooltip.style.left = e.clientX + 'px';
    tooltip.style.top = (e.clientY - 12) + 'px';
  }

  function hideTooltip() {
    tooltip.classList.remove('visible');
  }

  function renderHeatmap(map) {
    var container = $('heatmap');
    if (!container) return;
    container.innerHTML = '';

    var displayStart = parseDate(CONFIG.displayStart);
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
      cell.className = 'home-heatmap__cell';
      if (isFuture) cell.classList.add('is-future');
      cell.dataset.level = String(level);
      cell.dataset.date = key;
      cell.dataset.words = String(words);
      cell.dataset.count = String(count);

      if (inRange && !isFuture) {
        cell.addEventListener('mouseenter', showTooltip);
        cell.addEventListener('mousemove', moveTooltip);
        cell.addEventListener('mouseleave', hideTooltip);
      }

      fragment.appendChild(cell);
    }

    container.appendChild(fragment);
  }

  function init() {
    fetchRecords().then(function (records) {
      var map = buildMap(records);
      renderYesterday(map);
      renderHeatmap(map);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
