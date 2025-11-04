# 使用 Node.js 官方轻量镜像
FROM node:18-alpine

# 安装 git 和 curl（健康检查需要）
RUN apk add --no-cache git curl

# 设置工作目录
WORKDIR /app

# 先安装依赖（利用缓存：只有 package.json 变才重新安装）
COPY package*.json ./
RUN npm ci --only=production

# 拉取最新代码（覆盖当前目录）
RUN rm -rf /app/* /app/.* 2>/dev/null || true && \
    git clone --depth 1 https://github.com/mikewang68/myweb.git /app && \
    rm -rf /app/.git

# 创建课程目录（如果代码中没有）
RUN mkdir -p courses

# 暴露端口
EXPOSE 3999

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3999/ || exit 1

# 启动应用
CMD ["node", "simple-server.js"]
