// Reports Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
  // Get DOM elements
  const dateRangeSelect = document.getElementById('date-range');
  const customDateRange = document.querySelector('.custom-date-range');
  const startDateInput = document.getElementById('start-date');
  const endDateInput = document.getElementById('end-date');
  const applyFiltersBtn = document.getElementById('apply-filters');
  const resetFiltersBtn = document.getElementById('reset-filters');
  const categoryTabs = document.querySelectorAll('.category-tab');
  const categoryContents = document.querySelectorAll('.category-content');
  const viewButtons = document.querySelectorAll('.view-btn');
  const downloadButtons = document.querySelectorAll('.download-btn');
  const viewFavoriteButtons = document.querySelectorAll('.view-favorite');
  const modal = document.getElementById('report-viewer');
  const closeModal = document.querySelector('.close-modal');
  const reportTitle = document.getElementById('report-title');
  const reportLoading = document.querySelector('.report-loading');
  const reportContent = document.querySelector('.report-content');
  const reportData = document.querySelector('.report-data');
  const exportButtons = document.querySelectorAll('.export-btn');
  const printButton = document.querySelector('.print-btn');

  // Set today's date as max date for date inputs
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  startDateInput.setAttribute('max', todayStr);
  endDateInput.setAttribute('max', todayStr);

  // Set default dates (this week)
  const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
  startDateInput.value = firstDayOfWeek.toISOString().split('T')[0];
  endDateInput.value = new Date().toISOString().split('T')[0];

  // Toggle custom date range based on select value
  dateRangeSelect.addEventListener('change', function() {
    if (this.value === 'custom') {
      customDateRange.style.display = 'flex';
    } else {
      customDateRange.style.display = 'none';
      
      // Set date range based on selection
      const today = new Date();
      let startDate, endDate;
      
      switch(this.value) {
        case 'today':
          startDate = endDate = new Date();
          break;
        case 'yesterday':
          startDate = endDate = new Date(today);
          startDate.setDate(today.getDate() - 1);
          break;
        case 'this-week':
          startDate = new Date(today);
          startDate.setDate(today.getDate() - today.getDay());
          endDate = new Date();
          break;
        case 'this-month':
          startDate = new Date(today.getFullYear(), today.getMonth(), 1);
          endDate = new Date();
          break;
        case 'last-month':
          startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
          endDate = new Date(today.getFullYear(), today.getMonth(), 0);
          break;
      }
      
      if (startDate && endDate) {
        startDateInput.value = startDate.toISOString().split('T')[0];
        endDateInput.value = endDate.toISOString().split('T')[0];
      }
    }
  });

  // Apply filters
  applyFiltersBtn.addEventListener('click', function() {
    // Simulate loading filter results
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;
    
    // Display toast notification
    showToast(`Filters applied: ${startDate} to ${endDate}`);
    
    // In a real application, you would fetch filtered data here
    console.log(`Applying filters from ${startDate} to ${endDate}`);
  });

  // Reset filters
  resetFiltersBtn.addEventListener('click', function() {
    dateRangeSelect.value = 'this-week';
    customDateRange.style.display = 'none';
    
    // Reset to this week
    const today = new Date();
    const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    startDateInput.value = firstDayOfWeek.toISOString().split('T')[0];
    endDateInput.value = new Date().toISOString().split('T')[0];
    
    showToast('Filters have been reset');
  });

  // Tab switching
  categoryTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      // Remove active class from all tabs and contents
      categoryTabs.forEach(t => t.classList.remove('active'));
      categoryContents.forEach(c => c.classList.remove('active'));
      
      // Add active class to clicked tab
      this.classList.add('active');
      
      // Show corresponding content
      const category = this.getAttribute('data-category');
      document.getElementById(`${category}-category`).classList.add('active');
    });
  });

  // View report buttons
  viewButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const reportName = this.closest('.report-card').querySelector('h3').textContent;
      openReportModal(reportName);
    });
  });

  // View favorite report buttons
  viewFavoriteButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const reportName = this.previousElementSibling.textContent;
      openReportModal(reportName);
    });
  });

  // Download report buttons
  downloadButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const reportName = this.closest('.report-card').querySelector('h3').textContent;
      // Simulate download
      showToast(`Downloading ${reportName} report...`);
      
      // In a real app, this would trigger a download
      setTimeout(() => {
        showToast(`${reportName} report downloaded successfully`);
      }, 1500);
    });
  });

  // Close modal
  closeModal.addEventListener('click', closeReportModal);

  // Close modal when clicking outside
  window.addEventListener('click', function(event) {
    if (event.target === modal) {
      closeReportModal();
    }
  });

  // Export buttons
  exportButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const format = this.getAttribute('data-format');
      const reportName = reportTitle.textContent;
      
      // Simulate export
      showToast(`Exporting ${reportName} as ${format.toUpperCase()}...`);
      
      // In a real app, this would trigger an export
      setTimeout(() => {
        showToast(`${reportName} exported as ${format.toUpperCase()} successfully`);
      }, 1500);
    });
  });

  // Print button
  printButton.addEventListener('click', function() {
    showToast('Preparing report for printing...');
    
    // In a real app, this would open the print dialog
    setTimeout(() => {
      window.print();
    }, 500);
  });

  // Function to open report modal
  function openReportModal(reportName) {
    reportTitle.textContent = reportName;
    reportLoading.style.display = 'flex';
    reportContent.style.display = 'none';
    modal.style.display = 'block';
    
    // Simulate loading report data
    setTimeout(() => {
      reportLoading.style.display = 'none';
      reportContent.style.display = 'block';
      
      // Generate mock report data based on report type
      reportData.innerHTML = generateMockReportData(reportName);
    }, 1500);
  }

  // Function to close report modal
  function closeReportModal() {
    modal.style.display = 'none';
  }

  // Function to generate mock report data
  function generateMockReportData(reportName) {
    let html = '';
    
    switch(reportName) {
      case 'Sales Summary':
        html = `
          <div class="report-chart">
            <h3>Monthly Sales Trend</h3>
            <div class="chart-placeholder">
              <div class="chart-bar" style="height: 65%"></div>
              <div class="chart-bar" style="height: 40%"></div>
              <div class="chart-bar" style="height: 80%"></div>
              <div class="chart-bar" style="height: 55%"></div>
              <div class="chart-bar" style="height: 75%"></div>
              <div class="chart-bar" style="height: 90%"></div>
            </div>
            <div class="chart-legend">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
            </div>
          </div>
          <div class="report-stats">
            <div class="stat-card">
              <h4>Total Sales</h4>
              <div class="stat-value">$124,658</div>
              <div class="stat-change positive">+12.3%</div>
            </div>
            <div class="stat-card">
              <h4>Avg. Order Value</h4>
              <div class="stat-value">$86.42</div>
              <div class="stat-change positive">+5.7%</div>
            </div>
            <div class="stat-card">
              <h4>Total Orders</h4>
              <div class="stat-value">1,442</div>
              <div class="stat-change positive">+8.2%</div>
            </div>
            <div class="stat-card">
              <h4>Conversion Rate</h4>
              <div class="stat-value">3.8%</div>
              <div class="stat-change negative">-0.5%</div>
            </div>
          </div>
          <table class="report-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Sales</th>
                <th>Orders</th>
                <th>Avg. Order</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Jun 15, 2023</td>
                <td>$4,256</td>
                <td>52</td>
                <td>$81.85</td>
              </tr>
              <tr>
                <td>Jun 14, 2023</td>
                <td>$3,879</td>
                <td>45</td>
                <td>$86.20</td>
              </tr>
              <tr>
                <td>Jun 13, 2023</td>
                <td>$5,128</td>
                <td>63</td>
                <td>$81.40</td>
              </tr>
              <tr>
                <td>Jun 12, 2023</td>
                <td>$4,652</td>
                <td>58</td>
                <td>$80.21</td>
              </tr>
              <tr>
                <td>Jun 11, 2023</td>
                <td>$3,542</td>
                <td>41</td>
                <td>$86.39</td>
              </tr>
            </tbody>
          </table>
        `;
        break;
        
      case 'Current Stock':
        html = `
          <div class="report-stats">
            <div class="stat-card">
              <h4>Total Items</h4>
              <div class="stat-value">1,256</div>
            </div>
            <div class="stat-card">
              <h4>Low Stock Items</h4>
              <div class="stat-value">42</div>
              <div class="stat-change negative">Critical</div>
            </div>
            <div class="stat-card">
              <h4>Out of Stock</h4>
              <div class="stat-value">8</div>
            </div>
            <div class="stat-card">
              <h4>Inventory Value</h4>
              <div class="stat-value">$345,862</div>
            </div>
          </div>
          <table class="report-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>In Stock</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>SKU-10452</td>
                <td>Wireless Headphones</td>
                <td>Electronics</td>
                <td>78</td>
                <td><span class="status good">Good</span></td>
              </tr>
              <tr>
                <td>SKU-10238</td>
                <td>Smartphone Case</td>
                <td>Accessories</td>
                <td>124</td>
                <td><span class="status good">Good</span></td>
              </tr>
              <tr>
                <td>SKU-10856</td>
                <td>Bluetooth Speaker</td>
                <td>Electronics</td>
                <td>12</td>
                <td><span class="status warning">Low</span></td>
              </tr>
              <tr>
                <td>SKU-10571</td>
                <td>USB-C Cable</td>
                <td>Accessories</td>
                <td>5</td>
                <td><span class="status critical">Critical</span></td>
              </tr>
              <tr>
                <td>SKU-10762</td>
                <td>Wireless Charger</td>
                <td>Electronics</td>
                <td>0</td>
                <td><span class="status out">Out of Stock</span></td>
              </tr>
            </tbody>
          </table>
        `;
        break;
        
      case 'Profit & Loss':
        html = `
          <div class="report-chart">
            <h3>Revenue vs. Expenses</h3>
            <div class="chart-placeholder dual">
              <div class="chart-group">
                <div class="chart-bar revenue" style="height: 65%"></div>
                <div class="chart-bar expense" style="height: 45%"></div>
              </div>
              <div class="chart-group">
                <div class="chart-bar revenue" style="height: 75%"></div>
                <div class="chart-bar expense" style="height: 50%"></div>
              </div>
              <div class="chart-group">
                <div class="chart-bar revenue" style="height: 85%"></div>
                <div class="chart-bar expense" style="height: 60%"></div>
              </div>
              <div class="chart-group">
                <div class="chart-bar revenue" style="height: 95%"></div>
                <div class="chart-bar expense" style="height: 70%"></div>
              </div>
            </div>
            <div class="chart-legend">
              <span>Q1</span>
              <span>Q2</span>
              <span>Q3</span>
              <span>Q4</span>
            </div>
            <div class="chart-legend-items">
              <div class="legend-item">
                <span class="legend-color revenue"></span>
                <span>Revenue</span>
              </div>
              <div class="legend-item">
                <span class="legend-color expense"></span>
                <span>Expenses</span>
              </div>
            </div>
          </div>
          <div class="report-stats">
            <div class="stat-card">
              <h4>Total Revenue</h4>
              <div class="stat-value">$542,658</div>
              <div class="stat-change positive">+15.3%</div>
            </div>
            <div class="stat-card">
              <h4>Total Expenses</h4>
              <div class="stat-value">$348,924</div>
              <div class="stat-change negative">+8.7%</div>
            </div>
            <div class="stat-card">
              <h4>Net Profit</h4>
              <div class="stat-value">$193,734</div>
              <div class="stat-change positive">+22.4%</div>
            </div>
            <div class="stat-card">
              <h4>Profit Margin</h4>
              <div class="stat-value">35.7%</div>
              <div class="stat-change positive">+2.5%</div>
            </div>
          </div>
        `;
        break;
        
      default:
        html = `
          <div class="report-message">
            <i class="fas fa-file-alt"></i>
            <h3>${reportName} Report</h3>
            <p>Sample report data would appear here.</p>
          </div>
        `;
    }
    
    // Add styling for the mock report data
    html += `
      <style>
        .report-chart {
          margin-bottom: 24px;
          text-align: center;
        }
        
        .report-chart h3 {
          margin-bottom: 16px;
          color: #1E3A8A;
        }
        
        .chart-placeholder {
          height: 200px;
          background: #f8fafc;
          border-radius: 8px;
          display: flex;
          align-items: flex-end;
          justify-content: space-around;
          padding: 0 16px 16px;
          gap: 16px;
        }
        
        .chart-bar {
          width: 50px;
          background: linear-gradient(180deg, #1E3A8A 0%, #3B82F6 100%);
          border-radius: 6px 6px 0 0;
          transition: height 0.5s ease;
        }
        
        .chart-legend {
          display: flex;
          justify-content: space-around;
          margin-top: 8px;
        }
        
        .chart-legend span {
          color: #64748b;
          font-size: 0.875rem;
        }
        
        .chart-placeholder.dual {
          gap: 24px;
        }
        
        .chart-group {
          display: flex;
          gap: 8px;
        }
        
        .chart-bar.revenue {
          background: linear-gradient(180deg, #1E3A8A 0%, #3B82F6 100%);
          width: 30px;
        }
        
        .chart-bar.expense {
          background: linear-gradient(180deg, #EF4444 0%, #F87171 100%);
          width: 30px;
        }
        
        .chart-legend-items {
          display: flex;
          justify-content: center;
          gap: 24px;
          margin-top: 16px;
        }
        
        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .legend-color {
          width: 16px;
          height: 16px;
          border-radius: 4px;
        }
        
        .legend-color.revenue {
          background: linear-gradient(180deg, #1E3A8A 0%, #3B82F6 100%);
        }
        
        .legend-color.expense {
          background: linear-gradient(180deg, #EF4444 0%, #F87171 100%);
        }
        
        .report-stats {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }
        
        .stat-card {
          background: #f8fafc;
          padding: 16px;
          border-radius: 8px;
          box-shadow: 0 2px 6px rgba(30, 58, 138, 0.05);
        }
        
        .stat-card h4 {
          margin: 0 0 8px 0;
          color: #64748b;
          font-size: 0.875rem;
          font-weight: 600;
        }
        
        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1E3A8A;
          margin-bottom: 4px;
        }
        
        .stat-change {
          font-size: 0.875rem;
          font-weight: 600;
        }
        
        .stat-change.positive {
          color: #10B981;
        }
        
        .stat-change.negative {
          color: #EF4444;
        }
        
        .report-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 24px;
          font-size: 0.875rem;
        }
        
        .report-table th {
          text-align: left;
          padding: 12px 16px;
          background: #f1f5f9;
          color: #475569;
          font-weight: 600;
          border-bottom: 2px solid #e2e8f0;
        }
        
        .report-table td {
          padding: 12px 16px;
          border-bottom: 1px solid #e2e8f0;
          color: #334155;
        }
        
        .status {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
        }
        
        .status.good {
          background: #DCFCE7;
          color: #10B981;
        }
        
        .status.warning {
          background: #FEF3C7;
          color: #F59E0B;
        }
        
        .status.critical {
          background: #FEE2E2;
          color: #EF4444;
        }
        
        .status.out {
          background: #F1F5F9;
          color: #64748b;
        }
        
        .report-message {
          text-align: center;
          padding: 40px 0;
          color: #64748b;
        }
        
        .report-message i {
          font-size: 3rem;
          margin-bottom: 16px;
          color: #1E3A8A;
        }
        
        .report-message h3 {
          margin: 0 0 8px 0;
          color: #1E3A8A;
          font-size: 1.25rem;
        }
        
        .report-message p {
          margin: 0;
          font-size: 1rem;
        }
        
        @media (max-width: 768px) {
          .report-stats {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          }
          
          .chart-bar {
            width: 30px;
          }
          
          .chart-bar.revenue,
          .chart-bar.expense {
            width: 20px;
          }
          
          .report-table {
            font-size: 0.75rem;
          }
          
          .report-table th,
          .report-table td {
            padding: 8px;
          }
        }
      </style>
    `;
    
    return html;
  }

  // Toast notification function
  function showToast(message) {
    // Create toast element if it doesn't exist
    let toast = document.querySelector('.toast-notification');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast-notification';
      document.body.appendChild(toast);
      
      // Add toast styles if not present
      if (!document.getElementById('toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
          .toast-notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #1E3A8A;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1001;
            font-size: 0.875rem;
            transition: all 0.3s ease;
            transform: translateY(100px);
            opacity: 0;
          }
          
          .toast-notification.show {
            transform: translateY(0);
            opacity: 1;
          }
        `;
        document.head.appendChild(style);
      }
    }
    
    // Set message and show toast
    toast.textContent = message;
    toast.classList.add('show');
    
    // Hide toast after 3 seconds
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }
});