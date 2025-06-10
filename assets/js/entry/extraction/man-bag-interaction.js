/**
 * Man-Bag Interaction JavaScript
 * Handles the animation when man approaches bag and extracts items
 */

// Add reference to our new CSS file
document.addEventListener('DOMContentLoaded', function() {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'man-bag-interaction.css';
  document.head.appendChild(link);
  
  // Include the extraction feedback script
  const feedbackScript = document.createElement('script');
  feedbackScript.src = 'extraction-feedback.js';
  document.head.appendChild(feedbackScript);
  
  setupExtractionAnimation();
  setupFormInteractions();
});

function setupExtractionAnimation() {
  const cssMan = document.querySelector('.css-man');
  const bag = document.getElementById('bag');
  const container = document.querySelector('.container');
  let previousQty = 50; // Initial quantity
  let isAnimating = false;
  
  // Create an extraction item element (hidden initially)
  const extractionItem = document.createElement('div');
  extractionItem.className = 'extraction-item';
  container.appendChild(extractionItem);
  
  // Listen for changes to the Total Qty value
  const qtyObserver = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList' && !isAnimating) {
        const currentQty = parseInt(document.getElementById('qty').textContent);
        
        // If quantity decreased, trigger extraction animation
        if (currentQty < previousQty) {
          performExtractionAnimation(previousQty - currentQty);
          previousQty = currentQty;
        }
      }
    });
  });
  
  // Start observing the qty display for changes
  qtyObserver.observe(document.getElementById('qty'), { 
    childList: true 
  });
  
  function performExtractionAnimation(quantityExtracted) {
    if (isAnimating) return;
    isAnimating = true;
    
    // Calculate positions for animation
    const bagRect = bag.getBoundingClientRect();
    const manRect = cssMan.getBoundingClientRect();
    
    // Update CSS variables for animation positioning
    document.documentElement.style.setProperty('--bag-position-x', `${bagRect.left - manRect.left}px`);
    document.documentElement.style.setProperty('--animation-duration', `${2 + (quantityExtracted * 0.2)}s`);
    
    // Start the extraction animation
    cssMan.classList.add('extracting');
    
    // Position the extraction item near the bag and the right hand
    // Adjusted to position properly relative to the right arm
    extractionItem.style.left = `${bagRect.left + (bagRect.width / 2) - 10}px`;
    extractionItem.style.top = `${bagRect.top + (bagRect.height / 3)}px`;
    
    // Animate the extraction item after a delay
    setTimeout(() => {
      extractionItem.classList.add('active');
    }, document.documentElement.style.getPropertyValue('--animation-duration').slice(0, -1) * 1000 * 0.5);
    
    // Reset animations when complete
    setTimeout(() => {
      cssMan.classList.remove('extracting');
      extractionItem.classList.remove('active');
      isAnimating = false;
    }, document.documentElement.style.getPropertyValue('--animation-duration').slice(0, -1) * 1000);
  }
}

// Updated function to handle form interactions and total quantity calculations
function setupFormInteractions() {
  const wastageInput = document.getElementById('wastage');
  const extractionQtyInput = document.getElementById('extractionQty');
  const totalQtyElement = document.getElementById('qty');
  const initialTotalQty = 50; // Initial total quantity
  let currentTotalQty = initialTotalQty;
  const plopSound = document.getElementById('plopSound');
  
  // Function to update the total quantity
  function updateTotalQty() {
    let wastagePercentage = parseFloat(wastageInput.value) || 0;
    let extractionQty = parseFloat(extractionQtyInput.value) || 0;
    
    // Validate wastage percentage (cannot exceed 100%)
    if (wastagePercentage > 100) {
      wastagePercentage = 100;
      wastageInput.value = 100;
      showValidationMessage(wastageInput, 'Wastage cannot exceed 100%');
    }
    
    // Apply wastage percentage directly to the total quantity
    const wastageAmount = Math.round((initialTotalQty * wastagePercentage) / 100);
    
    // Calculate max extraction allowed based on wastage
    const maxExtraction = initialTotalQty - wastageAmount;
    
    // Validate extraction quantity (cannot exceed available qty after wastage)
    if (extractionQty > maxExtraction) {
      extractionQty = maxExtraction;
      extractionQtyInput.value = maxExtraction;
      showValidationMessage(extractionQtyInput, `Extraction cannot exceed ${maxExtraction} KG`);
    }
    
    // Update the max attribute for the extraction input
    extractionQtyInput.max = maxExtraction;
    
    // Calculate the new total quantity: initial - extraction - wastage
    const newTotalQty = initialTotalQty - extractionQty - wastageAmount;
    
    // Ensure the total quantity doesn't go below 0
    currentTotalQty = Math.max(0, newTotalQty);
    
    // Update the displayed total quantity
    totalQtyElement.textContent = currentTotalQty;
    
    // Play sound effect if quantity changed
    if (currentTotalQty !== initialTotalQty && plopSound) {
      plopSound.currentTime = 0;
      plopSound.play().catch(e => console.log('Error playing sound:', e));
    }
  }
  
  // Function to show validation message
  function showValidationMessage(inputElement, message) {
    // Create validation message element if it doesn't exist
    let validationMsg = inputElement.nextElementSibling;
    if (!validationMsg || !validationMsg.classList.contains('validation-message')) {
      validationMsg = document.createElement('div');
      validationMsg.classList.add('validation-message');
      inputElement.parentNode.insertBefore(validationMsg, inputElement.nextSibling);
    }
    
    // Set message and show
    validationMsg.textContent = message;
    validationMsg.style.color = '#e53e3e';
    validationMsg.style.fontSize = '12px';
    validationMsg.style.marginTop = '2px';
    
    // Highlight input field
    inputElement.style.borderColor = '#e53e3e';
    
    // Hide message after 3 seconds
    setTimeout(() => {
      validationMsg.textContent = '';
      inputElement.style.borderColor = '';
    }, 3000);
  }
  
  // Add input event listeners with debounce to allow complete input
  let wastageTimeout;
  wastageInput.addEventListener('input', function() {
    clearTimeout(wastageTimeout);
    wastageTimeout = setTimeout(updateTotalQty, 300); // 300ms delay
  });
  
  let extractionTimeout;
  extractionQtyInput.addEventListener('input', function() {
    clearTimeout(extractionTimeout);
    extractionTimeout = setTimeout(updateTotalQty, 300); // 300ms delay
  });
  
  // Add change event listeners for when input loses focus or Enter is pressed
  wastageInput.addEventListener('change', function() {
    clearTimeout(wastageTimeout);
    updateTotalQty();
  });
  
  extractionQtyInput.addEventListener('change', function() {
    clearTimeout(extractionTimeout);
    updateTotalQty();
  });
  
  // Set initial limits
  extractionQtyInput.max = initialTotalQty;
  
  // Initialize the form
  updateTotalQty();
}

