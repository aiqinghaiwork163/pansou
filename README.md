# 网盘资源搜索平台

一个高性能的网盘资源搜索应用，支持多源聚合搜索。

## 部署到Cloudflare Pages

### 自动部署（推荐）

1. 将代码推送到GitHub仓库
2. 在Cloudflare Dashboard中连接GitHub仓库
3. 配置构建设置：
   - 构建命令：`npm run build`
   - 构建输出目录：`dist/static`

### 手动部署

使用Wrangler CLI进行手动部署：

```bash
# 安装Wrangler
npm install -g wrangler

# 登录到Cloudflare
wrangler login

# 构建并部署
npm run deploy
```

### 环境变量

在Cloudflare Pages中设置以下环境变量：

- `VITE_API_URL`: `https://api.aiqinghaiwork.cn`
- `VITE_SUPABASE_URL`: Supabase 项目 URL
- `VITE_SUPABASE_ANON_KEY`: Supabase anon public key

## 本地开发

```bash
# 安装依赖
npm ci

# 启动开发服务器
npm run dev
```

## 构建

```bash
# 构建生产版本
npm run build
```

## 质量检查

```bash
npm run typecheck
npm test
npm audit
```

## 安全方案

- 认证与管理员权限迁移方案见 [`docs/auth-admin-plan.md`](docs/auth-admin-plan.md)。

## 访问地址

您的应用已部署到：https://c45ac6a8.wangpan-7hr.pages.dev