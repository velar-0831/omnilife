#!/bin/bash

# OmniLife 部署脚本

echo "🚀 开始部署 OmniLife 全域生活平台..."

# 检查Node.js版本
echo "📋 检查环境..."
node_version=$(node -v)
echo "Node.js 版本: $node_version"

if [[ "$node_version" < "v18" ]]; then
    echo "❌ 错误: 需要 Node.js 18.0.0 或更高版本"
    exit 1
fi

# 清理旧的构建文件
echo "🧹 清理旧文件..."
rm -rf .next
rm -rf out
rm -rf dist

# 安装依赖
echo "📦 安装依赖..."
npm ci --production=false

# 运行类型检查
echo "🔍 运行类型检查..."
npm run type-check

# 运行代码检查
echo "🔍 运行代码检查..."
npm run lint

# 运行测试
echo "🧪 运行测试..."
npm run test:ci

# 构建项目
echo "🏗️ 构建项目..."
npm run build

# 检查构建结果
if [ ! -d ".next" ]; then
    echo "❌ 构建失败: .next 目录不存在"
    exit 1
fi

echo "✅ 构建成功!"

# 如果是Vercel部署
if [ "$VERCEL" = "1" ]; then
    echo "🌐 Vercel 环境检测到，跳过额外步骤"
    exit 0
fi

# 本地部署选项
echo "🚀 准备部署..."
echo "选择部署方式:"
echo "1. 启动生产服务器 (npm start)"
echo "2. 生成静态文件 (npm run export)"
echo "3. Docker 部署"

read -p "请选择 (1-3): " choice

case $choice in
    1)
        echo "🚀 启动生产服务器..."
        npm start
        ;;
    2)
        echo "📦 生成静态文件..."
        npm run export
        echo "✅ 静态文件已生成到 out/ 目录"
        ;;
    3)
        echo "🐳 Docker 部署..."
        docker build -t omnilife .
        docker run -p 3000:3000 omnilife
        ;;
    *)
        echo "❌ 无效选择"
        exit 1
        ;;
esac

echo "🎉 部署完成!"
