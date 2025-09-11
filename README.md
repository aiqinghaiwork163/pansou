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

## 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm run dev
```

## 构建

```bash
# 构建生产版本
pnpm run build
```

## 访问地址

您的应用已部署到：https://c45ac6a8.wangpan-7hr.pages.dev