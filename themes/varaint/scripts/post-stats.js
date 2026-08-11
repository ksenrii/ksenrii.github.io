'use strict';

function stripFrontMatter(raw) {
  if (!raw) return '';
  return raw.replace(/^---[\r\n]+[\s\S]*?[\r\n]+---[\r\n]*/, '');
}

function countPostWords(post) {
  var text = post.content || post._content || '';
  if (!text && post.raw) {
    text = stripFrontMatter(post.raw);
  }
  return text
    .replace(/```[\s\S]*?```/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/[#>*`[\]()!_~\-]/g, '')
    .replace(/\s+/g, '')
    .length;
}

function pad2(n) {
  return n < 10 ? '0' + n : String(n);
}

function formatDate(d) {
  return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
}

function parseDate(str) {
  var parts = String(str).slice(0, 10).split('-').map(Number);
  return new Date(parts[0], parts[1] - 1, parts[2]);
}

function addDays(date, n) {
  var d = new Date(date.getTime());
  d.setDate(d.getDate() + n);
  return d;
}

function buildStatsByDay(site, dateFormat) {
  var statsByDay = {};

  site.posts.sort('date', 1).forEach(function (post) {
    if (post.published === false) return;

    var day = dateFormat(post.date, 'YYYY-MM-DD');
    if (!statsByDay[day]) {
      statsByDay[day] = { dailyNoteCount: 0, dailyNoteWordCount: 0 };
    }
    statsByDay[day].dailyNoteCount += 1;
    statsByDay[day].dailyNoteWordCount += countPostWords(post);
  });

  return statsByDay;
}

function statsByDayToList(statsByDay) {
  return Object.keys(statsByDay)
    .sort()
    .map(function (day) {
      return {
        todayTime: day,
        dailyNoteCount: statsByDay[day].dailyNoteCount,
        dailyNoteWordCount: statsByDay[day].dailyNoteWordCount
      };
    });
}

hexo.extend.helper.register('home_post_stats', function () {
  return statsByDayToList(buildStatsByDay(this.site, this.date));
});

hexo.extend.helper.register('home_yesterday_stats', function () {
  var statsByDay = buildStatsByDay(this.site, this.date);
  var yesterday = new Date();
  yesterday.setHours(0, 0, 0, 0);
  yesterday = addDays(yesterday, -1);
  var key = formatDate(yesterday);
  var row = statsByDay[key];

  return {
    date: key,
    dailyNoteCount: row ? row.dailyNoteCount : 0,
    dailyNoteWordCount: row ? row.dailyNoteWordCount : 0
  };
});
