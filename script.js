// 删除原有的模拟数据定义，改为从API动态获取

// 当前选中的项目
let currentSelectedItem = null;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
  loadResearchData();
  loadCoursesData();
  setupEventListeners();
});

// 加载科研论文数据
async function loadResearchData() {
  const tableBody = document.getElementById('researchTableBody');
  tableBody.innerHTML = '<tr><td colspan="5" class="text-center"><div class="loading"></div> 正在加载数据...</td></tr>';

  try {
    // 从MongoDB获取数据
    const response = await fetch('/api/research');

    if (!response.ok) {
      throw new Error(`HTTP错误: ${response.status}`);
    }

    const researchData = await response.json();

    // 检查是否是错误响应
    if (researchData.error) {
      throw new Error(researchData.message || '数据库连接失败');
    }

    tableBody.innerHTML = '';

    researchData.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
            <td>${item.id}</td>
            <td><strong>${item.name}</strong></td>
            <td>${item.description}</td>
            <td>${formatDate(item.date)}</td>
            <td>
                <button class="btn btn-donate btn-action" onclick="showPaymentModal('${item.type}', ${item.id}, '${item.name}', ${item.price}, '${item.workflowId}', '${item.downloadUrl || ''}', '${item.serviceUrl || ''}')">
                    <i class="fas fa-coins me-1"></i>打赏体验 ¥${item.price}
                </button>
            </td>
        `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error('加载科研论文数据失败:', error);
    tableBody.innerHTML = '<tr><td colspan="5" class="text-center text-danger">数据加载失败，请刷新页面重试</td></tr>';
  }
}

// 加载课程数据
async function loadCoursesData() {
  const tableBody = document.getElementById('coursesTableBody');
  tableBody.innerHTML = '<tr><td colspan="5" class="text-center"><div class="loading"></div> 正在加载数据...</td></tr>';

  try {
    // 从MongoDB获取数据
    const response = await fetch('/api/courses');
    const coursesData = await response.json();

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
                <button class="btn btn-service btn-action" onclick="startService('${item.serviceUrl}')">
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
  } catch (error) {
    console.error('加载课程数据失败:', error);
    tableBody.innerHTML = '<tr><td colspan="5" class="text-center text-danger">数据加载失败，请刷新页面重试</td></tr>';
  }
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

// 显示支付模态框（修改后的版本，显示pay.jpg图片）
function showPaymentModal(type, itemId, itemName, itemPrice, workflowId, downloadUrl, serviceUrl) {
  currentSelectedItem = {
    type,
    item: {
      id: itemId,
      name: itemName,
      price: itemPrice,
      workflowId: workflowId,
      downloadUrl: downloadUrl,
      serviceUrl: serviceUrl
    }
  };

  const modal = new bootstrap.Modal(document.getElementById('paymentModal'));
  const title = document.querySelector('#paymentModal .modal-title');
  const qrContainer = document.getElementById('qrCodeContainer');
  const statusDiv = document.getElementById('paymentStatus');

  title.textContent = `打赏体验 - ${itemName}`;
  statusDiv.innerHTML = '';

  // 显示pay.jpg图片
  qrContainer.innerHTML = `
        <div class="text-center">
            <img src="pay.jpg" alt="支付二维码" style="max-width: 200px; height: auto; border-radius: 10px; border: 2px solid #dee2e6;">
            <div style="font-size: 1.2rem; color: #28a745; margin-top: 10px;">¥${itemPrice}</div>
            <div style="font-size: 0.9rem; color: #6c757d; margin-top: 5px;">请扫描二维码完成支付</div>
        </div>
    `;

  modal.show();

  // 模拟支付处理
  simulatePayment();
}

// 模拟支付处理
let paymentCheckTimeout = null;

function simulatePayment() {
  const statusDiv = document.getElementById('paymentStatus');

  // 显示支付中状态
  statusDiv.innerHTML = `
        <div class="text-center">
            <div class="loading"></div>
            <div class="mt-2">等待支付确认...</div>
            <div class="mt-1 text-muted" style="font-size: 0.8rem;">请扫描上方二维码完成支付</div>
            <button class="btn btn-outline-primary mt-3" onclick="clearTimeout(paymentCheckTimeout); checkPaymentStatus();">
                <i class="fas fa-check me-1"></i>我已扫描并完成支付
            </button>
        </div>
    `;

  // 30秒后自动弹出支付确认对话框
  paymentCheckTimeout = setTimeout(() => {
    checkPaymentStatus();
  }, 30000);
}

// 轮询支付状态
function pollPaymentStatus() {
  const statusDiv = document.getElementById('paymentStatus');
  let pollCount = 0;
  const maxPolls = 60; // 最多轮询60次（5分钟）
  const pollInterval = 5000; // 每5秒轮询一次

  const poll = setInterval(() => {
    pollCount++;

    // 模拟检查支付状态（实际项目中应该调用后端API）
    checkPaymentStatus().then(isPaid => {
      if (isPaid) {
        clearInterval(poll);
        handlePaymentSuccess();
      } else if (pollCount >= maxPolls) {
        clearInterval(poll);
        handlePaymentTimeout();
      } else {
        // 更新等待状态
        const remainingTime = Math.ceil((maxPolls - pollCount) * pollInterval / 1000 / 60);
        statusDiv.innerHTML = `
          <div class="text-center">
            <div class="loading"></div>
            <div class="mt-2">等待支付确认... (${remainingTime}分钟后自动取消)</div>
            <div class="mt-1 text-muted" style="font-size: 0.8rem;">请扫描上方二维码完成支付</div>
          </div>
        `;
      }
    }).catch(error => {
      console.error('检查支付状态失败:', error);
      clearInterval(poll);
      handlePaymentError();
    });
  }, pollInterval);
}

// 检查支付状态（真实版本 - 基于用户确认）
async function checkPaymentStatus() {
  return new Promise((resolve) => {
    // 显示支付确认对话框
    const confirmed = confirm('请确认您已完成支付：\n\n1. 请扫描二维码完成支付\n2. 支付完成后点击"确定"\n3. 如果未支付或支付失败，请点击"取消"\n\n您是否已完成支付？');

    if (confirmed) {
      // 用户确认支付成功
      handlePaymentSuccess();
    } else {
      // 用户取消或未支付
      handlePaymentCancelled();
    }

    resolve(confirmed);
  });
}

// 支付取消处理
function handlePaymentCancelled() {
  const statusDiv = document.getElementById('paymentStatus');

  statusDiv.innerHTML = `
        <div class="payment-error text-center">
            <i class="fas fa-times-circle fa-2x mb-2"></i>
            <div>支付未完成或已取消</div>
            <button class="btn btn-primary mt-3" onclick="simulatePayment()">重新尝试</button>
        </div>
    `;
}

// 支付成功处理
function handlePaymentSuccess() {
  const statusDiv = document.getElementById('paymentStatus');

  statusDiv.innerHTML = `
        <div class="payment-success text-center">
            <i class="fas fa-check-circle fa-2x mb-2"></i>
            <div>支付成功！正在处理您的请求...</div>
        </div>
    `;

  // 延迟1秒后执行后续操作
  setTimeout(() => {
    handlePostPaymentAction();
  }, 1000);
}

// 支付超时处理
function handlePaymentTimeout() {
  const statusDiv = document.getElementById('paymentStatus');

  statusDiv.innerHTML = `
        <div class="payment-error text-center">
            <i class="fas fa-exclamation-triangle fa-2x mb-2"></i>
            <div>支付超时，请重新尝试</div>
            <button class="btn btn-primary mt-3" onclick="simulatePayment()">重新支付</button>
        </div>
    `;
}

// 支付错误处理
function handlePaymentError() {
  const statusDiv = document.getElementById('paymentStatus');

  statusDiv.innerHTML = `
        <div class="payment-error text-center">
            <i class="fas fa-times-circle fa-2x mb-2"></i>
            <div>支付验证失败，请稍后重试</div>
            <button class="btn btn-primary mt-3" onclick="simulatePayment()">重新尝试</button>
        </div>
    `;
}

// 支付完成后处理不同的操作
function handlePostPaymentAction() {
  if (!currentSelectedItem) return;

  const { type, item } = currentSelectedItem;
  const modal = bootstrap.Modal.getInstance(document.getElementById('paymentModal'));

  // 关闭模态框
  modal.hide();

  // 根据类型执行不同的操作
  if (type === '下载' && item.downloadUrl) {
    // 下载类型：从downloadUrl获取下载链接
    downloadFile(item.downloadUrl);
    showSuccessAlert('支付成功！下载已开始，请检查您的下载文件夹！');
  } else if (type === '在线服务' && item.serviceUrl) {
    // 在线服务类型：从serviceUrl获取链接并跳转
    startService(item.serviceUrl);
    showSuccessAlert('支付成功！正在为您启动服务...');
  } else {
    // 默认处理：启动n8n工作流
    triggerN8NWorkflow(item.workflowId);
    showSuccessAlert('支付成功！服务已启动，请查看您的邮箱或相关通知！');
  }
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
  console.log(`下载文件: ${url}`);

  // 创建隐藏的下载链接
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = url.split('/').pop(); // 从URL中提取文件名
  downloadLink.style.display = 'none';

  // 添加到页面并触发点击
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);

  showSuccessAlert('下载已开始，请检查您的下载文件夹！');
}

// 启动服务
function startService(serviceUrl) {
  console.log(`启动服务: ${serviceUrl}`);

  // 直接跳转到服务页面
  window.location.href = serviceUrl;
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
