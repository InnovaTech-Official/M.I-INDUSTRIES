// HR Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize dropdown functionality
    initDropdowns();
    
    // Initialize employee table functionality
    initEmployeeTable();
    
    // Initialize search functionality
    initSearch();
    
    // Initialize leave request actions
    initLeaveRequests();
    
    // Initialize department chart animations
    initDepartmentCharts();
    
    // Initialize attendance chart
    initAttendanceChart();
});

// Dropdown functionality
function initDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const btn = dropdown.querySelector('.dropdown-btn');
        
        btn.addEventListener('click', function() {
            // Close all other dropdowns
            dropdowns.forEach(d => {
                if (d !== dropdown) {
                    d.classList.remove('active');
                }
            });
            
            // Toggle current dropdown
            dropdown.classList.toggle('active');
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown')) {
            dropdowns.forEach(d => {
                d.classList.remove('active');
            });
        }
    });
}

// Employee table functionality
function initEmployeeTable() {
    const selectAll = document.querySelector('.select-all-checkbox');
    const employeeCheckboxes = document.querySelectorAll('.employee-checkbox');
    
    // Handle select all functionality
    if (selectAll) {
        selectAll.addEventListener('change', function() {
            employeeCheckboxes.forEach(checkbox => {
                checkbox.checked = selectAll.checked;
            });
            
            updateBulkActions();
        });
    }
    
    // Handle individual checkbox changes
    employeeCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateSelectAllState();
            updateBulkActions();
        });
    });
    
    // Initialize pagination
    initPagination();
}

// Update select all checkbox state based on individual selections
function updateSelectAllState() {
    const selectAll = document.querySelector('.select-all-checkbox');
    const employeeCheckboxes = document.querySelectorAll('.employee-checkbox');
    
    if (!selectAll) return;
    
    const allChecked = Array.from(employeeCheckboxes).every(checkbox => checkbox.checked);
    const someChecked = Array.from(employeeCheckboxes).some(checkbox => checkbox.checked);
    
    selectAll.checked = allChecked;
    selectAll.indeterminate = someChecked && !allChecked;
}

// Show/hide bulk actions based on selections
function updateBulkActions() {
    const bulkActions = document.querySelector('.bulk-actions');
    const employeeCheckboxes = document.querySelectorAll('.employee-checkbox');
    const checkedCount = Array.from(employeeCheckboxes).filter(checkbox => checkbox.checked).length;
    
    if (bulkActions) {
        if (checkedCount > 0) {
            bulkActions.classList.add('visible');
            const countElem = bulkActions.querySelector('.selected-count');
            if (countElem) {
                countElem.textContent = checkedCount;
            }
        } else {
            bulkActions.classList.remove('visible');
        }
    }
}

// Pagination functionality
function initPagination() {
    const paginationBtns = document.querySelectorAll('.pagination-btn');
    
    paginationBtns.forEach(btn => {
        if (!btn.classList.contains('prev') && !btn.classList.contains('next')) {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                paginationBtns.forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked button
                btn.classList.add('active');
                
                // Here you would normally fetch the data for the selected page
                // For demonstration, we'll just log the page number
                console.log('Page changed to:', btn.textContent.trim());
            });
        }
    });
    
    // Previous and Next buttons
    const prevBtn = document.querySelector('.pagination-btn.prev');
    const nextBtn = document.querySelector('.pagination-btn.next');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            const activePage = document.querySelector('.pagination-btn.active');
            if (activePage && activePage.previousElementSibling && 
                !activePage.previousElementSibling.classList.contains('prev')) {
                activePage.previousElementSibling.click();
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            const activePage = document.querySelector('.pagination-btn.active');
            if (activePage && activePage.nextElementSibling && 
                !activePage.nextElementSibling.classList.contains('next')) {
                activePage.nextElementSibling.click();
            }
        });
    }
}

