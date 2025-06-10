/**
 * Man-Machine Interaction JavaScript
 * Handles animations when the man approaches the machine, interacts with it,
 * and receives items when the Total Qty changes
 */

document.addEventListener('DOMContentLoaded', function() {
  // Link the CSS file for the man-machine interaction
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'man-machine-interaction.css';
  document.head.appendChild(link);
  
  setupMachineInteractionAnimation();
  observeQuantityChanges();
  adjustResponsivePositioning();
  
  // Handle window resize events to recalculate positions
  window.addEventListener('resize', debounce(adjustResponsivePositioning, 250));
});

/**
 * Debounce function to limit how often a function is called
 */
function debounce(func, wait) {
  let timeout;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(function() {
      func.apply(context, args);
    }, wait);
  };
}

/**
 * Adjust animation positioning based on current screen size
 */
function adjustResponsivePositioning() {
  const cssMan = document.querySelector('.css-man');
  const machine = document.querySelector('.factory-machine');
  const container = document.querySelector('.container');
  
  if (!cssMan || !machine || !container) return;
  
  const machineRect = machine.getBoundingClientRect();
  const manRect = cssMan.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  
  // Check if we're in mobile layout (flexbox column)
  const isMobileLayout = window.getComputedStyle(container).flexDirection === 'column';
  
  if (isMobileLayout) {
    // On mobile, man walks up to the machine which is centered
    const machineCenter = machineRect.left + (machineRect.width / 2);
    const manCenter = manRect.left + (manRect.width / 2);
    const walkDistance = machineCenter - manCenter;
    
    // Update the CSS variable
    document.documentElement.style.setProperty('--machine-position-x', `${walkDistance}px`);
  } else {
    // On desktop, use the normal layout positions
    document.documentElement.style.setProperty('--machine-position-x', `${machineRect.left - manRect.left + 30}px`);
  }
  
  // Update the button position variables
  const buttonMain = machine.querySelector('.button-main');
  if (buttonMain) {
    const buttonRect = buttonMain.getBoundingClientRect();
    document.documentElement.style.setProperty('--machine-button-position-x', `${buttonRect.left - manRect.left}px`);
    document.documentElement.style.setProperty('--machine-button-position-y', `${buttonRect.top - manRect.top}px`);
  }
}

/**
 * Set up the main interaction animation between man and machine
 */
function setupMachineInteractionAnimation() {
  const cssMan = document.querySelector('.css-man');
  const machine = document.querySelector('.factory-machine');
  const container = document.querySelector('.container');
  
  // Create machine produced item element (hidden initially)
  const machineProducedItem = document.createElement('div');
  machineProducedItem.className = 'machine-produced-item';
  container.appendChild(machineProducedItem);
  
  // Sound effects for machine interaction
  const buttonClickSound = document.createElement('audio');
  buttonClickSound.src = 'button-click.mp3'; // Create this sound or use an existing one
  buttonClickSound.volume = 0.5;
  document.body.appendChild(buttonClickSound);
  
  const machineHumSound = document.createElement('audio');
  machineHumSound.src = 'machine-hum.mp3'; // Create this sound or use an existing one
  machineHumSound.volume = 0.3;
  document.body.appendChild(machineHumSound);
  
  // Function to trigger the machine interaction animation
  window.triggerMachineInteraction = function(quantityChange) {
    // Don't trigger if animation is already in progress
    if (cssMan.classList.contains('machine-interaction')) return;
    
    // Update positions before starting animation
    adjustResponsivePositioning();
    
    // Calculate positions for animation
    const machineRect = machine.getBoundingClientRect();
    const manRect = cssMan.getBoundingClientRect();
    const productRect = machine.querySelector('.product-item').getBoundingClientRect();
    
    // Position the machine produced item
    machineProducedItem.style.left = `${productRect.left}px`;
    machineProducedItem.style.top = `${productRect.top}px`;
    
    // Update animation duration based on quantity (longer for bigger changes)
    document.documentElement.style.setProperty('--animation-duration', `${4 + (quantityChange * 0.2)}s`);
    
    // Start the animations
    cssMan.classList.add('machine-interaction');
    
    // Button click sound at the right time
    setTimeout(() => {
      buttonClickSound.currentTime = 0;
      buttonClickSound.play().catch(e => console.log('Error playing sound:', e));
      machine.classList.add('being-operated');
    }, 2000); // Time when the man reaches the button
    
    // Machine operation sound
    setTimeout(() => {
      machineHumSound.currentTime = 0;
      machineHumSound.play().catch(e => console.log('Error playing sound:', e));
    }, 2500);
    
    // Activate the produced item
    setTimeout(() => {
      machineProducedItem.classList.add('active');
    }, 3000);
    
    // Reset animations when complete
    const animationDuration = parseFloat(getComputedStyle(document.documentElement)
      .getPropertyValue('--animation-duration').trim().replace('s', '')) * 1000;
    
    setTimeout(() => {
      cssMan.classList.remove('machine-interaction');
      machine.classList.remove('being-operated');
      machineProducedItem.classList.remove('active');
    }, animationDuration);
  };
}

