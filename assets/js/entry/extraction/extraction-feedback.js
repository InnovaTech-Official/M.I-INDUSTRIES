/**
 * Extraction Feedback System
 * Handles animations for extraction success/error messages and visual effects
 */

document.addEventListener('DOMContentLoaded', function() {
  // Add CSS link for the feedback animations
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'extraction-feedback.css';
  document.head.appendChild(link);
  
  // Create container for notifications if it doesn't exist
  let notificationContainer = document.querySelector('.notification-container');
  if (!notificationContainer) {
    notificationContainer = document.createElement('div');
    notificationContainer.className = 'notification-container';
    document.body.appendChild(notificationContainer);
  }
  
  // Initialize extraction success effects container
  const successEffects = document.createElement('div');
  successEffects.className = 'extraction-success-effect';
  document.body.appendChild(successEffects);
  
  // Set up the extract button event handler
  setupExtractionFeedback();
});

/**
 * Set up the extraction feedback animations
 */
function setupExtractionFeedback() {
  const extractButton = document.getElementById('extractButton');
  if (!extractButton) return;
  
  extractButton.addEventListener('click', function(e) {
    // Don't prevent default here - allow the normal form submission
    // e.preventDefault();
    
    // Get form values for validation
    const extractionQty = parseFloat(document.getElementById('extractionQty').value) || 0;
    const wastagePercentage = parseFloat(document.getElementById('wastage').value) || 0;
    const jobNo = document.getElementById('jobNo').value;
    
    // Basic validation checks
    if (!jobNo) {
      showNotification('error', 'Missing Information', 'Please select a Job No.');
      showErrorAnimation(extractButton);
      return;
    }
    
    if (extractionQty <= 0) {
      showNotification('error', 'Invalid Quantity', 'Please enter a valid extraction quantity.');
      showErrorAnimation(extractButton);
      return;
    }
    
    if (wastagePercentage > 100) {
      showNotification('error', 'Invalid Wastage', 'Wastage percentage cannot exceed 100%.');
      showErrorAnimation(extractButton);
      return;
    }
    
    const currentTotal = parseInt(document.getElementById('qty').textContent) || 0;
    if (extractionQty > currentTotal) {
      showNotification('error', 'Extraction Limit Exceeded', 'Extraction quantity cannot exceed current total.');
      showErrorAnimation(extractButton);
      return;
    }
    
    // If all validations pass, show success notification and animation
    showSuccessAnimation(extractButton);
    
    // Show notification after a slight delay to give time for the animation to start
    setTimeout(() => {
      showNotification('success', 'Extraction Successful', 
        `${extractionQty} KG extracted from Job ${jobNo}.`);
    }, 300);
  });
}

/**
 * Show notification message
 * @param {string} type - 'success', 'error', or 'warning'
 * @param {string} title - Notification title
 * @param {string} message - Notification message content
 */
function showNotification(type, title, message) {
  const notificationContainer = document.querySelector('.notification-container');
  if (!notificationContainer) return;
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  
  // Create notification content
  notification.innerHTML = `
    <div class="notification-icon"></div>
    <div class="notification-content">
      <div class="notification-title">${title}</div>
      <div class="notification-message">${message}</div>
    </div>
    <button class="notification-close">&times;</button>
    <div class="notification-progress"></div>
  `;
  
  // Add close button functionality
  const closeButton = notification.querySelector('.notification-close');
  closeButton.addEventListener('click', function() {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      notification.remove();
    }, 300);
  });
  
  // Add to container
  notificationContainer.appendChild(notification);
  
  // Remove after animation completes
  setTimeout(() => {
    notification.remove();
  }, 5500); // 5s display + 0.5s fadeout
}

/**
 * Show success animation effects
 * @param {HTMLElement} button - The extract button element
 */
