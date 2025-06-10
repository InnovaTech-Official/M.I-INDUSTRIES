<?php
// Include database connection
require_once '../../../includes/connection.php';

// This controller handles server-side rendering for the BOM List page
// Typically used when we need to pass any initial data to the view

try {
    // You can add any server-side processing here if needed
    // For example, retrieving statistics or additional data for the page
    
    // For now, just include the view
    include('../../../views/entry/bomList/index.html');
    
} catch (Exception $e) {
    // Handle any errors
    echo "Error: " . $e->getMessage();
}
?>