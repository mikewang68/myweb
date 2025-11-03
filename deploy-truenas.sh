#!/bin/bash

echo "=== Mike的研究空间 - TrueNAS Scale 部署脚本 ==="

# 检查Docker和Docker Compose
if ! command -v docker &> /dev/null; then
    echo "错误: Docker未安装"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "错误: Docker Compose未安装"
    exit 1
fi

# 创建必要的目录
echo "创建目录结构..."
mkdir -p courses ssl backup

# 生成自签名SSL证书（如果不存在）
if [ ! -f ssl/cert.pem ] || [ ! -f ssl/key.pem ]; then
    echo "生成自签名SSL证书..."
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout ssl/key.pem -out ssl/cert.pem \
        -subj "/C=CN/ST=Beijing/L=Beijing/O=Mike Research/CN=localhost"
fi

# 停止现有服务
echo "停止现有服务..."
docker-compose down

# 构建和启动服务
echo "构建和启动服务..."
docker-compose build --no-cache
docker-compose up -d

# 等待服务启动
echo "等待服务启动..."
sleep 10

# 检查服务状态
echo "检查服务状态..."
docker-compose ps

# 显示访问信息
echo ""
echo "=== 部署完成 ==="
echo "网站地址: http://localhost:3000"
echo "n8n管理界面: http://localhost:5678"
echo "MongoDB: localhost:27017"
echo ""
echo "查看日志: docker-compose logs -f"
echo "停止服务: docker-compose down"
echo "重启服务: docker-compose restart"

