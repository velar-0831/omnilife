@echo off
echo ========================================
echo    OmniLife 轻量部署到 GitHub
echo ========================================
echo.

REM 检查是否在正确的目录
if not exist "package.json" (
    echo ❌ 错误：请在项目根目录运行此脚本
    pause
    exit /b 1
)

echo 📋 准备部署轻量版本...
echo.

REM 删除大文件和缓存
echo 🧹 清理大文件...
if exist "node_modules" (
    echo   - 删除 node_modules 文件夹
    rmdir /s /q "node_modules" 2>nul
)
if exist ".next" (
    echo   - 删除 .next 文件夹
    rmdir /s /q ".next" 2>nul
)
if exist "dist" (
    echo   - 删除 dist 文件夹
    rmdir /s /q "dist" 2>nul
)
if exist "coverage" (
    echo   - 删除 coverage 文件夹
    rmdir /s /q "coverage" 2>nul
)
if exist "*.tsbuildinfo" (
    echo   - 删除 TypeScript 构建缓存
    del *.tsbuildinfo 2>nul
)

echo ✅ 清理完成！
echo.

REM 初始化 Git 仓库
if not exist ".git" (
    echo 🔧 初始化 Git 仓库...
    git init
    git branch -M main
    echo ✅ Git 仓库初始化完成
) else (
    echo 📁 Git 仓库已存在
)
echo.

REM 设置远程仓库
echo 🔗 设置远程仓库...
git remote remove origin 2>nul
git remote add origin https://github.com/velar-0831/omnilife.git
echo ✅ 远程仓库设置完成
echo.

REM 添加文件
echo 📦 添加源代码文件...
git add .
echo ✅ 文件添加完成
echo.

REM 提交
echo 💾 提交更改...
git commit -m "🚀 Deploy OmniLife v1.0 - 全域生活平台轻量版"
echo ✅ 提交完成
echo.

REM 推送到 GitHub
echo 🌐 推送到 GitHub...
git push -u origin main --force
echo.

if %ERRORLEVEL% EQU 0 (
    echo ========================================
    echo           🎉 部署成功！
    echo ========================================
    echo.
    echo 📍 GitHub 仓库: https://github.com/velar-0831/omnilife
    echo.
    echo 📋 下一步操作：
    echo 1. 回到 Vercel 控制台
    echo 2. 点击 "检查部署" 或重新导入项目  
    echo 3. 确认框架预设为 Next.js
    echo 4. 点击部署按钮
    echo.
    echo 💡 提示：现在源代码是轻量版，Vercel 会自动安装依赖
) else (
    echo ========================================
    echo           ❌ 部署失败
    echo ========================================
    echo.
    echo 可能的原因：
    echo 1. 网络连接问题
    echo 2. GitHub 认证问题
    echo 3. 仓库权限问题
    echo.
    echo 请检查网络连接和 GitHub 登录状态
)

echo.
pause
