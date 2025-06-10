/**
 * index.js - Main JavaScript for the extraction page
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize date picker for extraction date with today's date as default
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('extractionDate').value = today;
    
    // Setup Select2 for job dropdown
    $('#jobNo').select2({
        placeholder: 'Select a job',
        allowClear: true,
        width: '100%'
    });
    
    // Load initial jobs list
    loadJobs();
    
    // Add event listener for job selection
    document.getElementById('jobNo').addEventListener('change', function() {
        const jobId = this.value;
        if (jobId) {
            // Load machine details and quantity for the selected job
            loadMachineDetails(jobId);
            loadTotalQty(jobId);
            
            // Enable extraction quantity field
            document.getElementById('extractionQty').disabled = false;
        } else {
            // Clear and disable fields if no job is selected
            document.getElementById('machineNo').value = '';
            document.getElementById('finishedGood').value = '';
            document.getElementById('qty').textContent = '0';
            document.getElementById('extractionQty').value = '';
            document.getElementById('extractionQty').disabled = true;
        }
    });
    
    // Add event listener for the form submission
    document.getElementById('extractionForm').addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Basic validation
        const jobId = document.getElementById('jobNo').value;
        const extractionQty = document.getElementById('extractionQty').value;
        
        if (!jobId) {
            alert('Please select a job first.');
            return;
        }
        
        if (!extractionQty || parseFloat(extractionQty) <= 0) {
            alert('Please enter a valid extraction quantity.');
            return;
        }
        
        // All validation passed, proceed with the extraction
        saveExtraction();
    });
    
    // Add event listener for extraction quantity validation
    document.getElementById('extractionQty').addEventListener('input', function() {
        const maxQty = parseFloat(this.max || 0);
        const enteredQty = parseFloat(this.value || 0);
        
        if (enteredQty > maxQty) {
            // Visual indication that quantity exceeds maximum
            this.classList.add('invalid');
            document.getElementById('qtyError').textContent = 'Quantity exceeds available amount';
            document.getElementById('extractButton').disabled = true;
        } else if (enteredQty <= 0) {
            // Visual indication that quantity is invalid
            this.classList.add('invalid');
            document.getElementById('qtyError').textContent = 'Quantity must be greater than 0';
            document.getElementById('extractButton').disabled = true;
        } else {
            // Clear error state
            this.classList.remove('invalid');
            document.getElementById('qtyError').textContent = '';
            document.getElementById('extractButton').disabled = false;
        }
    });
    
    // Add event listener for Reset button
    document.getElementById('resetButton').addEventListener('click', function() {
        // Reset form fields but don't reload jobs list
        document.getElementById('extractionForm').reset();
        document.getElementById('extractionDate').value = today; // Set date back to today
        document.getElementById('qty').textContent = '0';
        document.getElementById('qtyError').textContent = '';
        document.getElementById('extractionQty').classList.remove('invalid');
        
        // Reset Select2
        $('#jobNo').val(null).trigger('change');
        
        // Disable fields
        document.getElementById('machineNo').value = '';
        document.getElementById('finishedGood').value = '';
        document.getElementById('extractionQty').disabled = true;
    });
    
    // Add event listener for Refresh button
    document.getElementById('refreshButton').addEventListener('click', function() {
        // Reload jobs list
        loadJobs();
        
        // Reset form
        document.getElementById('resetButton').click();
    });
});