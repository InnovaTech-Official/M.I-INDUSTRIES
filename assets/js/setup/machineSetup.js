$(document).ready(function() {
    $('#machineForm').on('submit', function(e) {
        e.preventDefault();
        saveEntry();
    });
    
    // Load all machine entries when page loads
    loadMachineEntries();
    
    // Handle redirects from setup dashboard
    const urlParams = new URLSearchParams(window.location.search);
    const setupType = urlParams.get('type');
    if (setupType) {
        document.getElementById('page-title').textContent = getPageTitle(setupType);
        
        // Redirect back to dashboard or specific form handling
        $('#back-to-setup').on('click', function() {
            window.location.href = '/Azizabad/views/dashboard/setup.html';
        });
    } else {
        // Default title
        document.getElementById('page-title').textContent = 'Machine Entry';
    }
});

// Function to get page title based on setup type
function getPageTitle(setupType) {
    switch(setupType) {
        case 'machine-types':
            return 'Machine Types Setup';
        case 'maintenance-schedule':
            return 'Maintenance Schedule Setup';
        default:
            return 'Machine Register';
    }
}

// Function to load all machine entries and populate the table
function loadMachineEntries() {
    // Show loading indicator
    $('#loading-indicator').show();
    $('#no-data-message').hide();
    $('#machine-table').hide();
    
    $.ajax({
        url: '/Azizabad/controllers/setup/machineSetup/index.php',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ action: 'get_all' }),
        success: function(response) {
            console.log('Raw response:', response);
            
            // Convert response to array if it's not already
            let entries = response;
            
            // If response is a string, try to parse it
            if (typeof entries === 'string') {
                try {
                    entries = JSON.parse(entries);
                    console.log('Parsed JSON response:', entries);
                } catch (e) {
                    console.error('Error parsing JSON response:', e);
                }
            }
            
            // Ensure entries is an array
            if (!Array.isArray(entries)) {
                // If object with numeric keys, convert to array
                if (typeof entries === 'object' && entries !== null) {
                    // Convert object to array
                    let entriesArray = [];
                    for (let key in entries) {
                        if (entries.hasOwnProperty(key)) {
                            entriesArray.push(entries[key]);
                        }
                    }
                    entries = entriesArray;
                    console.log('Converted object to array:', entries);
                } else {
                    entries = []; // Fallback to empty array
                    console.log('Could not convert to array, using empty array');
                }
            }
            
            console.log('Final entries array:', entries);
            console.log('Array length:', entries.length);
            
            // Hide loading indicator
            $('#loading-indicator').hide();
            
            // Show table or no-data message
            if (!entries || entries.length === 0) {
                $('#no-data-message').show();
                $('#machine-table').hide();
                console.log('No entries found, showing no-data message');
            } else {
                populateTable(entries);
                $('#machine-table').show();
                $('#no-data-message').hide();
                console.log('Entries found, showing table');
            }
        },
        error: function(xhr, status, error) {
            console.log('AJAX Error:', { 
                status: status, 
                error: error, 
                response: xhr.responseText,
                status_code: xhr.status
            });
            
            showToast('Error loading machine entries: ' + (xhr.responseJSON?.error || xhr.responseText || 'Unknown error'), 'error');
            
            // Hide loading indicator and show error state
            $('#loading-indicator').hide();
            $('#no-data-message').show().html('<p style="color: #EF4444;">Error loading data. Please try again.</p>');
            $('#machine-table').hide();
        }
    });
}

// Function to populate the table with machine entries
function populateTable(entries) {
    const tableBody = $('#machine-table-body');
    tableBody.empty();
    
    console.log('Populating table with entries:', entries);
    
    // Make sure entries is an array
    if (!Array.isArray(entries)) {
        console.error('Invalid entries data:', entries);
        return;
    }
    
    if (entries.length === 0) {
        return;
    }
    
    entries.forEach(entry => {
        // Format the date nicely if it exists
        let formattedDate = entry.date || '';
        if (formattedDate) {
            try {
                const dateObj = new Date(formattedDate);
                if (!isNaN(dateObj.getTime())) {
                    formattedDate = dateObj.toISOString().split('T')[0];
                }
            } catch (e) {
                console.error('Error formatting date:', e);
            }
        }
        
        const row = `
            <tr>
                <td>${entry.id || ''}</td>
                <td>${formattedDate}</td>
                <td>${entry.machine_name || ''}</td>
                <td>${entry.machine_type || ''}</td>
                <td>${entry.other || ''}</td>
                <td>
                    <button class="btn btn-primary btn-small" onclick="editEntry(${entry.id})">Edit</button>
                    <button class="btn btn-small" style="background-color: #EF4444; color: white;" onclick="deleteEntry(${entry.id})">Delete</button>
                </td>
            </tr>
        `;
        tableBody.append(row);
    });
}

