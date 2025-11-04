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


// 连接到MongoDB
async function connectToMongoDB() {
  try {
    await client.connect();
    console.log('成功连接到MongoDB');
    console.log('连接URI:', MONGODB_URI); // 添加这行来确认连接字符串
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
    console.log('开始获取科研数据...');
    console.log('MongoDB URI:', MONGODB_URI);

    const db = await connectToMongoDB();
    if (db) {
      console.log('成功获取数据库连接');
      const researchCollection = db.collection('research');
      const data = await researchCollection.find({}).toArray();
      console.log(`从数据库获取到 ${data.length} 条科研数据`);
      res.json(data);
    } else {
      console.log('MongoDB连接失败，返回错误');
      res.status(500).json({
        error: true,
        message: '数据库连接失败，无法获取科研数据'
      });
    }
  } catch (error) {
    console.error('获取科研论文数据失败:', error);
    res.status(500).json({
      error: true,
      message: '获取科研数据时发生错误'
    });
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
      console.log('MongoDB连接失败，返回错误');
      res.status(500).json({
        error: true,
        message: '数据库连接失败，无法获取课程数据'
      });
    }
  } catch (error) {
    console.error('获取课程数据失败:', error);
    res.status(500).json({
      error: true,
      message: '获取课程数据时发生错误'
    });
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

