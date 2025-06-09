@echo off
echo ========================================
echo    OmniLife 简单部署到 GitHub
echo ========================================
echo.

REM 检查是否在正确的目录
if not exist "package.json" (
    echo 错误：请在项目根目录运行此脚本
    pause
    exit /b 1
)

echo 准备部署...

REM 删除大文件夹
echo 删除 node_modules...
if exist "node_modules" rmdir /s /q "node_modules"

echo 删除 .next...
if exist ".next" rmdir /s /q ".next"

echo 删除 dist...
if exist "dist" rmdir /s /q "dist"

REM 初始化 Git
echo 初始化 Git...
git init
git branch -M main

REM 设置远程仓库
echo 设置远程仓库...
git remote remove origin
git remote add origin https://github.com/velar-0831/omnilife.git

REM 添加文件
echo 添加文件...
git add .

REM 提交
echo 提交...
git commit -m "Deploy OmniLife v1.0"

REM 推送
echo 推送到 GitHub...
git push -u origin main --force

echo.
echo 完成！现在可以在 Vercel 重新部署了
echo GitHub: https://github.com/velar-0831/omnilife
echo.
pause
