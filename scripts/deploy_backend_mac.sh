#!/bin/bash
# 在 macOS 上部署并启动后端服务
set -e

cd "$(dirname "$0")/../backend/pet-feeder-backend"

# 安装依赖
npm install

# 构建项目
npm run build

# 启动（生产模式）
node dist/main.js
