# TrueNAS Scale Docker 部署指南

## 部署准备

### 1. 创建应用目录
在TrueNAS Scale中创建一个数据集用于存储应用文件：
```
/mnt/pool/apps/mike-research-space/
```

### 2. 上传文件
将以下文件上传到应用目录：
- `docker-compose.yml`
- `Dockerfile`
- `package.json`
- `server.js`
- `index.html`
- `styles.css`
- `script.js`
- `mongo-init.js`
- `nginx.conf`
- `README.md`

### 3. 创建目录结构
```bash
mkdir -p courses ssl
```

## 部署方式

### 方式一：使用TrueNAS Scale应用

1. **安装Docker Compose应用**
   - 在TrueNAS Scale应用商店中搜索"Docker Compose"
   - 安装并配置

2. **配置应用**
   - 主机路径：`/mnt/pool/apps/mike-research-space`
   - 容器路径：`/app`
   - 选择`docker-compose.yml`文件

3. **启动应用**
   - 在Docker Compose应用中启动服务

### 方式二：手动Docker部署

1. **SSH连接到TrueNAS**
```bash
ssh root@truenas-ip
```

2. **进入应用目录**
```bash
cd /mnt/pool/apps/mike-research-space
```

3. **构建和启动服务**
```bash
# 构建镜像
docker-compose build

# 启动服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

## 端口映射

- **网站**: 3000 → 外部端口（如8080）
- **MongoDB**: 27017 → 外部端口（可选）
- **n8n**: 5678 → 外部端口（可选）
- **Nginx**: 80/443 → 外部端口

## 环境变量配置

在TrueNAS Scale应用配置中设置以下环境变量：

```env
# MongoDB
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=your-secure-password

# 网站
MONGODB_URI=mongodb://admin:your-secure-password@mongodb:27017/mike_research?authSource=admin
N8N_WEBHOOK_URL=http://n8n:5678/webhook

# n8n
N8N_ENCRYPTION_KEY=your-encryption-key
```

## 数据持久化

### 数据卷
- `mongodb_data`: MongoDB数据
- `n8n_data`: n8n工作流数据
- `courses`: 课程文件

### 备份策略
```bash
# 备份MongoDB
docker exec mike-research-mongodb mongodump --out /backup

# 备份n8n数据
docker cp mike-research-n8n:/home/node/.n8n ./backup/n8n
```

## SSL证书配置

### 自签名证书（测试用）
```bash
# 创建SSL目录
mkdir -p ssl

# 生成自签名证书
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout ssl/key.pem -out ssl/cert.pem \
  -subj "/C=CN/ST=Beijing/L=Beijing/O=Mike Research/CN=localhost"
```

### Let's Encrypt证书（生产用）
1. 使用Certbot获取证书
2. 将证书文件放入`ssl`目录
3. 更新`nginx.conf`中的证书路径

## 网络配置

### 内部网络
- 服务间通过`mike-research-network`网络通信
- MongoDB和n8n不直接暴露到外部

### 外部访问
- 通过Nginx反向代理访问
- 支持HTTPS加密
- 可配置域名访问

## 监控和维护

### 健康检查
```bash
# 检查服务状态
docker-compose ps

# 查看日志
docker-compose logs web
docker-compose logs mongodb
docker-compose logs n8n
```

### 更新服务
```bash
# 拉取最新代码
git pull

# 重新构建和启动
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### 数据管理
```bash
# 进入MongoDB容器
docker exec -it mike-research-mongodb mongosh -u admin -p password

# 备份数据库
docker exec mike-research-mongodb mongodump -u admin -p password --out /tmp/backup

# 恢复数据库
docker exec mike-research-mongodb mongorestore -u admin -p password /tmp/backup
```

## 故障排除

### 常见问题

1. **端口冲突**
   - 检查端口是否被其他应用占用
   - 修改`docker-compose.yml`中的端口映射

2. **数据库连接失败**
   - 检查MongoDB容器是否正常运行
   - 验证连接字符串中的用户名密码

3. **n8n工作流无法触发**
   - 检查n8n服务状态
   - 验证webhook URL配置

4. **SSL证书问题**
   - 确保证书文件存在且路径正确
   - 检查证书权限

### 日志查看
```bash
# 查看所有服务日志
docker-compose logs

# 查看特定服务日志
docker-compose logs web
docker-compose logs mongodb
docker-compose logs n8n

# 实时查看日志
docker-compose logs -f web
```

## 性能优化

### 资源分配
- **MongoDB**: 2GB内存，2CPU核心
- **n8n**: 1GB内存，1CPU核心
- **Web应用**: 512MB内存，1CPU核心
- **Nginx**: 256MB内存，0.5CPU核心

### 数据库优化
```javascript
// 在MongoDB中创建索引
db.research.createIndex({ "date": -1 })
db.courses.createIndex({ "type": 1 })
db.payments.createIndex({ "paymentTime": -1 })
```

## 安全建议

1. **修改默认密码**
   - MongoDB root密码
   - n8n加密密钥

2. **防火墙配置**
   - 只开放必要的端口
   - 限制外部访问

3. **定期更新**
   - 更新Docker镜像
   - 更新依赖包
   - 更新SSL证书

4. **监控和日志**
   - 启用访问日志
   - 监控异常请求
   - 定期审查日志