/**
 * Observe changes to the Total Qty display and trigger animations
 */
function observeQuantityChanges() {
  const qtyDisplay = document.getElementById('qty');
  let previousQty = parseInt(qtyDisplay.textContent) || 50;
  let isAnimating = false;
  
  // Create MutationObserver to watch for changes to the qty value
  const qtyObserver = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList' && !isAnimating) {
        const currentQty = parseInt(qtyDisplay.textContent) || 0;
        
        // If quantity changed, trigger appropriate animation
        if (currentQty !== previousQty) {
          isAnimating = true;
          
          // Calculate the change amount
          const quantityChange = Math.abs(currentQty - previousQty);
          
          // Trigger machine interaction animation
          if (currentQty < previousQty) {
            triggerMachineInteraction(quantityChange);
            
            // Update the previous quantity after animation completes
            const animationDuration = parseFloat(getComputedStyle(document.documentElement)
              .getPropertyValue('--animation-duration').trim().replace('s', '')) * 1000;
            
            setTimeout(() => {
              previousQty = currentQty;
              isAnimating = false;
            }, animationDuration);
          } else {
            // For increases in quantity, no animation needed
            previousQty = currentQty;
            isAnimating = false;
          }
        }
      }
    });
  });
  
  // Start observing the qty display for changes
  qtyObserver.observe(qtyDisplay, { 
    childList: true,
    characterData: true,
    subtree: true
  });
  
  // Also observe form input changes to directly trigger the animation
  const extractionQtyInput = document.getElementById('extractionQty');
  const wastageInput = document.getElementById('wastage');
  const extractButton = document.getElementById('extractButton');
  
  // When the Extract button is clicked
  if (extractButton) {
    extractButton.addEventListener('click', function() {
      const extractionQty = parseInt(extractionQtyInput.value) || 0;
      const wastagePercentage = parseFloat(wastageInput.value) || 0;
      
      if (extractionQty > 0 && !isAnimating) {
        // Don't need to manually update qty here, the observer will catch the change
        triggerMachineInteraction(extractionQty);
        isAnimating = true;
        
        setTimeout(() => {
          isAnimating = false;
        }, 5000);
      }
    });
  }
}

// Add interactive hover effects for the machine
document.addEventListener('DOMContentLoaded', function() {
  const machine = document.querySelector('.factory-machine');
  const buttons = machine.querySelectorAll('.button');
  
  // Add hover effect for buttons
  buttons.forEach(button => {
    button.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.1)';
      this.style.boxShadow = '0 0 5px rgba(255, 255, 255, 0.5)';
    });
    
    button.addEventListener('mouseleave', function() {
      this.style.transform = '';
      this.style.boxShadow = '';
    });
  });
});