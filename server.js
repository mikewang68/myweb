const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// MongoDB连接
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:password@localhost:27017/mike_research?authSource=admin';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB连接成功'))
  .catch(err => console.error('MongoDB连接失败:', err));

// 定义数据模型
const ResearchSchema = new mongoose.Schema({
  id: Number,
  name: String,
  description: String,
  date: Date,
  price: Number,
  workflowId: String,
  createdAt: { type: Date, default: Date.now }
});

const CourseSchema = new mongoose.Schema({
  id: Number,
  name: String,
  description: String,
  type: String,
  downloadUrl: String,
  serviceUrl: String,
  workflowId: String,
  createdAt: { type: Date, default: Date.now }
});

const PaymentSchema = new mongoose.Schema({
  itemId: Number,
  itemType: String,
  amount: Number,
  status: { type: String, default: 'pending' },
  paymentTime: { type: Date, default: Date.now },
  workflowTriggered: { type: Boolean, default: false }
});

const Research = mongoose.model('Research', ResearchSchema);
const Course = mongoose.model('Course', CourseSchema);
const Payment = mongoose.model('Payment', PaymentSchema);

// API路由

// 获取科研论文数据
app.get('/api/research', async (req, res) => {
  try {
    const research = await Research.find().sort({ date: -1 });
    res.json(research);
  } catch (error) {
    res.status(500).json({ error: '获取科研数据失败' });
  }
});

// 获取课程数据
app.get('/api/courses', async (req, res) => {
  try {
    const courses = await Course.find().sort({ id: 1 });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: '获取课程数据失败' });
  }
});

// 保存支付记录
app.post('/api/payment', async (req, res) => {
  try {
    const { itemId, itemType, amount } = req.body;

    const payment = new Payment({
      itemId,
      itemType,
      amount
    });

    await payment.save();
    res.json({ success: true, paymentId: payment._id });
  } catch (error) {
    res.status(500).json({ error: '保存支付记录失败' });
  }
});

// 触发n8n工作流
app.post('/api/n8n/trigger/:workflowId', async (req, res) => {
  try {
    const { workflowId } = req.params;
    const { paymentId } = req.body;

    // 这里应该调用实际的n8n API
    // 模拟n8n API调用
    const n8nResponse = await triggerN8NWorkflow(workflowId, req.body);

    // 更新支付记录状态
    if (paymentId) {
      await Payment.findByIdAndUpdate(paymentId, {
        status: 'completed',
        workflowTriggered: true
      });
    }

    res.json({
      success: true,
      message: 'n8n工作流已触发',
      workflowId,
      n8nResponse
    });
  } catch (error) {
    res.status(500).json({ error: '触发n8n工作流失败' });
  }
});

// 模拟n8n工作流触发
async function triggerN8NWorkflow(workflowId, data) {
  // 实际项目中应该使用n8n的webhook URL
  const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || 'http://localhost:5678/webhook';

  try {
    // 模拟n8n API调用
    const response = await fetch(`${n8nWebhookUrl}/${workflowId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        timestamp: new Date().toISOString(),
        source: 'mike-research-website'
      })
    });

    return await response.json();
  } catch (error) {
    console.error('n8n工作流调用失败:', error);
    // 返回模拟成功响应
    return {
      success: true,
      workflowId,
      executionId: `exec_${Date.now()}`,
      status: 'running'
    };
  }
}

// 初始化数据（首次运行）
async function initializeData() {
  try {
    const researchCount = await Research.countDocuments();
    if (researchCount === 0) {
      await Research.insertMany([
        {
          id: 1,
          name: "基于深度学习的量化投资策略研究",
          description: "探索深度学习在量化投资中的应用，构建多因子模型",
          date: new Date('2024-01-15'),
          price: 5.0,
          workflowId: "research-1"
        },
        {
          id: 2,
          name: "人工智能在金融风控中的应用",
          description: "研究AI技术在金融风险控制中的最新进展",
          date: new Date('2024-01-10'),
          price: 10.0,
          workflowId: "research-2"
        }
      ]);
      console.log('科研数据初始化完成');
    }

    const coursesCount = await Course.countDocuments();
    if (coursesCount === 0) {
      await Course.insertMany([
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
      ]);
      console.log('课程数据初始化完成');
    }
  } catch (error) {
    console.error('数据初始化失败:', error);
  }
}

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
  initializeData();
});

module.exports = app;

