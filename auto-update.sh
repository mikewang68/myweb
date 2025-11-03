#!/bin/bash

# 自动更新脚本 - 每天凌晨2点执行
# 在crontab中添加: 0 2 * * * /path/to/auto-update.sh

echo "=== Mike的研究空间自动更新 ==="
echo "更新时间: $(date)"

# 检查是否有新版本
echo "检查GitHub是否有更新..."
cd /path/to/your/app/directory

# 拉取最新代码
git fetch origin
LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse @{u})

if [ $LOCAL = $REMOTE ]; then
    echo "没有新版本，无需更新"
else
    echo "发现新版本，开始更新..."

    # 拉取最新代码
    git pull origin main

    # 重新构建镜像
    docker-compose build --no-cache

    # 重启服务
    docker-compose down
    docker-compose up -d

    echo "更新完成！"
fi

echo "=== 自动更新完成 ==="