// Search functionality
function initSearch() {
    const searchInput = document.querySelector('.search-input');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = searchInput.value.toLowerCase().trim();
            
            // Get all employee rows
            const employeeRows = document.querySelectorAll('.employee-table tbody tr');
            
            // Filter employees based on search term
            employeeRows.forEach(row => {
                const employeeName = row.querySelector('.employee-name')?.textContent.toLowerCase() || '';
                const employeeEmail = row.querySelector('.employee-email')?.textContent.toLowerCase() || '';
                const employeeRole = row.querySelector('.employee-role')?.textContent.toLowerCase() || '';
                const employeeDepartment = row.querySelector('.employee-department')?.textContent.toLowerCase() || '';
                
                const matchesSearch = 
                    employeeName.includes(searchTerm) || 
                    employeeEmail.includes(searchTerm) || 
                    employeeRole.includes(searchTerm) || 
                    employeeDepartment.includes(searchTerm);
                
                row.style.display = matchesSearch ? '' : 'none';
            });
            
            // Update no results message if needed
            updateNoResultsMessage(employeeRows);
        });
    }
}

// Show/hide no results message
function updateNoResultsMessage(employeeRows) {
    const noResultsMsg = document.querySelector('.no-results-message');
    const visibleRows = Array.from(employeeRows).filter(row => row.style.display !== 'none');
    
    if (noResultsMsg) {
        noResultsMsg.style.display = visibleRows.length === 0 ? 'block' : 'none';
    }
}

// Leave request actions
function initLeaveRequests() {
    const approveButtons = document.querySelectorAll('.leave-btn.approve');
    const rejectButtons = document.querySelectorAll('.leave-btn.reject');
    
    approveButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const leaveItem = btn.closest('.leave-item');
            handleLeaveAction(leaveItem, 'approved');
        });
    });
    
    rejectButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const leaveItem = btn.closest('.leave-item');
            handleLeaveAction(leaveItem, 'rejected');
        });
    });
}

// Handle leave request approval/rejection
function handleLeaveAction(leaveItem, action) {
    if (!leaveItem) return;
    
    const employeeName = leaveItem.querySelector('.employee-name')?.textContent || 'Employee';
    const leaveType = leaveItem.querySelector('.leave-type')?.textContent || 'Leave';
    
    // Here you would normally send an AJAX request to update the leave status
    // For demonstration, we'll just update the UI
    
    // Create status badge
    const statusBadge = document.createElement('span');
    statusBadge.className = `status-badge ${action}`;
    statusBadge.textContent = action === 'approved' ? 'Approved' : 'Rejected';
    
    // Replace action buttons with status badge
    const leaveActions = leaveItem.querySelector('.leave-actions');
    if (leaveActions) {
        leaveActions.innerHTML = '';
        leaveActions.appendChild(statusBadge);
    }
    
    // Show notification
    showNotification(`${leaveType} for ${employeeName} has been ${action}`, action);
}

// Show notification
function showNotification(message, type = 'info') {
    // Check if notification container exists, create if not
    let notifContainer = document.querySelector('.notification-container');
    if (!notifContainer) {
        notifContainer = document.createElement('div');
        notifContainer.className = 'notification-container';
        document.body.appendChild(notifContainer);
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    // Add notification to container
    notifContainer.appendChild(notification);
    
    // Add close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', function() {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Department chart animations
function initDepartmentCharts() {
    const departmentBars = document.querySelectorAll('.department-bar');
    
    // Animate department bars on load
    departmentBars.forEach(bar => {
        const width = bar.getAttribute('data-percent') || '0';
        
        // Start with width 0 and animate to the actual width
        bar.style.width = '0';
        
        setTimeout(() => {
            bar.style.transition = 'width 1s ease-in-out';
            bar.style.width = width + '%';
        }, 100);
    });
}

// Attendance chart
function initAttendanceChart() {
    const dayBars = document.querySelectorAll('.day-bar');
    
    // Animate attendance bars on load
    dayBars.forEach((bar, index) => {
        const height = bar.getAttribute('data-height') || '0';
        
        // Start with height 0 and animate to the actual height
        bar.style.height = '0';
        
        setTimeout(() => {
            bar.style.transition = 'height 0.5s ease-in-out';
            bar.style.height = height + '%';
        }, 100 + (index * 50)); // Stagger the animations
    });
}