function showSuccessAnimation(button) {
  const successEffects = document.querySelector('.extraction-success-effect');
  if (!successEffects) return;
  
  // Position the success effects container relative to the button
  const buttonRect = button.getBoundingClientRect();
  const machineEl = document.querySelector('.factory-machine');
  
  // Position success effects container
  successEffects.style.left = buttonRect.left + 'px';
  successEffects.style.top = buttonRect.top + 'px';
  successEffects.style.width = buttonRect.width + 'px';
  successEffects.style.height = buttonRect.height + 'px';
  successEffects.style.opacity = '1';
  
  // Create pulse effect
  const pulse = document.createElement('div');
  pulse.className = 'pulse';
  successEffects.appendChild(pulse);
  
  // Create checkmark circle
  const checkmarkCircle = document.createElement('div');
  checkmarkCircle.className = 'checkmark-circle';
  successEffects.appendChild(checkmarkCircle);
  
  // Create checkmark
  const checkmark = document.createElement('div');
  checkmark.className = 'checkmark';
  successEffects.appendChild(checkmark);
  
  // Create sparkles
  for (let i = 0; i < 12; i++) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    
    // Position sparkles around the center of the button
    sparkle.style.left = '50%';
    sparkle.style.top = '50%';
    
    // Calculate random direction vectors for each sparkle
    const angle = (i / 12) * Math.PI * 2;
    sparkle.style.setProperty('--x', Math.cos(angle));
    sparkle.style.setProperty('--y', Math.sin(angle));
    
    successEffects.appendChild(sparkle);
  }
  
  // Clean up after animation completes
  setTimeout(() => {
    successEffects.innerHTML = '';
    successEffects.style.opacity = '0';
  }, 1500);
  
  // Also apply success highlight to the button
  button.style.backgroundColor = '#38a169';
  button.style.boxShadow = '0 0 10px rgba(56, 161, 105, 0.5)';
  
  // Reset button style after animation
  setTimeout(() => {
    button.style.backgroundColor = '';
    button.style.boxShadow = '';
  }, 1000);
  
  // Also show success animation around the machine if it exists
  if (machineEl) {
    const machineRect = machineEl.getBoundingClientRect();
    
    // Create separate success effect for machine
    const machineSuccess = document.createElement('div');
    machineSuccess.className = 'extraction-success-effect';
    machineSuccess.style.left = machineRect.left + 'px';
    machineSuccess.style.top = machineRect.top + 'px';
    machineSuccess.style.width = machineRect.width + 'px';
    machineSuccess.style.height = machineRect.height + 'px';
    machineSuccess.style.opacity = '1';
    document.body.appendChild(machineSuccess);
    
    // Create pulse effect around machine
    const machinePulse = document.createElement('div');
    machinePulse.className = 'pulse';
    machineSuccess.appendChild(machinePulse);
    
    // Clean up machine animation
    setTimeout(() => {
      machineSuccess.remove();
    }, 1500);
  }
  
  // Play success sound
  playSound('success');
  
  // Show success sparkles specifically around the bag element
  const bagElement = document.querySelector('.bag'); // Adjust selector as needed
  showSuccessAtElement(bagElement);
}

/**
 * Show error animation effects
 * @param {HTMLElement} button - The extract button element
 */
function showErrorAnimation(button) {
  // Add shake animation to button
  button.classList.add('error-shake');
  
  // Position error animations
  const buttonRect = button.getBoundingClientRect();
  
  // Create error container
  const errorContainer = document.createElement('div');
  errorContainer.className = 'extraction-success-effect'; // Reuse the same container class
  errorContainer.style.left = buttonRect.left + 'px';
  errorContainer.style.top = buttonRect.top + 'px';
  errorContainer.style.width = buttonRect.width + 'px';
  errorContainer.style.height = buttonRect.height + 'px';
  errorContainer.style.opacity = '1';
  document.body.appendChild(errorContainer);
  
  // Create error circle
  const errorCircle = document.createElement('div');
  errorCircle.className = 'error-circle';
  errorContainer.appendChild(errorCircle);
  
  // Create X mark
  const errorX = document.createElement('div');
  errorX.className = 'error-x';
  errorContainer.appendChild(errorX);
  
  // Create error particles
  for (let i = 0; i < 8; i++) {
    const particle = document.createElement('div');
    particle.className = 'error-particle';
    
    // Position particles around the center of the button
    particle.style.left = '50%';
    particle.style.top = '50%';
    
    // Calculate random direction vectors for each particle
    const angle = (i / 8) * Math.PI * 2;
    particle.style.setProperty('--x', Math.cos(angle));
    particle.style.setProperty('--y', Math.sin(angle));
    
    errorContainer.appendChild(particle);
  }
  
  // Apply error highlight to the button
  button.style.backgroundColor = '#e53e3e';
  button.style.boxShadow = '0 0 10px rgba(229, 62, 62, 0.5)';
  
  // Reset button class and style after animation
  setTimeout(() => {
    button.classList.remove('error-shake');
    button.style.backgroundColor = '';
    button.style.boxShadow = '';
    errorContainer.remove();
  }, 1000);
  
  // Play error sound
  playSound('error');
}

/**
 * Play sound effect
 * @param {string} type - 'success' or 'error'
 */
function playSound(type) {
  let sound;
  
  // Try to reuse existing audio elements
  if (type === 'success') {
    sound = document.getElementById('successSound');
    if (!sound) {
      sound = document.createElement('audio');
      sound.id = 'successSound';
      sound.src = 'success-sound.mp3'; // Ensure this file exists
      sound.volume = 0.5;
      document.body.appendChild(sound);
    }
  } else if (type === 'error') {
    sound = document.getElementById('errorSound');
    if (!sound) {
      sound = document.createElement('audio');
      sound.id = 'errorSound';
      sound.src = 'error-sound.mp3'; // Ensure this file exists
      sound.volume = 0.5;
      document.body.appendChild(sound);
    }
  }
  
  if (sound) {
    sound.currentTime = 0;
    sound.play().catch(e => console.log('Error playing sound:', e));
  }
}

/**
 * Utility function to show success sparkles around any element
 * @param {HTMLElement} element - The element to show sparkles around
 */
