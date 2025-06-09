# 🤝 贡献指南

感谢您对 OmniLife 全域生活平台的关注！我们欢迎所有形式的贡献。

## 📋 目录

- [开发环境设置](#开发环境设置)
- [贡献流程](#贡献流程)
- [代码规范](#代码规范)
- [提交规范](#提交规范)
- [测试指南](#测试指南)
- [文档贡献](#文档贡献)

## 🛠️ 开发环境设置

### 前置要求

- Node.js 18.0.0 或更高版本
- npm 8.0.0 或更高版本
- Git

### 安装步骤

1. **Fork 项目**
   ```bash
   # 在 GitHub 上 fork 项目到您的账户
   ```

2. **克隆项目**
   ```bash
   git clone https://github.com/your-username/omnilife.git
   cd omnilife
   ```

3. **安装依赖**
   ```bash
   npm install
   ```

4. **设置环境变量**
   ```bash
   cp .env.example .env.local
   # 编辑 .env.local 文件，填入必要的环境变量
   ```

5. **启动开发服务器**
   ```bash
   npm run dev
   ```

## 🔄 贡献流程

### 1. 创建分支

```bash
# 从 main 分支创建新的功能分支
git checkout -b feature/your-feature-name

# 或者从 develop 分支创建
git checkout -b feature/your-feature-name develop
```

### 2. 开发功能

- 遵循项目的代码规范
- 编写必要的测试
- 确保所有测试通过
- 更新相关文档

### 3. 提交代码

```bash
# 添加文件
git add .

# 提交代码（遵循提交规范）
git commit -m "feat: add new feature"

# 推送到远程分支
git push origin feature/your-feature-name
```

### 4. 创建 Pull Request

1. 在 GitHub 上创建 Pull Request
2. 填写详细的 PR 描述
3. 等待代码审查
4. 根据反馈修改代码

## 📝 代码规范

### TypeScript/JavaScript

- 使用 TypeScript 进行开发
- 遵循 ESLint 配置
- 使用 Prettier 格式化代码
- 优先使用函数式组件和 Hooks

### 组件规范

```typescript
// ✅ 好的示例
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  children: React.ReactNode
  onClick?: () => void
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  disabled = false,
  children,
  onClick 
}: ButtonProps) {
  return (
    <button
      className={cn(
        'rounded-lg font-medium transition-colors',
        variants[variant],
        sizes[size],
        disabled && 'opacity-50 cursor-not-allowed'
      )}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
```

### 样式规范

- 使用 Tailwind CSS 进行样式开发
- 优先使用 Tailwind 类名
- 自定义样式放在 CSS 模块中
- 使用 CSS 变量进行主题定制

### 文件命名

- 组件文件使用 PascalCase：`Button.tsx`
- 工具函数使用 camelCase：`formatDate.ts`
- 页面文件使用 kebab-case：`user-profile.tsx`
- 常量文件使用 UPPER_CASE：`API_ENDPOINTS.ts`

## 📋 提交规范

我们使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

### 提交类型

- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式化（不影响功能）
- `refactor`: 代码重构
- `test`: 添加或修改测试
- `chore`: 构建过程或辅助工具的变动

### 提交格式

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### 示例

```bash
# 新功能
git commit -m "feat(music): add AI recommendation algorithm"

# 修复 bug
git commit -m "fix(auth): resolve login redirect issue"

# 文档更新
git commit -m "docs: update API documentation"

# 重大变更
git commit -m "feat!: change API response format

BREAKING CHANGE: API responses now use camelCase instead of snake_case"
```

## 🧪 测试指南

### 运行测试

```bash
# 运行所有测试
npm test

# 运行测试并监听文件变化
npm run test:watch

# 运行 E2E 测试
npm run test:e2e

# 生成测试覆盖率报告
npm run test:ci
```

### 编写测试

#### 单元测试

```typescript
// Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from './Button'

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('handles click events', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

#### E2E 测试

```typescript
// auth.spec.ts
import { test, expect } from '@playwright/test'

test('user can login', async ({ page }) => {
  await page.goto('/login')
  
  await page.fill('[data-testid="email"]', 'test@example.com')
  await page.fill('[data-testid="password"]', 'password')
  await page.click('[data-testid="login-button"]')
  
  await expect(page).toHaveURL('/dashboard')
})
```

### 测试覆盖率

- 目标覆盖率：70% 以上
- 关键功能必须有测试覆盖
- 新功能必须包含相应测试

## 📚 文档贡献

### 文档类型

- **README.md**: 项目概述和快速开始
- **API 文档**: 接口文档和使用示例
- **组件文档**: 组件使用指南
- **部署文档**: 部署和运维指南

### 文档规范

- 使用 Markdown 格式
- 包含代码示例
- 添加必要的截图
- 保持文档更新

## 🐛 报告问题

### Bug 报告

使用 GitHub Issues 报告 bug，请包含：

- 问题描述
- 复现步骤
- 期望行为
- 实际行为
- 环境信息
- 截图或录屏

### 功能请求

提交功能请求时，请包含：

- 功能描述
- 使用场景
- 预期收益
- 实现建议

## 🎯 开发指南

### 分支策略

- `main`: 生产分支，稳定版本
- `develop`: 开发分支，最新功能
- `feature/*`: 功能分支
- `hotfix/*`: 紧急修复分支
- `release/*`: 发布分支

### 代码审查

所有代码必须经过审查：

- 至少一个维护者审查
- 所有测试必须通过
- 代码覆盖率不能降低
- 遵循项目规范

### 发布流程

1. 从 `develop` 创建 `release/*` 分支
2. 更新版本号和变更日志
3. 测试发布候选版本
4. 合并到 `main` 并打标签
5. 部署到生产环境

## 🙏 致谢

感谢所有为 OmniLife 项目做出贡献的开发者！

## 📞 联系我们

- GitHub Issues: [项目问题](https://github.com/omnilife/omnilife/issues)
- 邮箱: dev@omnilife.com
- 微信群: 扫描二维码加入开发者群

---

再次感谢您的贡献！🎉
