# fix-typora-images.ps1
# 使用方法：写完博客后，在 PowerShell 中运行此脚本
# 它会把 Typora 本地路径替换为 /images/ 路径，并复制图片到 source/images/
#
# 用法：
#   cd d:\blog\hexo-blog
#   .\fix-typora-images.ps1

$typoraDir = "$env:APPDATA\Typora\typora-user-images"
$imagesDir = "d:\blog\hexo-blog\source\images"
$postsDir = "d:\blog\hexo-blog\source\_posts"

# 1. 复制 Typora 图片到 source/images/
if (Test-Path $typoraDir) {
    $files = Get-ChildItem "$typoraDir\image-*.png"
    if ($files.Count -gt 0) {
        $files | Copy-Item -Destination $imagesDir -Force
        Write-Host "已复制 $($files.Count) 张图片到 source/images/" -ForegroundColor Green
    } else {
        Write-Host "没有新的 Typora 图片需要复制" -ForegroundColor Yellow
    }
} else {
    Write-Host "Typora 图片目录不存在: $typoraDir" -ForegroundColor Red
}

# 2. 替换所有文章中的 Typora 本地路径为 /images/
$replaced = 0
$files = Get-ChildItem $postsDir -Filter '*.md'
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    $newContent = $content -replace [regex]::Escape("$typoraDir\"), '/images/'
    if ($content -ne $newContent) {
        Set-Content $file.FullName -Value $newContent -Encoding UTF8 -NoNewline
        $count = ($content | Select-String -Pattern ([regex]::Escape("$typoraDir\")) -AllMatches).Matches.Count
        Write-Host "  $($file.Name) - 替换了 $count 个路径" -ForegroundColor Cyan
        $replaced += $count
    }
}

if ($replaced -eq 0) {
    Write-Host "没有需要替换的 Typora 路径" -ForegroundColor Yellow
} else {
    Write-Host "总共替换了 $replaced 个图片路径" -ForegroundColor Green
}

Write-Host "`n完成！现在可以 hexo clean; hexo g; hexo d 部署了" -ForegroundColor Green