function openModal() {
    document.getElementById('entryModal').style.display = 'block';
    resetForm();

    // Default date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').value = today;

    // Fetch the next ID for new entry
    $.ajax({
        url: '/Azizabad/controllers/setup/machineSetup/index.php',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ action: 'get_next_id' }),
        success: function(response) {
            // Set the next ID
            if (response.next_id) {
                document.getElementById('entry-id').value = response.next_id;
                document.getElementById('entry-id').placeholder = 'ID: ' + response.next_id;
            } else {
                document.getElementById('entry-id').value = '';
                document.getElementById('entry-id').placeholder = 'Auto-generated ID'; // Fallback
            }
        },
        error: function(xhr, status, error) {
            console.log('AJAX Error fetching next ID:', { status, error, response: xhr.responseText });
            showToast('Error fetching next ID', 'error');
            document.getElementById('entry-id').value = '';
        }
    });
}

function closeModal() {
    document.getElementById('entryModal').style.display = 'none';
}

// Reset form fields
function resetForm() {
    document.getElementById('machineForm').reset();
    document.getElementById('machine-type').value = '';
    document.getElementById('other').value = '';
    document.getElementById('machine-name').value = '';
    hideError();
}

function saveEntry() {
    // Get values from form
    const entry = {
        action: 'save',
        id: document.getElementById('entry-id').value.trim() || null,
        date: document.getElementById('date').value,
        machine_name: document.getElementById('machine-name').value.trim(),
        machine_type: document.getElementById('machine-type').value.trim(),
        other: document.getElementById('other').value.trim() || null
    };

    // Client-side validation
    if (!entry.date || !entry.machine_name || !entry.machine_type) {
        showToast('All required fields must be filled with valid values', 'error');
        return;
    }

    console.log('Sending data:', entry);

    // Send AJAX request
    $.ajax({
        url: '/Azizabad/controllers/setup/machineSetup/index.php',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(entry),
        success: function(response) {
            console.log('Response:', response);
            
            // First clear any existing errors
            hideError();
            
            // Check if response is a string and try to parse it
            if (typeof response === 'string') {
                try {
                    response = JSON.parse(response);
                } catch (e) {
                    // If parsing fails, assume it's an error message
                    showToast('Error: ' + response, 'error');
                    return;
                }
            }
            
            if (response.success === true) {
                showToast('Entry saved successfully!', 'success');
                closeModal();
                resetForm();
                loadMachineEntries(); // Reload the table
            } else {
                showToast('Error: ' + (response.error || 'Unknown server error'), 'error');
            }
        },
        error: function(xhr, status, error) {
            console.log('AJAX Error:', { 
                status: status, 
                error: error, 
                response: xhr.responseText,
                status_code: xhr.status
            });
            
            let errorMsg = 'Unknown error';
            try {
                const response = JSON.parse(xhr.responseText);
                errorMsg = response.error || errorMsg;
            } catch (e) {
                errorMsg = xhr.responseText || errorMsg;
            }
            showToast('Error saving entry: ' + errorMsg, 'error');
        }
    });
}

