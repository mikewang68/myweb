# 使用Node.js官方镜像
FROM node:18-alpine

# 安装 Git
RUN apk update && apk add git

# 设置工作目录
WORKDIR /app

# 复制package.json和package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 清空工作目录内容
RUN rm -rf *

# 拉取最新代码
RUN git clone https://github.com/mikewang68/myweb.git .
# 创建课程目录
RUN mkdir -p courses

# 暴露端口
EXPOSE 3999

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3999/ || exit 1

# 启动命令
CMD ["node", "server.js"]
# CMD ["npm", "start"]
