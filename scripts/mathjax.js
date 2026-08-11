"use strict";

// Protect math delimiters ($$...$$, $...$, \[...\], \(...\)) from being
// mangled by the markdown renderer. Converts them to HTML-wrapped MathJax
// delimiters so that MathJax can render them correctly on the client side.

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function protectMathInSegment(segment) {
  return segment
    .replace(/\$\$([\s\S]*?)\$\$/g, function (_, tex) {
      return "\n\n<div class=\"math-display\">\\[\n" + escapeHtml(tex.trim()) + "\n\\]</div>\n\n";
    })
    .replace(/\\\[([\s\S]*?)\\\]/g, function (_, tex) {
      return "\n\n<div class=\"math-display\">\\[\n" + escapeHtml(tex.trim()) + "\n\\]</div>\n\n";
    })
    .replace(/(^|[^\$])\$([^\n$]+?)\$([^\$]|$)/g, function (_, before, tex, after) {
      return before + "<span class=\"math-inline\">\\(" + escapeHtml(tex.trim()) + "\\)</span>" + after;
    });
}

function protectMath(content) {
  var fences = [];
  var fencedPattern = /(```[\s\S]*?```|~~~[\s\S]*?~~~)/g;

  content = content.replace(fencedPattern, function (match) {
    var token = "\u0000FENCE" + fences.length + "\u0000";
    fences.push(match);
    return token;
  });

  content = protectMathInSegment(content);

  fences.forEach(function (fence, index) {
    content = content.replace("\u0000FENCE" + index + "\u0000", fence);
  });

  return content;
}

hexo.extend.filter.register("before_post_render", function (data) {
  if (data && typeof data.content === "string") {
    data.content = protectMath(data.content);
  }
  return data;
});
