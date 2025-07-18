# 部署指南

本文档介绍如何在 Linux 服务器以及 macOS 系统上部署本仓库的后端服务和前端小程序示例。

## 仓库结构

- `backend/pet-feeder-backend/` - NestJS 实现的后端 API 服务
- `frontend/miniapp/` - 基于 uni-app 的微信小程序示例
- `frontend/admin/` 与 `frontend/admin-vue/` - 简易管理端示例，可直接作为静态文件部署

## 环境准备

- Node.js 18 或更高版本
- MySQL 数据库
- 可选：`pm2` 或 `systemd` 用于后台运行服务

### 在 macOS 上安装依赖

在 macOS 系统上推荐使用 [Homebrew](https://brew.sh) 安装 Node.js 和 MySQL：

```bash
brew install node
brew install mysql
```

## 后端部署步骤

1. 进入后端目录并安装依赖：
   ```bash
   cd backend/pet-feeder-backend
   npm install
   ```
2. 根据环境修改 `backend/pet-feeder-backend/config/<env>.json` 配置：
   - `port`：服务端口
   - `jwtSecret`：JWT 加密密钥
   - `wechat.appid`、`wechat.secret`：微信相关配置
   - `frontendDomain`：前端域名
   - `redis`、`kafka` 等服务信息
   - `db`：数据库连接参数
3. 构建并启动：
   ```bash
   npm run build
   npm run start:prod
   ```
   或者使用 `pm2`/`systemd` 等方式后台运行。
4. 也可以执行脚本 `scripts/deploy_backend.sh` 完成安装和启动。
   macOS 用户可执行 `scripts/deploy_backend_mac.sh`，效果相同。

## 小程序部署步骤

1. 使用 HBuilderX 打开 `frontend/miniapp/` 目录。
2. 根据需求配置小程序的 AppID 等信息。
3. 通过 HBuilderX 构建为微信小程序并上传发布。
4. 如仅需打包源码，可运行 `scripts/package_miniapp.sh`，打包后的文件位于 `dist/miniapp/`。

## 管理端静态页面

`frontend/admin/` 与 `frontend/admin-vue/` 下的文件均可直接部署到任意静态 Web 服务器（如 Nginx）。无需额外构建步骤，只需将目录中的文件复制到 Web 根目录即可。

