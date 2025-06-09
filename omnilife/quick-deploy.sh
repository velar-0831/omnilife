#!/bin/bash

# OmniLife 快速部署脚本
# 支持多种部署方式

echo "🚀 OmniLife 全域生活平台 - 快速部署"
echo "=================================="

# 检查环境
echo "📋 检查部署环境..."

# 检查Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js 18+"
    exit 1
fi

node_version=$(node -v | cut -d'v' -f2)
echo "✅ Node.js 版本: v$node_version"

# 检查npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm 未安装"
    exit 1
fi

npm_version=$(npm -v)
echo "✅ npm 版本: $npm_version"

echo ""
echo "🎯 选择部署方式:"
echo "1. 🌐 Vercel 部署 (推荐)"
echo "2. 🐳 Docker 部署"
echo "3. 🖥️  本地生产部署"
echo "4. ☁️  云服务器部署"
echo "5. 📦 生成静态文件"

read -p "请选择部署方式 (1-5): " choice

case $choice in
    1)
        echo ""
        echo "🌐 Vercel 部署指南"
        echo "=================="
        echo "1. 访问 https://vercel.com"
        echo "2. 使用GitHub账号登录"
        echo "3. 点击 'New Project'"
        echo "4. 导入您的GitHub仓库"
        echo "5. 点击 'Deploy'"
        echo ""
        echo "📋 需要设置的环境变量:"
        echo "NODE_ENV=production"
        echo "NEXT_PUBLIC_APP_URL=https://your-project.vercel.app"
        echo "NEXT_PUBLIC_API_BASE_URL=https://your-project.vercel.app/api"
        echo ""
        echo "🎉 部署完成后，您将获得一个在线链接！"
        ;;
        
    2)
        echo ""
        echo "🐳 Docker 部署"
        echo "=============="
        
        # 检查Docker
        if ! command -v docker &> /dev/null; then
            echo "❌ Docker 未安装，请先安装 Docker"
            exit 1
        fi
        
        echo "📦 构建 Docker 镜像..."
        docker build -t omnilife .
        
        if [ $? -eq 0 ]; then
            echo "✅ 镜像构建成功"
            echo "🚀 启动容器..."
            docker run -d -p 3000:3000 --name omnilife-app omnilife
            
            if [ $? -eq 0 ]; then
                echo "✅ 容器启动成功"
                echo "🌐 访问地址: http://localhost:3000"
                echo "📊 查看日志: docker logs omnilife-app"
                echo "🛑 停止容器: docker stop omnilife-app"
            else
                echo "❌ 容器启动失败"
            fi
        else
            echo "❌ 镜像构建失败"
        fi
        ;;
        
    3)
        echo ""
        echo "🖥️ 本地生产部署"
        echo "==============="
        
        echo "📦 安装依赖..."
        npm ci
        
        echo "🔍 运行类型检查..."
        npm run type-check
        
        echo "🏗️ 构建项目..."
        npm run build
        
        if [ $? -eq 0 ]; then
            echo "✅ 构建成功"
            echo "🚀 启动生产服务器..."
            echo "🌐 访问地址: http://localhost:3000"
            npm start
        else
            echo "❌ 构建失败"
        fi
        ;;
        
    4)
        echo ""
        echo "☁️ 云服务器部署"
        echo "==============="
        
        echo "📦 安装生产依赖..."
        npm ci --production
        
        echo "🏗️ 构建项目..."
        npm run build
        
        if [ $? -eq 0 ]; then
            echo "✅ 构建成功"
            
            # 检查PM2
            if command -v pm2 &> /dev/null; then
                echo "🚀 使用 PM2 启动..."
                pm2 start npm --name "omnilife" -- start
                pm2 save
                echo "✅ PM2 启动成功"
                echo "📊 查看状态: pm2 status"
                echo "📋 查看日志: pm2 logs omnilife"
            else
                echo "⚠️  PM2 未安装，使用普通方式启动"
                echo "💡 建议安装 PM2: npm install -g pm2"
                echo "🚀 启动服务器..."
                npm start
            fi
        else
            echo "❌ 构建失败"
        fi
        ;;
        
    5)
        echo ""
        echo "📦 生成静态文件"
        echo "==============="
        
        echo "📦 安装依赖..."
        npm ci
        
        echo "🏗️ 构建项目..."
        npm run build
        
        if [ $? -eq 0 ]; then
            echo "✅ 构建成功"
            echo "📁 静态文件位置: .next/"
            echo "🌐 可以部署到任何静态文件服务器"
            echo "💡 推荐: Nginx, Apache, CDN"
        else
            echo "❌ 构建失败"
        fi
        ;;
        
    *)
        echo "❌ 无效选择"
        exit 1
        ;;
esac

echo ""
echo "🎉 部署完成！"
echo "📚 更多信息请查看 DEPLOYMENT.md"
