/**
 * Dashboard main JavaScript file
 * Handles core dashboard functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize current date
    updateCurrentDate();
    
    // Setup navigation - if navigation.js is not included, this provides fallback
    if (typeof navigateToSection !== 'function') {
        setupNavigation();
    }
    
    // Setup mobile menu - if navigation.js is not included, this provides fallback
    if (typeof setupMobileMenu === 'function') {
        setupMobileMenu();
    }
    
    // Setup logout functionality
    setupLogout();
});

/**
 * Update the current date display
 */
function updateCurrentDate() {
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
        const now = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        dateElement.textContent = now.toLocaleDateString('en-US', options);
    }
}

/**
 * Setup navigation buttons (fallback if navigation.js is not included)
 */
function setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            navButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get section to load
            const section = this.dataset.section;
            
            // Navigate to the section page
            navigateToSection(section);
        });
    });
}

/**
 * Navigate to section (fallback implementation if navigation.js is not included)
 */
function navigateToSection(section) {
    if (section) {
        // Set the base URL for the project
        const baseUrl = '/Azizabad/controllers/';
        
        // Define URL mapping for different sections
        const sectionUrls = {
            'home': 'dashboard/dashboard.php',
            'customer': 'setup/customersetup/index.php',
            'vendor': 'setup/vendorsetup/index.php',
            'sale': 'sale/index.php',
            'purchase': 'purchase/index.php',
            'salereturn': 'salereturn/index.php',
            'purchasereturn': 'purchasereturn/index.php',
            'bom': 'entry/bom/index.php',
            'bomlist': 'entry/bomList/index.php',
            'extraction': 'entry/extraction/index.php',
            'receivevoucher': 'voucher/receive/index.php',
            'paymentvoucher': 'voucher/payment/index.php',
            'expensevoucher': 'voucher/expense/index.php',
            'journalvoucher': 'voucher/journal/index.php',
            'setup': 'dashboard/setup.php',
            'reports': 'dashboard/reports.php',
            'hr': 'hr/index.php',
            'settings': 'settings/index.php'
        };
        
        // Navigate to the appropriate URL if defined
        if (sectionUrls[section]) {
            window.location.href = baseUrl + sectionUrls[section];
        } else {
            console.log(`Unknown section: ${section}`);
        }
    }
}

/**
 * Setup mobile menu functionality (fallback if navigation.js is not included)
 */
function setupMobileMenu() {
    const menuButton = document.querySelector('.mobile-menu-btn');
    const navLeft = document.querySelector('.nav-left');
    
    if (menuButton && navLeft) {
        menuButton.addEventListener('click', function() {
            // Toggle the expanded state
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            
            // Toggle the menu visibility
            navLeft.classList.toggle('show');
            
            // Update the icon
            const icon = this.querySelector('i');
            if (icon) {
                if (icon.classList.contains('fa-bars')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navLeft.contains(event.target) && !menuButton.contains(event.target)) {
                navLeft.classList.remove('show');
                menuButton.setAttribute('aria-expanded', 'false');
                
                const icon = menuButton.querySelector('i');
                if (icon && icon.classList.contains('fa-times')) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    }
}

/**
 * Setup logout functionality
 */
function setupLogout() {
    const logoutButton = document.getElementById('logout-btn');
    
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            // Here you would typically handle logout via AJAX
            // For demonstration, we'll just redirect to login page
            window.location.href = '/Azizabad/logout.php';
        });
    }
}

/**
 * Format currency values
 * @param {number} value - The value to format
 * @returns {string} - Formatted currency string
 */
function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    }).format(value);
}

/**
 * Format number values
 * @param {number} value - The value to format
 * @returns {string} - Formatted number string
 */
function formatNumber(value) {
    return new Intl.NumberFormat('en-US').format(value);
}

/**
 * AJAX helper function
 * @param {string} url - The URL to fetch
 * @param {Object} options - Fetch options
 * @returns {Promise} - Fetch promise
 */
async function fetchData(url, options = {}) {
    try {
        const response = await fetch(url, options);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        return null;
    }
}