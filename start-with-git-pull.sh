#!/bin/bash

# 切换到应用目录
cd /app

# 从GitHub拉取最新代码
echo "从GitHub拉取最新代码..."
git pull origin main

# 安装依赖（如果有更新）
echo "检查依赖更新..."
npm ci --only=production

# 启动应用
echo "启动应用..."
node server.js

