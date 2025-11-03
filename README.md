# Mike的研究空间

一个集量化研究、科研论文和课程教学于一体的个人网页项目。

## 项目特色

- 🎯 **量化研究** - 投资分析与策略研究（预留Dashboard位置）
- 📚 **科研论文** - 前沿研究与学术成果，支持打赏体验
- 🎓 **课程教学** - 专业课程与学习资源，提供下载或在线服务
- 💰 **支付集成** - 模拟支付系统，支持n8n工作流触发
- 🗄️ **数据库** - 使用MongoDB存储数据
- 🔄 **n8n集成** - 与n8n工作流系统集成

## 技术栈

### 前端
- HTML5 / CSS3 / JavaScript
- Bootstrap 5.3.0
- Font Awesome 6.0.0

### 后端
- Node.js
- Express.js
- MongoDB (Mongoose)

### 集成服务
- n8n工作流自动化
- 模拟支付系统

## 快速开始

### 环境要求
- Node.js 14+
- MongoDB 4.4+
- n8n (可选，用于工作流集成)

### 安装步骤

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd mike-research-space
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置环境变量** (可选)
   创建 `.env` 文件：
   ```env
   PORT=3999
   MONGODB_URI=mongodb://localhost:27017/mike_research
   N8N_WEBHOOK_URL=http://localhost:5678/webhook
   ```

4. **启动MongoDB**
   ```bash
   # 使用Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest

   # 或使用本地安装的MongoDB
   mongod
   ```

5. **启动应用**
   ```bash
   # 开发模式
   npm run dev

   # 生产模式
   npm start
   ```

6. **访问网站**
   打开浏览器访问 `http://localhost:3000`

## 项目结构

```
mike-research-space/
├── index.html          # 主页面
├── styles.css          # 样式文件
├── script.js           # 前端JavaScript
├── server.js           # 后端服务器
├── package.json        # 项目配置
├── README.md           # 项目说明
└── courses/            # 课程资源目录（可选）
```

## 功能说明

### 1. 量化研究
- 预留Dashboard位置，用于展示投资分析图表
- 响应式设计，支持移动端访问

### 2. 科研论文
- 表格形式展示研究成果
- 包含序号、名称、简介、日期
- 打赏体验功能：
  - 点击按钮弹出支付二维码
  - 模拟支付成功后触发n8n工作流
  - 支持不同价格设置

### 3. 课程教学
- 表格形式展示课程资源
- 两种类型：
  - **下载**：提供课程资料下载
  - **在线服务**：通过n8n工作流提供在线服务
- 清晰的类型标识和操作按钮

### 4. 支付与n8n集成
- 模拟支付流程
- 支付成功后自动触发n8n工作流
- 支持工作流状态跟踪
- 可扩展的真实支付API集成

## API接口

### 科研论文
- `GET /api/research` - 获取科研论文列表

### 课程教学
- `GET /api/courses` - 获取课程列表

### 支付系统
- `POST /api/payment` - 创建支付记录
- `POST /api/n8n/trigger/:workflowId` - 触发n8n工作流

## 数据库设计

### Research (科研论文)
- id: 序号
- name: 论文名称
- description: 简介
- date: 发布日期
- price: 打赏价格
- workflowId: n8n工作流ID

### Course (课程)
- id: 序号
- name: 课程名称
- description: 课程简介
- type: 类型（下载/在线服务）
- downloadUrl: 下载链接
- serviceUrl: 服务链接
- workflowId: n8n工作流ID

### Payment (支付记录)
- itemId: 项目ID
- itemType: 项目类型
- amount: 支付金额
- status: 支付状态
- workflowTriggered: 工作流是否已触发

## 自定义配置

### 添加新的科研论文
在 `server.js` 的 `initializeData` 函数中添加：
```javascript
{
    id: 3,
    name: "新论文标题",
    description: "论文简介",
    date: new Date('2024-01-20'),
    price: 29.9,
    workflowId: "research-3"
}
```

### 添加新的课程
在 `server.js` 的 `initializeData` 函数中添加：
```javascript
{
    id: 3,
    name: "新课程名称",
    description: "课程简介",
    type: "下载", // 或 "在线服务"
    downloadUrl: "/courses/new-course.pdf",
    workflowId: "course-3"
}
```

### n8n工作流配置
1. 在n8n中创建工作流
2. 设置webhook触发器
3. 获取工作流ID
4. 在代码中配置对应的workflowId

## Docker部署（TrueNAS Scale）

### 快速部署
```bash
# 运行部署脚本
./deploy-truenas.sh
```

### 手动部署
```bash
# 构建和启动服务
docker-compose build
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

### 服务说明
- **网站**: http://localhost:3000
- **n8n管理**: http://localhost:5678
- **MongoDB**: localhost:27017
- **Nginx**: 提供HTTPS反向代理

详细部署说明请参考 [TRUENAS-SCALE-DEPLOYMENT.md](TRUENAS-SCALE-DEPLOYMENT.md)

## 开发计划

- [ ] 集成真实支付API（微信支付/支付宝）
- [ ] 添加用户认证系统
- [ ] 实现文件上传功能
- [ ] 添加数据分析Dashboard
- [ ] 集成邮件通知系统
- [ ] 添加后台管理界面

## 许可证

MIT License

## 联系方式

如有问题或建议，请联系项目维护者。

