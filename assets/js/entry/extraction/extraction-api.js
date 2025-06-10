/**
 * extraction-api.js - API functions for the extraction page
 */

/**
 * Display a toast notification
 * @param {string} message - The message to display
 * @param {string} type - The type of message ('success' or 'error')
 */
function showToast(message, type = 'success') {
    const bgColor = type === 'success' ? '#4CAF50' : '#F44336';
    
    Toastify({
        text: message,
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        backgroundColor: bgColor,
        stopOnFocus: true, // Prevents dismissing of toast on hover
        onClick: function(){} // Callback after click
    }).showToast();
}

/**
 * Load all available jobs for extraction
 */
function loadJobs() {
    console.log('Loading jobs...');
    
    // Use relative path that matches the server directory structure
    fetch('../../../models/entry/extraction/fetch.php?action=getAvailableJobs')
        .then(response => {
            if (!response.ok) {
                console.error('Server returned status:', response.status);
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Jobs data received:', data);
            const jobSelect = document.getElementById('jobNo');
            
            // Clear existing options except the placeholder
            while (jobSelect.options.length > 1) {
                jobSelect.remove(1);
            }
            
            // Add new options
            if (data.jobs && Array.isArray(data.jobs)) {
                data.jobs.forEach(job => {
                    // Use job_no as both text and value
                    const option = new Option(job.job_no, job.job_no);
                    jobSelect.add(option);
                });
            }
            
            // Trigger change event for Select2
            $(jobSelect).trigger('change');
        })
        .catch(error => {
            console.error('Error loading jobs:', error);
            showToast('Failed to load jobs. Please try again.', 'error');
        });
}

/**
 * Load machine details for a selected job
 * @param {string} jobNo - The job number
 */
function loadMachineDetails(jobNo) {
    console.log('Loading details for job:', jobNo);
    
    // Use relative path that matches the server directory structure
    fetch(`../../../models/entry/extraction/fetch.php?action=getJobDetails&jobNo=${jobNo}`)
        .then(response => {
            if (!response.ok) {
                console.error('Server returned status:', response.status);
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Job details received:', data);
            
            if (data.error) {
                showToast(data.error, 'error');
                return;
            }
            
            // Direct mapping to match the field names from the server response
            document.getElementById('machineNo').value = data.machine_no || '';
            document.getElementById('finishedGood').value = data.finished_good || '';
            
            // Display and set the maximum available quantity
            if (data.total_qty) {
                const qty = parseFloat(data.total_qty) || 0;
                document.getElementById('originalQty').value = qty.toFixed(2); // Store original qty for calculations
                document.getElementById('availableQty').textContent = qty.toFixed(2); // Initial available qty is same as original
                document.getElementById('qty').textContent = qty.toFixed(2);
                
                // Set the maximum for extraction quantity input
                const extractionQtyInput = document.getElementById('extractionQty');
                extractionQtyInput.max = qty;
                extractionQtyInput.placeholder = `Max: ${qty.toFixed(2)}`;
                
                // Reset wastage field
                document.getElementById('wastage').value = '';
                
                // Initial calculation in case wastage already has a value
                calculateRemainingQty();
                
                // Show success message
                showToast(`Job ${jobNo} loaded successfully`, 'success');
            }
        })
        .catch(error => {
            console.error('Error loading job details:', error);
            showToast('Failed to load job details. Please try again.', 'error');
        });
}

/**
 * Calculate remaining quantity based on wastage percentage
 */
function calculateRemainingQty() {
    const originalQtyElement = document.getElementById('originalQty');
    const extractionQtyElement = document.getElementById('extractionQty');
    const wastageElement = document.getElementById('wastage');
    const qtyDisplayElement = document.getElementById('qty');
    const availableQtyElement = document.getElementById('availableQty');
    
    if (!originalQtyElement || !extractionQtyElement || !wastageElement || !qtyDisplayElement) {
        console.error('Required elements not found for calculation');
        return;
    }
    
    // Get values from form fields
    const originalQty = parseFloat(originalQtyElement.value) || 0;
    const extractionQty = parseFloat(extractionQtyElement.value) || 0;
    const wastagePercent = parseFloat(wastageElement.value) || 0;
    
    // Calculate wastage amount (directly from original quantity)
    const wastageAmount = (originalQty * wastagePercent) / 100;
    
    // Calculate available quantity after wastage
    const availableQty = Math.max(0, originalQty - wastageAmount);
    
    // Calculate remaining quantity after extraction
    const remainingQty = Math.max(0, availableQty - extractionQty);
    
    // Update the displays
    availableQtyElement.textContent = availableQty.toFixed(2);
    qtyDisplayElement.textContent = remainingQty.toFixed(2);
    
    // Update max attribute on extraction input
    extractionQtyElement.max = availableQty;
    extractionQtyElement.placeholder = `Max: ${availableQty.toFixed(2)}`;
    
    // Fix floating point precision issues before comparison
    // Allow a small tolerance (0.001) for floating point errors
    const precision = 1000; // 3 decimal places
    const extractionQtyRounded = Math.round(extractionQty * precision) / precision;
    const availableQtyRounded = Math.round(availableQty * precision) / precision;
    
    // Validate that extraction doesn't exceed available quantity
    if (extractionQtyRounded > availableQtyRounded) {
        extractionQtyElement.setCustomValidity(`Extraction quantity (${extractionQty.toFixed(2)}) exceeds available quantity (${availableQty.toFixed(2)})`);
    } else {
        extractionQtyElement.setCustomValidity('');
    }
    
    // Store available quantity for server-side validation
    document.getElementById('availableQtyHidden').value = availableQty.toFixed(2);
    document.getElementById('wastageAmountHidden').value = wastageAmount.toFixed(2);
}

/**
 * Save extraction data
 */
function saveExtraction() {
    console.log('Saving extraction data...');
    
    // Get form data
    const formData = new FormData(document.getElementById('extractionForm'));
    
    // Send data to server
    fetch('../../../models/entry/extraction/fetch.php?action=saveExtraction', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            console.error('Server returned status:', response.status);
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Extraction save response:', data);
        
        if (data.status === 'success') {
            // Play sound effect if available
            const plopSound = document.getElementById('plopSound');
            if (plopSound) plopSound.play();
            
            // Reset displayed quantities to 0
            document.getElementById('availableQty').textContent = '0';
            document.getElementById('qty').textContent = '0';
            
            // Show success message with Toastify
            showToast('Extraction completed successfully!', 'success');
            
            // Reset form and reload jobs list with updated quantities
            document.getElementById('extractionForm').reset();
            loadJobs();
        } else {
            // Show error message with Toastify
            showToast(data.message || 'Failed to save extraction. Please try again.', 'error');
        }
    })
    .catch(error => {
        console.error('Error saving extraction:', error);
        showToast('Failed to save extraction. Please try again.', 'error');
    });
}