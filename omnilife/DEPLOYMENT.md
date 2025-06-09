# 🚀 OmniLife 部署指南

本指南将帮助您将 OmniLife 全域生活平台部署到各种环境中。

## 📋 目录

- [快速部署 (Vercel)](#快速部署-vercel)
- [Docker 部署](#docker-部署)
- [传统服务器部署](#传统服务器部署)
- [云平台部署](#云平台部署)
- [环境变量配置](#环境变量配置)
- [性能优化](#性能优化)
- [监控和维护](#监控和维护)

## 🌐 快速部署 (Vercel) - 推荐

### 方法一：GitHub 集成部署

1. **准备代码仓库**
   ```bash
   # 1. 在GitHub创建新仓库 omnilife
   # 2. 将代码推送到GitHub
   git init
   git add .
   git commit -m "feat: initial commit - OmniLife platform"
   git branch -M main
   git remote add origin https://github.com/your-username/omnilife.git
   git push -u origin main
   ```

2. **Vercel 部署**
   - 访问 [vercel.com](https://vercel.com)
   - 使用GitHub账号登录
   - 点击 "New Project"
   - 选择您的 omnilife 仓库
   - 点击 "Deploy"

3. **配置环境变量**
   在Vercel项目设置中添加：
   ```
   NODE_ENV=production
   NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
   NEXT_PUBLIC_API_BASE_URL=https://your-project.vercel.app/api
   ```

### 方法二：Vercel CLI 部署

1. **安装 Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **登录并部署**
   ```bash
   vercel login
   vercel --prod
   ```

## 🐳 Docker 部署

### 单容器部署

1. **构建镜像**
   ```bash
   docker build -t omnilife .
   ```

2. **运行容器**
   ```bash
   docker run -p 3000:3000 \
     -e NODE_ENV=production \
     -e NEXT_PUBLIC_APP_URL=http://localhost:3000 \
     omnilife
   ```

### Docker Compose 部署

1. **启动完整环境**
   ```bash
   docker-compose up -d
   ```

2. **查看服务状态**
   ```bash
   docker-compose ps
   ```

3. **查看日志**
   ```bash
   docker-compose logs -f omnilife-app
   ```

## 🖥️ 传统服务器部署

### 前置要求

- Node.js 18.0.0+
- npm 8.0.0+
- PM2 (进程管理)

### 部署步骤

1. **服务器准备**
   ```bash
   # 安装Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # 安装PM2
   npm install -g pm2
   ```

2. **代码部署**
   ```bash
   # 克隆代码
   git clone https://github.com/your-username/omnilife.git
   cd omnilife

   # 安装依赖
   npm ci --production

   # 构建项目
   npm run build
   ```

3. **PM2 配置**
   ```bash
   # 创建 ecosystem.config.js
   cat > ecosystem.config.js << EOF
   module.exports = {
     apps: [{
       name: 'omnilife',
       script: 'npm',
       args: 'start',
       instances: 'max',
       exec_mode: 'cluster',
       env: {
         NODE_ENV: 'production',
         PORT: 3000
       }
     }]
   }
   EOF

   # 启动应用
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

4. **Nginx 配置**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## ☁️ 云平台部署

### AWS 部署

1. **使用 AWS Amplify**
   ```bash
   npm install -g @aws-amplify/cli
   amplify init
   amplify add hosting
   amplify publish
   ```

2. **使用 AWS ECS**
   - 创建 ECS 集群
   - 构建 Docker 镜像并推送到 ECR
   - 创建任务定义和服务

### 阿里云部署

1. **使用阿里云 ECS**
   - 购买 ECS 实例
   - 按照传统服务器部署步骤操作

2. **使用阿里云容器服务**
   - 创建 Kubernetes 集群
   - 部署 Docker 镜像

### 腾讯云部署

1. **使用腾讯云 CVM**
   - 购买 CVM 实例
   - 按照传统服务器部署步骤操作

## 🔧 环境变量配置

### 必需变量

```bash
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_API_BASE_URL=https://your-domain.com/api
```

### 可选变量

```bash
# 功能开关
ENABLE_MUSIC_MODULE=true
ENABLE_NEWS_MODULE=true
ENABLE_SHOPPING_MODULE=true
ENABLE_AUTO_MODULE=true
ENABLE_LIFE_MODULE=true
ENABLE_GROUP_MODULE=true

# 性能配置
ENABLE_CACHE=true
CACHE_TTL=3600

# 安全配置
CORS_ORIGIN=https://your-domain.com
RATE_LIMIT_MAX=100

# 监控配置
ENABLE_PERFORMANCE_MONITORING=true
ENABLE_ERROR_TRACKING=true
```

## ⚡ 性能优化

### 构建优化

1. **启用压缩**
   ```javascript
   // next.config.js
   module.exports = {
     compress: true,
     swcMinify: true
   }
   ```

2. **图片优化**
   ```javascript
   // next.config.js
   module.exports = {
     images: {
       formats: ['image/webp', 'image/avif'],
       minimumCacheTTL: 60
     }
   }
   ```

### 缓存策略

1. **静态资源缓存**
   ```nginx
   location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
       expires 1y;
       add_header Cache-Control "public, immutable";
   }
   ```

2. **API 缓存**
   ```javascript
   // 在API路由中添加缓存头
   res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate')
   ```

## 📊 监控和维护

### 健康检查

1. **创建健康检查端点**
   ```javascript
   // pages/api/health.js
   export default function handler(req, res) {
     res.status(200).json({ 
       status: 'ok', 
       timestamp: new Date().toISOString() 
     })
   }
   ```

2. **监控脚本**
   ```bash
   #!/bin/bash
   # health-check.sh
   response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/health)
   if [ $response != "200" ]; then
       echo "Health check failed: $response"
       # 重启服务
       pm2 restart omnilife
   fi
   ```

### 日志管理

1. **PM2 日志**
   ```bash
   pm2 logs omnilife
   pm2 logs omnilife --lines 100
   ```

2. **日志轮转**
   ```bash
   pm2 install pm2-logrotate
   pm2 set pm2-logrotate:max_size 10M
   pm2 set pm2-logrotate:retain 30
   ```

### 备份策略

1. **代码备份**
   ```bash
   # 定期备份脚本
   #!/bin/bash
   tar -czf backup-$(date +%Y%m%d).tar.gz /path/to/omnilife
   ```

2. **数据库备份**
   ```bash
   # 如果使用数据库
   pg_dump omnilife > backup-$(date +%Y%m%d).sql
   ```

## 🔒 安全配置

### SSL 证书

1. **Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

2. **自动续期**
   ```bash
   sudo crontab -e
   # 添加: 0 12 * * * /usr/bin/certbot renew --quiet
   ```

### 防火墙配置

```bash
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

## 🚨 故障排除

### 常见问题

1. **构建失败**
   ```bash
   # 清理缓存
   rm -rf .next node_modules
   npm install
   npm run build
   ```

2. **内存不足**
   ```bash
   # 增加Node.js内存限制
   NODE_OPTIONS="--max-old-space-size=4096" npm run build
   ```

3. **端口占用**
   ```bash
   # 查找占用端口的进程
   lsof -i :3000
   # 杀死进程
   kill -9 <PID>
   ```

## 📞 支持

如果遇到部署问题，请：

1. 查看项目日志
2. 检查环境变量配置
3. 确认依赖版本兼容性
4. 提交 GitHub Issue

---

**🎉 祝您部署成功！**
