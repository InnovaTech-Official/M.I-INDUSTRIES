/**
 * Navbar Navigation Functionality
 * This file contains common navigation functionality used across the application
 */

// Check if jQuery is available and use it, otherwise fallback to vanilla JS
if (typeof jQuery !== 'undefined') {
    $(document).ready(function () {
        // Navbar button click handler
        $('.nav-btn').on('click', function () {
            const section = $(this).data('section');
            navigateTo(section);
            
            // Remove active class from all buttons
            $('.nav-btn').removeClass('active');
            
            // Add active class to clicked button
            $(this).addClass('active');
        });

        // Mobile menu toggle
        $('.mobile-menu-btn').on('click', function () {
            $('.nav-left').toggleClass('show');
            const expanded = $(this).attr('aria-expanded') === 'true' || false;
            $(this).attr('aria-expanded', !expanded);
        });

        // Logout button handler
        $('#logout-btn').on('click', function () {
            window.location.href = '/Azizabad/logout.php';
        });
        
        // Highlight current page
        highlightCurrentPage();
    });
} else {
    // Vanilla JS implementation
    document.addEventListener('DOMContentLoaded', function() {
        // Get all navigation buttons
        const navButtons = document.querySelectorAll('.nav-btn');
        
        // Add click event listener to each button
        navButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                navButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Get the section name from data attribute
                const section = this.getAttribute('data-section');
                
                // Navigate to the corresponding page based on section
                navigateToSection(section);
            });
        });
        
        // Mobile menu toggle
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', function() {
                const navLeft = document.querySelector('.nav-left');
                navLeft.classList.toggle('show');
                
                const expanded = this.getAttribute('aria-expanded') === 'true' || false;
                this.setAttribute('aria-expanded', !expanded);
            });
        }
        
        // Highlight the current active button based on the current page
        highlightCurrentPage();
        
        // Handle logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function() {
                window.location.href = '/Azizabad/logout.php';
            });
        }
    });
}

/**
 * Function to handle navigation between different sections (jQuery version)
 * @param {string} section - The section identifier to navigate to
 */
function navigateTo(section) {
    // Handle navigation based on section
    switch (section) {
        case 'home':
            window.location.href = '/controllers/dashboard/dashboard.php';
            break;
        case 'setup':
            window.location.href = '/controllers/dashboard/setup.php';
            break;
        case 'reports':
            window.location.href = '/controllers/dashboard/reports.php';
            break;
        case 'customer':
            window.location.href = '/controllers/setup/customersetup/index.php';
            break;
        case 'vendor':
            window.location.href = '/controllers/setup/vendorsetup/index.php';
            break;
        case 'sale':
            window.location.href = '/controllers/sale/index.php';
            break;
        case 'purchase':
            window.location.href = '/controllers/purchase/index.php';
            break;
        case 'salereturn':
            window.location.href = '/controllers/salereturn/index.php';
            break;
        case 'purchasereturn':
            window.location.href = '/controllers/purchasereturn/index.php';
            break;
        case 'bom':
            window.location.href = '/controllers/entry/bom/index.php';
            break;
        case 'bomlist':
            window.location.href = '/controllers/entry/bomList/index.php';
            break;
        case 'extraction':
            window.location.href = '/controllers/entry/extraction/index.php';
            break;
        case 'receivevoucher':
            window.location.href = '/controllers/voucher/receive/index.php';
            break;
        case 'paymentvoucher':
            window.location.href = '/controllers/voucher/payment/index.php';
            break;
        case 'expensevoucher':
            window.location.href = '/controllers/voucher/expense/index.php';
            break;
        case 'journalvoucher':
            window.location.href = '/controllers/voucher/journal/index.php';
            break;
        case 'hr':
            window.location.href = '/controllers/hr/index.php';
            break;
        case 'settings':
            window.location.href = '/controllers/settings/index.php';
            break;
        default:
            console.log('Unknown section:', section);
    }
}

/**
 * Function to navigate to different sections (Vanilla JS version)
 * @param {string} section - The section identifier to navigate to
 */
function navigateToSection(section) {
    // Use the same paths as the jQuery version for consistency
    navigateTo(section);
}

/**
 * Function to highlight the current page in the navigation
 */
function highlightCurrentPage() {
    // Get current page path
    const currentPath = window.location.pathname;
    
    if (typeof jQuery !== 'undefined') {
        // jQuery version
        $('.nav-btn').each(function() {
            const section = $(this).data('section');
            if (currentPath.includes(`/${section}/`) || 
                (section === 'home' && currentPath.includes('/dashboard/'))) {
                $(this).addClass('active');
            }
        });
    } else {
        // Vanilla JS version
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(button => {
            const section = button.getAttribute('data-section');
            if (currentPath.includes(`/${section}/`) || 
                (section === 'home' && currentPath.includes('/dashboard/'))) {
                button.classList.add('active');
            }
        });
    }
}