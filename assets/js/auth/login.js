// Toggle password visibility
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');

togglePassword.addEventListener('click', () => {
  const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
  passwordInput.setAttribute('type', type);

  // Change icon fill color or shape if you want, simple toggle here:
  togglePassword.style.fill = type === 'password' ? '#6b7280' : 'var(--primary)';
});

// Modal functionality
const resetLink = document.getElementById('resetLink');
const modalOverlay = document.getElementById('modalOverlay');
const closeModalBtn = document.getElementById('closeModalBtn');

resetLink.addEventListener('click', () => {
  modalOverlay.classList.add('active');
});

closeModalBtn.addEventListener('click', () => {
  modalOverlay.classList.remove('active');
});

// Close modal if clicking outside the modal content
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) {
    modalOverlay.classList.remove('active');
  }
});

// Handle password reset submission
function handleReset(e) {
  e.preventDefault();
  const email = document.getElementById('resetEmail').value.trim();
  if (email) {
    alert(`Password reset instructions sent to ${email}`);
    modalOverlay.classList.remove('active');
    document.getElementById('resetForm').reset();
  }
}

// Handle login form submission
document.addEventListener('DOMContentLoaded', function () {
  const loginForm = document.getElementById('loginForm');
  const errorMessage = document.getElementById('errorMessage');
  const debugInfo = document.getElementById('debugInfo');

  // Check for session error message
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('error')) {
    errorMessage.textContent = decodeURIComponent(urlParams.get('error'));
    errorMessage.style.display = 'block';
  }

  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Clear previous error messages
    errorMessage.style.display = 'none';
    debugInfo.style.display = 'none';

    const formData = new FormData(loginForm);
    formData.append('ajax', 'true');

    // Add debug parameter if needed (uncomment if debugging required)
    // formData.append('debug', 'true');

    fetch('../../controllers/auth/login.php', {
      method: 'POST',
      body: formData
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (data.success) {
          // Redirect on successful login
          window.location.href = data.redirect;
        } else {
          // Display error message
          errorMessage.textContent = data.error || 'Login failed. Please try again.';
          errorMessage.style.display = 'block';

          // Display debug information if available
          if (data.debug) {
            debugInfo.textContent = JSON.stringify(data.debug, null, 2);
            debugInfo.style.display = 'block';
          }
        }
      })
      .catch(error => {
        errorMessage.textContent = 'An error occurred. Please try again.';
        errorMessage.style.display = 'block';
        console.error('Login error:', error);
      });
  });
});