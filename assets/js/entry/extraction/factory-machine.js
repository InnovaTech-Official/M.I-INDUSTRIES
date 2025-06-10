// Add this to your existing JavaScript file or create a new one

document.addEventListener('DOMContentLoaded', function() {
  // Link the CSS file for the factory machine
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = 'factory-machine.css';
  document.head.appendChild(link);
  
  // Factory machine functionality
  const machineEl = document.querySelector('.factory-machine');
  const productItem = document.querySelector('.product-item');
  const extractionItem = document.querySelector('.extraction-item');
  const lightGreen = document.querySelector('.light-green');
  const lightRed = document.querySelector('.light-red');
  const buttonMain = document.querySelector('.button-main');
  
  // When an item is selected from the form (simulate factory production)
  function activateMachine() {
    // Animate machine activity
    lightGreen.style.animation = 'none';
    setTimeout(() => {
      lightGreen.style.animation = 'pulse 2s infinite';
    }, 10);
    
    // Red light blinks 3 times
    let blinkCount = 0;
    const blinkInterval = setInterval(() => {
      lightRed.style.opacity = lightRed.style.opacity === '1' ? '0.3' : '1';
      blinkCount++;
      if (blinkCount >= 6) {
        clearInterval(blinkInterval);
        lightRed.style.opacity = '0.3';
      }
    }, 300);
    
    // Produce item animation
    setTimeout(() => {
      productItem.classList.add('active');
      
      // After production animation completes
      setTimeout(() => {
        productItem.classList.remove('active');
        extractItem();
      }, 2000);
    }, 1500);
  }
  
  // Simulate item extraction from machine to form area
  function extractItem() {
    extractionItem.style.width = '20px';
    extractionItem.style.height = '15px';
    extractionItem.style.backgroundColor = '#C53030';
    extractionItem.style.position = 'absolute';
    extractionItem.style.right = '-25px';
    extractionItem.style.bottom = '25px';
    extractionItem.style.opacity = '1';
    extractionItem.style.borderRadius = '2px';
    extractionItem.style.transition = 'all 1s ease-in-out';
    
    // Animate movement to form location
    setTimeout(() => {
      extractionItem.style.right = '150px';
      extractionItem.style.bottom = '100px';
      extractionItem.style.transform = 'scale(2)';
      
      // Fade out at destination
      setTimeout(() => {
        extractionItem.style.opacity = '0';
        
        // Reset for next use
        setTimeout(() => {
          extractionItem.style.right = '-25px';
          extractionItem.style.bottom = '25px';
          extractionItem.style.transform = 'scale(1)';
        }, 500);
      }, 1000);
    }, 100);
  }
  
  // Add click event to machine button
  buttonMain.addEventListener('click', activateMachine);
  
  // For demonstration, you might want to activate machine when form is submitted
  // Replace this with your actual form submission logic
  const form = document.querySelector('form');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      activateMachine();
      // Continue with your form submission logic
      setTimeout(() => {
        form.submit();
      }, 3500);
    });
  }
});