document.addEventListener('DOMContentLoaded', function() {
    // Fetch BOM headers on page load
    fetchBOMHeaders();
    
    // Add event listeners for view, edit, and delete buttons
    document.querySelector('tbody').addEventListener('click', function(e) {
        const target = e.target;
        const row = target.closest('tr');
        const jobNo = row.getAttribute('data-job-no');
        
        if (target.classList.contains('view-btn')) {
            viewBOM(jobNo);
        } else if (target.classList.contains('edit')) {
            editBOM(jobNo);
        } else if (target.classList.contains('delete')) {
            confirmDelete(jobNo);
        }
    });
    
    // Add event listeners for search functionality
    document.getElementById('search-btn').addEventListener('click', performSearch);
    document.getElementById('reset-search-btn').addEventListener('click', resetSearch);
    
    // Add event listener for pressing Enter in search fields
    const searchFields = document.querySelectorAll('.search-field input, .search-field select');
    searchFields.forEach(field => {
        field.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    });
});

// Store all BOM headers for filtering
let allBOMHeaders = [];

// Function to fetch BOM headers from the server
function fetchBOMHeaders() {
    fetch('../../../models/setup/bomList/fetch.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                allBOMHeaders = data.data; // Store all headers for filtering
                displayBOMHeaders(data.data);
            } else {
                showAlert('Error: ' + data.message, 'error');
            }
        })
        .catch(error => {
            showAlert('Failed to fetch BOM headers: ' + error, 'error');
        });
}

// Function to display BOM headers in the table
function displayBOMHeaders(headers) {
    const tbody = document.querySelector('tbody');
    tbody.innerHTML = '';
    
    if (headers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No records found</td></tr>';
        return;
    }
    
    headers.forEach(header => {
        // Format date from database timestamp
        const date = new Date(header.created_at);
        const formattedDate = date.toISOString().split('T')[0];
        
        // Determine status class
        let statusClass = '';
        switch(header.status) {
            case 'Completed':
                statusClass = 'completed';
                break;
            case 'Processing':
                statusClass = 'in-progress';
                break;
            case 'Cancelled':
                statusClass = 'pending';
                break;
        }
        
        const row = document.createElement('tr');
        row.setAttribute('data-job-no', header.job_no);
        
        row.innerHTML = `
            <td>${formattedDate}</td>
            <td>JOB-${header.job_no.toString().padStart(3, '0')}</td>
            <td>MC-${header.machine_no}</td>
            <td>${header.finished_good}</td>
            <td>${header.total_qty}</td>
            <td><span class="status ${statusClass}">${header.status}</span></td>
            <td class="actions">
                <button class="view-btn">View</button>
                <img src="https://img.icons8.com/material-outlined/24/000000/edit--v1.png" alt="Edit" class="edit">
                <img src="https://img.icons8.com/material-outlined/24/000000/delete-forever.png" alt="Delete" class="delete">
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

// Function to perform search
function performSearch() {
    const jobNo = document.getElementById('search-job').value.trim();
    const machineNo = document.getElementById('search-machine').value.trim();
    const finishedGood = document.getElementById('search-finished-good').value.trim().toLowerCase();
    const status = document.getElementById('search-status').value;
    const dateFrom = document.getElementById('search-date-from').value;
    const dateTo = document.getElementById('search-date-to').value;
    
    // Filter the data based on search criteria
    const filteredHeaders = allBOMHeaders.filter(header => {
        // Job number filter
        if (jobNo && !header.job_no.toString().includes(jobNo)) {
            return false;
        }
        
        // Machine number filter
        if (machineNo && !header.machine_no.toString().includes(machineNo)) {
            return false;
        }
        
        // Finished good filter
        if (finishedGood && !header.finished_good.toLowerCase().includes(finishedGood)) {
            return false;
        }
        
        // Status filter
        if (status && header.status !== status) {
            return false;
        }
        
        // Date from filter
        if (dateFrom) {
            const headerDate = new Date(header.created_at).toISOString().split('T')[0];
            if (headerDate < dateFrom) {
                return false;
            }
        }
        
        // Date to filter
        if (dateTo) {
            const headerDate = new Date(header.created_at).toISOString().split('T')[0];
            if (headerDate > dateTo) {
                return false;
            }
        }
        
        return true;
    });
    
    // Display filtered results
    displayBOMHeaders(filteredHeaders);
    
    // Show message if no results
    if (filteredHeaders.length === 0) {
        showAlert('No matching records found', 'info');
    } else {
        showAlert(`Found ${filteredHeaders.length} matching records`, 'success');
    }
}

// Function to reset search
function resetSearch() {
    // Clear all search inputs
    document.getElementById('search-job').value = '';
    document.getElementById('search-machine').value = '';
    document.getElementById('search-finished-good').value = '';
    document.getElementById('search-status').value = '';
    document.getElementById('search-date-from').value = '';
    document.getElementById('search-date-to').value = '';
    
    // Display all data
    displayBOMHeaders(allBOMHeaders);
    
    // Show message
    showAlert('Search filters cleared', 'info');
}

// Function to show alert messages
function showAlert(message, type = 'info') {
    // Create alert element
    const alertElement = document.createElement('div');
    alertElement.className = `alert alert-${type}`;
    alertElement.textContent = message;
    
    // Add to container
    const container = document.querySelector('.container');
    container.insertBefore(alertElement, container.firstChild);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        alertElement.remove();
    }, 3000);
}

// Function to handle view action
function viewBOM(jobNo) {
    window.location.href = `../bomView/index.html?job_no=${jobNo}`;
}

// Function to handle edit action
function editBOM(jobNo) {
    window.location.href = `../bomEdit/index.html?job_no=${jobNo}`;
}

// Function to confirm and handle delete action
function confirmDelete(jobNo) {
    if (confirm('Are you sure you want to delete this BOM entry?')) {
        const formData = new FormData();
        formData.append('job_no', jobNo);
        
        fetch('../../../models/setup/bomList/delete.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showAlert('BOM entry deleted successfully', 'success');
                fetchBOMHeaders(); // Refresh the list
            } else {
                showAlert('Error: ' + data.message, 'error');
            }
        })
        .catch(error => {
            showAlert('Failed to delete BOM entry: ' + error, 'error');
        });
    }
}