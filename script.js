// 模拟数据 - 科研论文
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
  },
  {
    id: 4,
    name: "机器学习在股票预测中的实证研究",
    description: "基于历史数据的机器学习模型预测效果分析",
    date: "2023-12-28",
    price: 10.0,
    workflowId: "research-4"
  }
];

// 模拟数据 - 课程教学
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
  },
  {
    id: 3,
    name: "金融数据分析与可视化",
    description: "使用Python进行金融数据分析和可视化展示",
    type: "下载",
    downloadUrl: "/courses/finance-analysis.zip",
    workflowId: "course-3"
  },
  {
    id: 4,
    name: "区块链技术原理与应用",
    description: "深入理解区块链技术及其在金融领域的应用",
    type: "在线服务",
    serviceUrl: "blockchain-course",
    workflowId: "course-4"
  }
];

// 当前选中的项目
let currentSelectedItem = null;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
  loadResearchData();
  loadCoursesData();
  setupEventListeners();
});

// 加载科研论文数据
function loadResearchData() {
  const tableBody = document.getElementById('researchTableBody');
  tableBody.innerHTML = '';

  researchData.forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = `
            <td>${item.id}</td>
            <td><strong>${item.name}</strong></td>
            <td>${item.description}</td>
            <td>${formatDate(item.date)}</td>
            <td>
                <button class="btn btn-donate btn-action" onclick="showPaymentModal('research', ${item.id})">
                    <i class="fas fa-coins me-1"></i>打赏体验 ¥${item.price}
                </button>
            </td>
        `;
    tableBody.appendChild(row);
  });
}

// 加载课程数据
function loadCoursesData() {
  const tableBody = document.getElementById('coursesTableBody');
  tableBody.innerHTML = '';

  coursesData.forEach(item => {
    const row = document.createElement('tr');

    let actionButton = '';
    if (item.type === '下载') {
      actionButton = `
                <button class="btn btn-download btn-action" onclick="downloadFile('${item.downloadUrl}')">
                    <i class="fas fa-download me-1"></i>下载资源
                </button>
            `;
    } else {
      actionButton = `
                <button class="btn btn-service btn-action" onclick="startService('${item.workflowId}')">
                    <i class="fas fa-play me-1"></i>启动服务
                </button>
            `;
    }

    row.innerHTML = `
            <td>${item.id}</td>
            <td><strong>${item.name}</strong></td>
            <td>${item.description}</td>
            <td><span class="badge ${item.type === '下载' ? 'bg-primary' : 'bg-success'}">${item.type}</span></td>
            <td>${actionButton}</td>
        `;
    tableBody.appendChild(row);
  });
}

// 设置事件监听器
function setupEventListeners() {
  // 平滑滚动
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // 导航栏滚动效果
  window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
      navbar.style.padding = '10px 0';
      navbar.style.background = 'rgba(52, 152, 219, 0.95)';
    } else {
      navbar.style.padding = '15px 0';
      navbar.style.background = '#3498db';
    }
  });
}

// 显示支付模态框
function showPaymentModal(type, itemId) {
  let item;
  if (type === 'research') {
    item = researchData.find(r => r.id === itemId);
  }

  if (!item) return;

  currentSelectedItem = { type, item };

  const modal = new bootstrap.Modal(document.getElementById('paymentModal'));
  const title = document.querySelector('#paymentModal .modal-title');
  const qrContainer = document.getElementById('qrCodeContainer');
  const statusDiv = document.getElementById('paymentStatus');

  title.textContent = `打赏体验 - ${item.name}`;
  statusDiv.innerHTML = '';

  // 生成模拟二维码（实际项目中应该使用真实的支付API）
  qrContainer.innerHTML = `
        <div class="text-center">
            <div style="width: 200px; height: 200px; background: #f8f9fa; display: inline-flex; align-items: center; justify-content: center; border: 2px solid #dee2e6; border-radius: 10px;">
                <div class="text-center">
                    <div style="font-size: 2rem; color: #28a745;">¥${item.price}</div>
                    <div style="font-size: 0.8rem; color: #6c757d; margin-top: 10px;">模拟支付二维码</div>
                </div>
            </div>
        </div>
    `;

  modal.show();

  // 模拟支付处理
  simulatePayment();
}

// 模拟支付处理
function simulatePayment() {
  const statusDiv = document.getElementById('paymentStatus');

  // 显示支付中状态
  statusDiv.innerHTML = `
        <div class="text-center">
            <div class="loading"></div>
            <div class="mt-2">等待支付确认...</div>
        </div>
    `;

  // 模拟支付成功（3秒后）
  setTimeout(() => {
    if (currentSelectedItem) {
      statusDiv.innerHTML = `
                <div class="payment-success text-center">
                    <i class="fas fa-check-circle fa-2x mb-2"></i>
                    <div>支付成功！正在启动服务...</div>
                </div>
            `;

      // 启动n8n工作流
      setTimeout(() => {
        triggerN8NWorkflow(currentSelectedItem.item.workflowId);

        // 关闭模态框
        setTimeout(() => {
          bootstrap.Modal.getInstance(document.getElementById('paymentModal')).hide();
          showSuccessAlert('服务已启动，请查看您的邮箱或相关通知！');
        }, 2000);
      }, 1000);
    }
  }, 3000);
}

// 触发n8n工作流
function triggerN8NWorkflow(workflowId) {
  // 这里应该调用实际的n8n API
  console.log(`触发n8n工作流: ${workflowId}`);

  // 模拟API调用
  fetch(`/api/n8n/trigger/${workflowId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      payment: 'success',
      timestamp: new Date().toISOString()
    })
  })
    .then(response => response.json())
    .then(data => {
      console.log('n8n工作流执行结果:', data);
    })
    .catch(error => {
      console.error('n8n工作流执行失败:', error);
    });
}

// 下载文件
function downloadFile(url) {
  // 模拟下载
  console.log(`下载文件: ${url}`);
  showSuccessAlert('开始下载，请稍候...');

  // 实际项目中应该使用真实的下载链接
  // window.location.href = url;
}

// 启动服务
function startService(workflowId) {
  console.log(`启动服务: ${workflowId}`);

  // 显示启动中状态
  showLoadingAlert('正在启动服务...');

  // 模拟服务启动
  setTimeout(() => {
    triggerN8NWorkflow(workflowId);
    showSuccessAlert('服务已成功启动！');
  }, 2000);
}

// 工具函数
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

function showSuccessAlert(message) {
  // 在实际项目中可以使用更优雅的通知方式
  alert(`✅ ${message}`);
}

function showLoadingAlert(message) {
  // 在实际项目中可以使用更优雅的加载提示
  alert(`⏳ ${message}`);
}

// MongoDB数据操作函数（示例）
async function saveToDatabase(collection, data) {
  try {
    const response = await fetch('/api/mongodb/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        collection: collection,
        data: data
      })
    });
    return await response.json();
  } catch (error) {
    console.error('保存到数据库失败:', error);
  }
}

async function loadFromDatabase(collection, query = {}) {
  try {
    const response = await fetch(`/api/mongodb/load?collection=${collection}&query=${encodeURIComponent(JSON.stringify(query))}`);
    return await response.json();
  } catch (error) {
    console.error('从数据库加载失败:', error);
    return [];
  }
}

