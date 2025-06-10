<?php
/**
 * Dashboard Controller
 * 
 * Handles all dashboard related functionality
 */

// Start session if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Check if user is logged in
function checkAuth() {
    if (!isset($_SESSION['user_id'])) {
        // Redirect to login page if not logged in
        header('Location: ../auth/login.php');
        exit;
    }
}

// Get user information
function getUserInfo() {
    // This would typically fetch from a database
    // Placeholder for demonstration
    if (isset($_SESSION['user_id'])) {
        return [
            'name' => $_SESSION['username'] ?? 'Admin',
            'role' => $_SESSION['role'] ?? 'Administrator'
        ];
    }
    return null;
}

// Get dashboard statistics
function getDashboardStats() {
    // This would typically fetch from a database
    // Placeholder data for demonstration
    return [
        'today_sales' => 12586,
        'new_orders' => 142,
        'total_revenue' => 48294,
        'low_stock_items' => 24,
        'sales_change' => 12.5,
        'orders_change' => 8.3,
        'revenue_change' => 14.7,
        'inventory_change' => 5.2
    ];
}

// Get recent activity
function getRecentActivity() {
    // This would typically fetch from a database
    // Using placeholder data for demonstration
    return [
        [
            'type' => 'invoice',
            'title' => 'New invoice created',
            'description' => 'Invoice #INV-2023-0458 for $1,250.00',
            'time' => '15 minutes ago'
        ],
        [
            'type' => 'payment',
            'title' => 'Payment received',
            'description' => '$3,500.00 from Acme Corporation',
            'time' => '2 hours ago'
        ],
        [
            'type' => 'order',
            'title' => 'New order placed',
            'description' => 'Order #ORD-2023-7851 for 5 items',
            'time' => '3 hours ago'
        ],
        [
            'type' => 'user',
            'title' => 'New customer registered',
            'description' => 'John Smith from TechCorp',
            'time' => '5 hours ago'
        ]
    ];
}

// Get top products
function getTopProducts() {
    // This would typically fetch from a database
    // Using placeholder data for demonstration
    return [
        [
            'name' => 'Wireless Headphones',
            'sold' => 246,
            'revenue' => 12300,
            'percentage' => 85
        ],
        [
            'name' => 'Bluetooth Speaker',
            'sold' => 187,
            'revenue' => 9350,
            'percentage' => 70
        ],
        [
            'name' => 'Smart Watch',
            'sold' => 142,
            'revenue' => 7100,
            'percentage' => 55
        ],
        [
            'name' => 'Wireless Charger',
            'sold' => 128,
            'revenue' => 3840,
            'percentage' => 45
        ],
        [
            'name' => 'USB-C Cable',
            'sold' => 95,
            'revenue' => 1425,
            'percentage' => 30
        ]
    ];
}

// Get upcoming payments
function getUpcomingPayments() {
    // This would typically fetch from a database
    // Using placeholder data for demonstration
    return [
        [
            'customer' => 'TechCorp Inc.',
            'invoice' => 'INV-2023-0427',
            'amount' => 3750,
            'due' => 'Due in 2 days',
            'status' => 'warning'
        ],
        [
            'customer' => 'Global Solutions Ltd',
            'invoice' => 'INV-2023-0418',
            'amount' => 2450,
            'due' => 'Due today',
            'status' => 'critical'
        ],
        [
            'customer' => 'Bright Innovations',
            'invoice' => 'INV-2023-0442',
            'amount' => 1875,
            'due' => 'Due in 7 days',
            'status' => ''
        ]
    ];
}

// Get pending orders
function getPendingOrders() {
    // This would typically fetch from a database
    // Using placeholder data for demonstration
    return [
        [
            'id' => 'ORD-2023-7834',
            'customer' => 'Michael Johnson',
            'amount' => 950,
            'items' => 4,
            'status' => 'processing'
        ],
        [
            'id' => 'ORD-2023-7842',
            'customer' => 'Sarah Williams',
            'amount' => 1240,
            'items' => 6,
            'status' => 'pending'
        ],
        [
            'id' => 'ORD-2023-7851',
            'customer' => 'James Brown',
            'amount' => 785,
            'items' => 3,
            'status' => 'shipped'
        ]
    ];
}

// Get sales data for chart
function getSalesChartData() {
    // This would typically fetch from a database
    // Using placeholder data for demonstration
    return [
        'labels' => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        'data' => [30, 45, 65, 40, 55, 75, 60]
    ];
}

// Main controller function to handle dashboard request
function handleDashboardRequest() {
    // Check if user is authenticated
    checkAuth();
    
    // Get data for dashboard
    $userData = getUserInfo();
    $stats = getDashboardStats();
    $recentActivity = getRecentActivity();
    $topProducts = getTopProducts();
    $upcomingPayments = getUpcomingPayments();
    $pendingOrders = getPendingOrders();
    $salesChartData = getSalesChartData();
    
    // Set data to be used in view
    $viewData = [
        'userData' => $userData,
        'stats' => $stats,
        'recentActivity' => $recentActivity,
        'topProducts' => $topProducts,
        'upcomingPayments' => $upcomingPayments,
        'pendingOrders' => $pendingOrders,
        'salesChartData' => $salesChartData,
        'currentDate' => date('F d, Y')
    ];
    
    // Include view file
    include_once '../../views/dashboard/dashboard.html';
}

// Execute main controller function
handleDashboardRequest();