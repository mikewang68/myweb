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
    const researchData = await response.json();

    tableBody.innerHTML = '';

    researchData.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
            <td>${item.id}</td>
            <td><strong>${item.name}</strong></td>
            <td>${item.description}</td>
            <td>${formatDate(item.date)}</td>
            <td>
                <button class="btn btn-donate btn-action" onclick="showPaymentModal('research', ${item.id}, '${item.name}', ${item.price}, '${item.workflowId}')">
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

// 显示支付模态框（修改后的版本，不依赖本地模拟数据）
function showPaymentModal(type, itemId, itemName, itemPrice, workflowId) {
  currentSelectedItem = {
    type,
    item: {
      id: itemId,
      name: itemName,
      price: itemPrice,
      workflowId: workflowId
    }
  };

  const modal = new bootstrap.Modal(document.getElementById('paymentModal'));
  const title = document.querySelector('#paymentModal .modal-title');
  const qrContainer = document.getElementById('qrCodeContainer');
  const statusDiv = document.getElementById('paymentStatus');

  title.textContent = `打赏体验 - ${itemName}`;
  statusDiv.innerHTML = '';

  // 生成模拟二维码（实际项目中应该使用真实的支付API）
  qrContainer.innerHTML = `
        <div class="text-center">
            <div style="width: 200px; height: 200px; background: #f8f9fa; display: inline-flex; align-items: center; justify-content: center; border: 2px solid #dee2e6; border-radius: 10px;">
                <div class="text-center">
                    <div style="font-size: 2rem; color: #28a745;">¥${itemPrice}</div>
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