// Modified Extract button functionality with success/error feedback
document.addEventListener('DOMContentLoaded', function() {
  // Set the date field to today's date by default
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const formattedDate = `${yyyy}-${mm}-${dd}`;
  document.getElementById('extractionDate').value = formattedDate;

  // Initialize Select2 for searchable dropdown
  $('.searchable-select').select2({
    placeholder: "Select a Job No",
    allowClear: true
  });

  const cssMan = document.querySelector('.css-man');
  const extractionItem = document.querySelector('.extraction-item');
  const qtyDisplay = document.getElementById('qty');
  const plopSound = document.getElementById('plopSound');
  let totalQty = 50; // Initial value

  // Update quantity display
  function updateQtyDisplay() {
    qtyDisplay.textContent = totalQty;
  }

  // Add event listener for the Extract button
  const extractButton = document.getElementById('extractButton');
  extractButton.addEventListener('click', function(e) {
    // Prevent default to handle extraction ourselves
    e.preventDefault();
    
    const extractionQty = parseInt(document.getElementById('extractionQty').value);
    const wastagePercentage = parseFloat(document.getElementById('wastage').value) || 0;
    const wastageAmount = Math.round((50 * wastagePercentage) / 100); // Based on initial 50 KG
    const jobNo = document.getElementById('jobNo').value;
    
    // Validation checks - will be shown by extraction-feedback.js
    if (!jobNo || isNaN(extractionQty) || extractionQty <= 0 || 
        extractionQty > totalQty || wastagePercentage > 100 || 
        extractionQty + wastageAmount > 50) {
      // Let extraction-feedback.js handle the error message and animation
      return;
    }
    
    // Perform extraction
    totalQty -= extractionQty;
    updateQtyDisplay();
    
    // Trigger the man animation
    cssMan.classList.add('extracting');
    
    // Reset animation when complete
    setTimeout(() => {
      cssMan.classList.remove('extracting');
      
      // Show success sparkles around the bag
      if (typeof showSuccessAtElement === 'function') {
        const bag = document.getElementById('bag');
        if (bag) {
          showSuccessAtElement(bag);
        }
      }
      
      // Create simulation of form submission after animation completes
      simulateSuccessfulExtraction(extractionQty, jobNo);
      
    }, 2000);
  });
  
  // Function to simulate a successful extraction (placeholder for actual server response)
  function simulateSuccessfulExtraction(quantity, jobNo) {
    // Create success feedback elements
    const successFeedback = document.createElement('div');
    successFeedback.className = 'extraction-confirmation';
    successFeedback.innerHTML = `
      <div class="confirmation-details">
        <h3>Extraction Confirmed</h3>
        <p><strong>Job No:</strong> ${jobNo}</p>
        <p><strong>Quantity:</strong> ${quantity} KG</p>
        <p><strong>Date:</strong> ${document.getElementById('extractionDate').value}</p>
        <p><strong>Time:</strong> ${new Date().toLocaleTimeString()}</p>
      </div>
    `;
    
    // Style the confirmation box
    Object.assign(successFeedback.style, {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%) scale(0.9)',
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
      zIndex: '1000',
      opacity: '0',
      transition: 'all 0.3s ease'
    });
    
    // Add to page
    document.body.appendChild(successFeedback);
    
    // Fade in
    setTimeout(() => {
      successFeedback.style.opacity = '1';
      successFeedback.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 100);
    
    // Add a "Done" button
    const doneButton = document.createElement('button');
    doneButton.textContent = 'Done';
    doneButton.className = 'action-button extract-button';
    Object.assign(doneButton.style, {
      marginTop: '15px',
      width: '100%'
    });
    
    // Add button click handler
    doneButton.addEventListener('click', function() {
      successFeedback.style.opacity = '0';
      successFeedback.style.transform = 'translate(-50%, -50%) scale(0.9)';
      
      // Remove after fade out
      setTimeout(() => {
        successFeedback.remove();
      }, 300);
    });
    
    successFeedback.querySelector('.confirmation-details').appendChild(doneButton);
  }
});