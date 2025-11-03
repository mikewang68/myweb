// MongoDB初始化脚本
db = db.getSiblingDB('mike_research');

// 创建用户（如果需要）
db.createUser({
  user: 'mike',
  pwd: 'research123',
  roles: [
    {
      role: 'readWrite',
      db: 'mike_research'
    }
  ]
});

// 创建科研论文集合并插入初始数据
db.research.insertMany([
  {
    id: 1,
    name: "基于深度学习的量化投资策略研究",
    description: "探索深度学习在量化投资中的应用，构建多因子模型",
    date: new Date('2024-01-15'),
    price: 9.9,
    workflowId: "research-1",
    createdAt: new Date()
  },
  {
    id: 2,
    name: "人工智能在金融风控中的应用",
    description: "研究AI技术在金融风险控制中的最新进展",
    date: new Date('2024-01-10'),
    price: 19.9,
    workflowId: "research-2",
    createdAt: new Date()
  },
  {
    id: 3,
    name: "区块链技术在金融领域的创新应用",
    description: "分析区块链技术在金融创新中的实际案例",
    date: new Date('2024-01-05'),
    price: 29.9,
    workflowId: "research-3",
    createdAt: new Date()
  }
]);

// 创建课程集合并插入初始数据
db.courses.insertMany([
  {
    id: 1,
    name: "Python量化投资入门",
    description: "从零开始学习Python在量化投资中的应用",
    type: "下载",
    downloadUrl: "/courses/python-quant.pdf",
    workflowId: "course-1",
    createdAt: new Date()
  },
  {
    id: 2,
    name: "机器学习实战课程",
    description: "手把手教你构建机器学习模型",
    type: "在线服务",
    serviceUrl: "ml-course",
    workflowId: "course-2",
    createdAt: new Date()
  },
  {
    id: 3,
    name: "金融数据分析与可视化",
    description: "使用Python进行金融数据分析和可视化展示",
    type: "下载",
    downloadUrl: "/courses/finance-analysis.zip",
    workflowId: "course-3",
    createdAt: new Date()
  }
]);

// 创建支付记录集合
db.payments.createIndex({ "paymentTime": -1 });

console.log('MongoDB数据库初始化完成');

