# 使用 Node.js 官方轻量镜像
FROM node:18-alpine

# 安装 git 和 curl（健康检查需要）
RUN apk add --no-cache git curl

# 设置工作目录
WORKDIR /app

# 克隆最新代码
RUN git clone --depth 1 https://github.com/mikewang68/myweb.git . && \
    rm -rf .git && \
    mkdir -p courses

# 安装依赖
RUN npm ci --only=production

# 暴露端口
EXPOSE 3999

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3999/ || exit 1

# 启动应用
CMD ["node", "simple-server.js"]