function showSuccessAtElement(element) {
  if (!element) return;
  
  // Get element position
  const rect = element.getBoundingClientRect();
  
  // Create container for sparkles
  const sparkleContainer = document.createElement('div');
  sparkleContainer.className = 'extraction-success-effect';
  sparkleContainer.style.position = 'absolute';
  sparkleContainer.style.left = rect.left + 'px';
  sparkleContainer.style.top = rect.top + 'px';
  sparkleContainer.style.width = rect.width + 'px';
  sparkleContainer.style.height = rect.height + 'px';
  sparkleContainer.style.pointerEvents = 'none';
  sparkleContainer.style.zIndex = '999';
  sparkleContainer.style.opacity = '1';
  document.body.appendChild(sparkleContainer);
  
  // Create shine effect
  const shine = document.createElement('div');
  shine.style.position = 'absolute';
  shine.style.width = '100%';
  shine.style.height = '100%';
  shine.style.borderRadius = '50%';
  shine.style.background = 'radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, transparent 70%)';
  shine.style.opacity = '0';
  shine.style.animation = 'bagShine 1s ease-out forwards';
  sparkleContainer.appendChild(shine);
  
  // Add keyframes for the shine animation if they don't exist
  if (!document.getElementById('bagShineKeyframes')) {
    const style = document.createElement('style');
    style.id = 'bagShineKeyframes';
    style.textContent = `
      @keyframes bagShine {
        0% { opacity: 0; transform: scale(0.8); }
        40% { opacity: 0.8; transform: scale(1.1); }
        100% { opacity: 0; transform: scale(1.2); }
      }
      
      @keyframes bagSparkle {
        0% { transform: translate(var(--startX), var(--startY)) scale(0); opacity: 0; }
        50% { transform: translate(var(--endX), var(--endY)) scale(1); opacity: 1; }
        100% { transform: translate(var(--endX), var(--endY)) scale(0); opacity: 0; }
      }
      
      @keyframes bagWobble {
        0% { transform: rotate(0deg) scale(1); }
        25% { transform: rotate(-2deg) scale(1.05); }
        50% { transform: rotate(0deg) scale(1.1); }
        75% { transform: rotate(2deg) scale(1.05); }
        100% { transform: rotate(0deg) scale(1); }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Add wobble animation to the bag itself
  element.style.animation = 'bagWobble 0.8s ease-in-out';
  element.style.transformOrigin = 'center bottom';
  
  // Reset bag animation after it completes
  setTimeout(() => {
    element.style.animation = '';
  }, 800);
  
  // Create sparkles
  for (let i = 0; i < 20; i++) {
    const sparkle = document.createElement('div');
    sparkle.className = 'success-sparkle';
    sparkle.style.position = 'absolute';
    sparkle.style.width = '5px';
    sparkle.style.height = '5px';
    sparkle.style.backgroundColor = i % 2 === 0 ? '#48bb78' : '#fbec5d';
    sparkle.style.borderRadius = '50%';
    
    // Set random start and end points
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const angle = Math.random() * Math.PI * 2;
    const startDistance = (rect.width + rect.height) / 10 * Math.random();
    const endDistance = (rect.width + rect.height) / 2 * (0.5 + Math.random() * 0.5);
    
    const startX = centerX + Math.cos(angle) * startDistance;
    const startY = centerY + Math.sin(angle) * startDistance;
    const endX = centerX + Math.cos(angle) * endDistance;
    const endY = centerY + Math.sin(angle) * endDistance;
    
    sparkle.style.left = centerX + 'px';
    sparkle.style.top = centerY + 'px';
    sparkle.style.setProperty('--startX', `${startX - centerX}px`);
    sparkle.style.setProperty('--startY', `${startY - centerY}px`);
    sparkle.style.setProperty('--endX', `${endX - centerX}px`);
    sparkle.style.setProperty('--endY', `${endY - centerY}px`);
    
    // Add animation with random delay
    sparkle.style.animation = `bagSparkle ${0.5 + Math.random() * 0.5}s ease-out forwards ${Math.random() * 0.3}s`;
    
    sparkleContainer.appendChild(sparkle);
  }
  
  // Clean up after animation completes
  setTimeout(() => {
    sparkleContainer.remove();
  }, 1500);
}

/**
 * Creates particles falling from an element (like the bag)
 * @param {HTMLElement} element - The element from which particles fall
 */
function createFallingParticles(element) {
  if (!element) return;
  
  // No particles will be created - function is empty but maintained for compatibility
  
  // Create a container but don't add any visual elements to it
  const particleContainer = document.createElement('div');
  particleContainer.style.position = 'absolute';
  particleContainer.style.left = '0';
  particleContainer.style.top = '0';
  particleContainer.style.width = '100%';
  particleContainer.style.height = '100%';
  particleContainer.style.pointerEvents = 'none';
  particleContainer.style.zIndex = '1000';
  document.body.appendChild(particleContainer);
  
  // Clean up after a short time
  setTimeout(() => {
    particleContainer.remove();
  }, 2000);
}