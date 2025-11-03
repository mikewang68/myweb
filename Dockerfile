# 使用Node.js官方镜像
FROM node:18-alpine

# 安装 Git 和 curl（用于健康检查）
RUN apk update && apk add git curl

# 设置工作目录
WORKDIR /app

# 从GitHub拉取最新代码
RUN git clone https://github.com/mikewang68/myweb.git .

# 安装依赖
RUN npm ci --only=production

# 创建课程目录
RUN mkdir -p courses

# 暴露端口
EXPOSE 3999

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3999/ || exit 1

# 复制启动脚本
COPY start-with-git-pull.sh .
RUN chmod +x start-with-git-pull.sh

# 启动命令
CMD ["./start-with-git-pull.sh"]
