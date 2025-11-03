#!/bin/bash

echo "启动Mike的研究空间网站..."

# 检查端口是否被占用
if lsof -i :3001 >/dev/null; then
  echo "端口3001被占用，尝试杀死进程..."
  pkill -f "node.*simple-server"
  sleep 2
fi

# 启动服务器
echo "启动服务器..."
node simple-server.js &
SERVER_PID=$!

echo "服务器已启动，PID: $SERVER_PID"
echo "访问地址: http://localhost:3001"
echo "按 Ctrl+C 停止服务器"

# 等待用户中断
wait $SERVER_PID
