/**
 * Dashboard home JavaScript file
 * Handles specific functionality for the home dashboard page
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize username
    updateUsername();
    
    // Initialize stats
    updateStats();
    
    // Initialize chart data
    setupSalesChart();
    
    // Setup time period selector for chart
    setupTimeSelect();
    
    // Setup action buttons
    setupActionButtons();
});

/**
 * Update the username display
 */
function updateUsername() {
    const usernameElement = document.getElementById('user-name');
    
    // In a real application, this would come from the server
    // For now, we'll use a placeholder or get from sessionStorage if available
    const username = sessionStorage.getItem('username') || 'Admin';
    
    if (usernameElement) {
        usernameElement.textContent = username;
    }
}

/**
 * Update dashboard statistics
 * In a real application, this would fetch data from the server
 */
function updateStats() {
    // This would typically fetch the latest stats via AJAX
    // For demonstration, we'll just update the existing values
    
    // You could implement real-time updates like this:
    // fetchData('/api/dashboard/stats').then(data => {
    //     if (data) {
    //         updateStatsDisplay(data);
    //     }
    // });
}

/**
 * Setup the sales chart
 */
function setupSalesChart() {
    // In a real application, this would use a charting library like Chart.js
    // For this demonstration, we're using a placeholder visualization
    
    // Example of how this might be implemented with Chart.js:
    // const ctx = document.getElementById('sales-chart').getContext('2d');
    // const salesChart = new Chart(ctx, {
    //     type: 'bar',
    //     data: {
    //         labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    //         datasets: [{
    //             label: 'Sales',
    //             data: [30, 45, 65, 40, 55, 75, 60],
    //             backgroundColor: 'rgba(54, 162, 235, 0.5)',
    //             borderColor: 'rgba(54, 162, 235, 1)',
    //             borderWidth: 1
    //         }]
    //     },
    //     options: {
    //         responsive: true,
    //         scales: {
    //             y: {
    //                 beginAtZero: true
    //             }
    //         }
    //     }
    // });
}

/**
 * Setup time period selector for chart
 */
function setupTimeSelect() {
    const timeSelect = document.querySelector('.time-select');
    
    if (timeSelect) {
        timeSelect.addEventListener('change', function() {
            const selectedPeriod = this.value;
            console.log(`Changing chart to time period: ${selectedPeriod}`);
            
            // Here you would typically fetch new data based on the selected time period
            // and update the chart
            // For demonstration, we'll just log the change
            
            // Example of fetching new data:
            // fetchData(`/api/dashboard/sales?period=${selectedPeriod}`).then(data => {
            //     if (data) {
            //         updateChartData(salesChart, data);
            //     }
            // });
        });
    }
}

/**
 * Setup action buttons
 */
function setupActionButtons() {
    // Setup "New Transaction" button
    const newTransactionBtn = document.querySelector('.welcome-actions .action-btn:first-child');
    if (newTransactionBtn) {
        newTransactionBtn.addEventListener('click', function() {
            console.log('Creating new transaction');
            // Here you would typically show a modal or navigate to a new transaction page
        });
    }
    
    // Setup "Export Data" button
    const exportDataBtn = document.querySelector('.welcome-actions .action-btn.secondary');
    if (exportDataBtn) {
        exportDataBtn.addEventListener('click', function() {
            console.log('Exporting data');
            // Here you would typically trigger a data export
        });
    }
    
    // Setup quick action tiles
    const actionTiles = document.querySelectorAll('.action-tile');
    actionTiles.forEach(tile => {
        tile.addEventListener('click', function(event) {
            event.preventDefault();
            const action = this.querySelector('span').textContent;
            console.log(`Quick action: ${action}`);
            // Here you would typically handle the specific action
        });
    });
    
    // Setup "View All" links
    const viewAllLinks = document.querySelectorAll('.action-link');
    viewAllLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const section = this.closest('.dashboard-card').querySelector('h2').textContent;
            console.log(`View all for: ${section}`);
            // Here you would typically navigate to a detailed view
        });
    });
}

/**
 * Format date for display
 * @param {Date} date - The date to format
 * @returns {string} - Formatted date string
 */
function formatDate(date) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

/**
 * Format time ago for display
 * @param {Date} date - The date to calculate time ago from
 * @returns {string} - Formatted time ago string
 */
function timeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    let interval = Math.floor(seconds / 31536000);
    if (interval > 1) {
        return `${interval} years ago`;
    }
    if (interval === 1) {
        return `1 year ago`;
    }
    
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return `${interval} months ago`;
    }
    if (interval === 1) {
        return `1 month ago`;
    }
    
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return `${interval} days ago`;
    }
    if (interval === 1) {
        return `1 day ago`;
    }
    
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return `${interval} hours ago`;
    }
    if (interval === 1) {
        return `1 hour ago`;
    }
    
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return `${interval} minutes ago`;
    }
    if (interval === 1) {
        return `1 minute ago`;
    }
    
    return `${Math.floor(seconds)} seconds ago`;
}