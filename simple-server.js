const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3999;

// MongoDB连接配置
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://stock:681123@192.168.1.2:27017/?authSource=admin';
const client = new MongoClient(MONGODB_URI);

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// 模拟数据（作为备用）
const researchData = [
  {
    id: 1,
    name: "基于深度学习的量化投资策略研究",
    description: "探索深度学习在量化投资中的应用，构建多因子模型",
    date: "2024-01-15",
    price: 5.0,
    workflowId: "research-1"
  },
  {
    id: 2,
    name: "人工智能在金融风控中的应用",
    description: "研究AI技术在金融风险控制中的最新进展",
    date: "2024-01-10",
    price: 10.0,
    workflowId: "research-2"
  },
  {
    id: 3,
    name: "区块链技术在金融领域的创新应用",
    description: "分析区块链技术在金融创新中的实际案例",
    date: "2024-01-05",
    price: 10.0,
    workflowId: "research-3"
  }
];

const coursesData = [
  {
    id: 1,
    name: "Python量化投资入门",
    description: "从零开始学习Python在量化投资中的应用",
    type: "下载",
    downloadUrl: "/courses/python-quant.pdf",
    workflowId: "course-1"
  },
  {
    id: 2,
    name: "机器学习实战课程",
    description: "手把手教你构建机器学习模型",
    type: "在线服务",
    serviceUrl: "ml-course",
    workflowId: "course-2"
  }
];

// 连接到MongoDB
async function connectToMongoDB() {
  try {
    await client.connect();
    console.log('成功连接到MongoDB');
    return client.db('edu');
  } catch (error) {
    console.error('MongoDB连接失败:', error);
    return null;
  }
}

// API路由

// 获取科研论文数据
app.get('/api/research', async (req, res) => {
  try {
    const db = await connectToMongoDB();
    if (db) {
      const researchCollection = db.collection('research');
      const data = await researchCollection.find({}).toArray();
      res.json(data);
    } else {
      // 如果MongoDB连接失败，返回模拟数据
      res.json(researchData);
    }
  } catch (error) {
    console.error('获取科研论文数据失败:', error);
    // 出错时返回模拟数据
    res.json(researchData);
  }
});

// 获取课程数据
app.get('/api/courses', async (req, res) => {
  try {
    const db = await connectToMongoDB();
    if (db) {
      const coursesCollection = db.collection('courses');
      const data = await coursesCollection.find({}).toArray();
      res.json(data);
    } else {
      // 如果MongoDB连接失败，返回模拟数据
      res.json(coursesData);
    }
  } catch (error) {
    console.error('获取课程数据失败:', error);
    // 出错时返回模拟数据
    res.json(coursesData);
  }
});

// 保存支付记录
app.post('/api/payment', (req, res) => {
  const { itemId, itemType, amount } = req.body;
  console.log(`支付记录: ${itemType} ${itemId}, 金额: ${amount}`);
  res.json({ success: true, paymentId: `pay_${Date.now()}` });
});

// 触发n8n工作流
app.post('/api/n8n/trigger/:workflowId', (req, res) => {
  const { workflowId } = req.params;
  console.log(`触发n8n工作流: ${workflowId}`);

  res.json({
    success: true,
    message: 'n8n工作流已触发',
    workflowId,
    executionId: `exec_${Date.now()}`
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
  console.log(`访问地址: http://localhost:${PORT}`);
});