function editEntry(id) {
    // Show loading state in the modal
    document.getElementById('entryModal').style.display = 'block';
    document.getElementById('modal-title').textContent = 'Edit Machine Entry';
    resetForm();
    
    // Add loading indicators to fields
    document.getElementById('entry-id').placeholder = 'Loading...';
    document.getElementById('date').disabled = true;
    document.getElementById('machine-name').placeholder = 'Loading...';
    document.getElementById('machine-type').placeholder = 'Loading...';
    document.getElementById('other').placeholder = 'Loading...';
    
    $.ajax({
        url: '/Azizabad/controllers/setup/machineSetup/index.php',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ action: 'get', id: id }),
        success: function(response) {
            console.log('Edit entry response:', response);
            
            let entry = response;
            
            // Try to parse the response if it's a string
            if (typeof response === 'string') {
                try {
                    entry = JSON.parse(response);
                    console.log('Parsed entry data:', entry);
                } catch(e) {
                    console.error('Failed to parse entry data:', e);
                }
            }
            
            // Enable all fields
            document.getElementById('date').disabled = false;
            
            if (entry && Object.keys(entry).length > 0) {
                // Ensure we have string values instead of undefined
                const id = entry.id !== undefined ? entry.id : '';
                const date = entry.date !== undefined ? entry.date : '';
                const machineName = entry.machine_name !== undefined ? entry.machine_name : '';
                const machineType = entry.machine_type !== undefined ? entry.machine_type : '';
                const other = entry.other !== undefined ? entry.other : '';
                
                // Format date if needed
                let formattedDate = date;
                if (date && date.includes('T')) {
                    formattedDate = date.split('T')[0]; // Extract YYYY-MM-DD part
                }
                
                // Set values with fallbacks
                document.getElementById('entry-id').value = id;
                document.getElementById('entry-id').placeholder = id ? 'ID: ' + id : 'No ID';
                
                document.getElementById('date').value = formattedDate;
                document.getElementById('machine-name').value = machineName;
                document.getElementById('machine-type').value = machineType;
                document.getElementById('other').value = other;
                
                console.log('Populated form with values:', {
                    id,
                    date: formattedDate,
                    machineName,
                    machineType,
                    other
                });
            } else {
                showToast('Entry not found or has no data', 'error');
                document.getElementById('entry-id').placeholder = 'Entry not found';
                closeModal();
            }
        },
        error: function(xhr, status, error) {
            console.log('AJAX Error:', { 
                status: status, 
                error: error, 
                response: xhr.responseText,
                status_code: xhr.status
            });
            
            let errorMsg = 'Unknown error';
            try {
                const response = JSON.parse(xhr.responseText);
                errorMsg = response.error || errorMsg;
            } catch (e) {
                errorMsg = xhr.responseText || errorMsg;
            }
            showToast('Error fetching entry: ' + errorMsg, 'error');
            closeModal();
        }
    });
}

function deleteEntry(id) {
    if (!id || isNaN(id)) {
        showToast('Invalid ID for deletion', 'error');
        return;
    }
    
    if (confirm('Are you sure you want to delete this entry?')) {
        console.log('Attempting to delete entry with ID:', id);
        
        $.ajax({
            url: '/Azizabad/controllers/setup/machineSetup/index.php',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ 
                action: 'delete', 
                id: parseInt(id) 
            }),
            success: function(response) {
                console.log('Delete response:', response);
                
                // Try to parse response if it's a string
                if (typeof response === 'string') {
                    try {
                        response = JSON.parse(response);
                    } catch (e) {
                        console.error('Error parsing delete response:', e);
                        showToast('Error: ' + response, 'error');
                        return;
                    }
                }
                
                if (response && response.success === true) {
                    showToast('Entry deleted successfully!', 'success');
                    loadMachineEntries(); // Reload the table
                } else {
                    console.error('Delete failed with response:', response);
                    showToast('Error: ' + (response.error || 'Unknown server error'), 'error');
                }
            },
            error: function(xhr, status, error) {
                console.log('AJAX Error during delete:', { 
                    status: status, 
                    error: error, 
                    response: xhr.responseText,
                    status_code: xhr.status
                });
                
                let errorMsg = 'Unknown error';
                try {
                    const response = JSON.parse(xhr.responseText);
                    errorMsg = response.error || errorMsg;
                } catch (e) {
                    errorMsg = xhr.responseText || errorMsg;
                }
                showToast('Error deleting entry: ' + errorMsg, 'error');
            }
        });
    }
}

// Show Toastify notification
function showToast(message, type = 'info') {
    const backgroundColor = type === 'success' ? '#10B981' : 
                           type === 'error' ? '#EF4444' : 
                           type === 'warning' ? '#F59E0B' : '#3B82F6';
    
    Toastify({
        text: message,
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        backgroundColor: backgroundColor,
        stopOnFocus: true
    }).showToast();
}

// Show error in container (legacy method, keeping for compatibility)
function showError(message) {
    const errorContainer = document.getElementById('errorContainer');
    errorContainer.textContent = message;
    errorContainer.style.display = 'block';
    
    // Also show as toast
    showToast(message, 'error');
}

// Hide error in container
function hideError() {
    const errorContainer = document.getElementById('errorContainer');
    errorContainer.textContent = '';
    errorContainer.style.display = 'none';
}

window.onclick = function(event) {
    const modal = document.getElementById('entryModal');
    if (event.target === modal) {
        closeModal();
    }
};