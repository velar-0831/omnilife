@echo off
chcp 65001 >nul
title OmniLife 快速部署

echo.
echo 🚀 OmniLife 全域生活平台 - 快速部署
echo ==================================

echo.
echo 📋 检查部署环境...

:: 检查Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js 未安装，请先安装 Node.js 18+
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set node_version=%%i
echo ✅ Node.js 版本: %node_version%

:: 检查npm
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm 未安装
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm --version') do set npm_version=%%i
echo ✅ npm 版本: %npm_version%

echo.
echo 🎯 选择部署方式:
echo 1. 🌐 Vercel 部署 (推荐)
echo 2. 🐳 Docker 部署
echo 3. 🖥️  本地生产部署
echo 4. 📦 生成静态文件
echo 5. 🔧 开发模式启动

set /p choice="请选择部署方式 (1-5): "

if "%choice%"=="1" goto vercel
if "%choice%"=="2" goto docker
if "%choice%"=="3" goto local
if "%choice%"=="4" goto static
if "%choice%"=="5" goto dev
goto invalid

:vercel
echo.
echo 🌐 Vercel 部署指南
echo ==================
echo 1. 访问 https://vercel.com
echo 2. 使用GitHub账号登录
echo 3. 点击 'New Project'
echo 4. 导入您的GitHub仓库
echo 5. 点击 'Deploy'
echo.
echo 📋 需要设置的环境变量:
echo NODE_ENV=production
echo NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
echo NEXT_PUBLIC_API_BASE_URL=https://your-project.vercel.app/api
echo.
echo 🎉 部署完成后，您将获得一个在线链接！
goto end

:docker
echo.
echo 🐳 Docker 部署
echo ==============

:: 检查Docker
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker 未安装，请先安装 Docker Desktop
    pause
    exit /b 1
)

echo 📦 构建 Docker 镜像...
docker build -t omnilife .

if %errorlevel% equ 0 (
    echo ✅ 镜像构建成功
    echo 🚀 启动容器...
    docker run -d -p 3000:3000 --name omnilife-app omnilife
    
    if %errorlevel% equ 0 (
        echo ✅ 容器启动成功
        echo 🌐 访问地址: http://localhost:3000
        echo 📊 查看日志: docker logs omnilife-app
        echo 🛑 停止容器: docker stop omnilife-app
        start http://localhost:3000
    ) else (
        echo ❌ 容器启动失败
    )
) else (
    echo ❌ 镜像构建失败
)
goto end

:local
echo.
echo 🖥️ 本地生产部署
echo ===============

echo 📦 安装依赖...
call npm ci

echo 🔍 运行类型检查...
call npm run type-check

echo 🏗️ 构建项目...
call npm run build

if %errorlevel% equ 0 (
    echo ✅ 构建成功
    echo 🚀 启动生产服务器...
    echo 🌐 访问地址: http://localhost:3000
    start http://localhost:3000
    call npm start
) else (
    echo ❌ 构建失败
)
goto end

:static
echo.
echo 📦 生成静态文件
echo ===============

echo 📦 安装依赖...
call npm ci

echo 🏗️ 构建项目...
call npm run build

if %errorlevel% equ 0 (
    echo ✅ 构建成功
    echo 📁 静态文件位置: .next\
    echo 🌐 可以部署到任何静态文件服务器
    echo 💡 推荐: IIS, Nginx, Apache, CDN
    explorer .next
) else (
    echo ❌ 构建失败
)
goto end

:dev
echo.
echo 🔧 开发模式启动
echo ===============

echo 📦 安装依赖...
call npm install

echo 🚀 启动开发服务器...
echo 🌐 访问地址: http://localhost:3000
start http://localhost:3000
call npm run dev
goto end

:invalid
echo ❌ 无效选择
goto end

:end
echo.
echo 🎉 操作完成！
echo 📚 更多信息请查看 DEPLOYMENT.md
pause
