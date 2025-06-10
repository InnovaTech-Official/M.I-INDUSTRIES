<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Debug path resolution
$viewFile = realpath(__DIR__ . '/../../../views/entry/extraction/index.html');
if (!$viewFile) {
    die('View file not found. Attempted path: ' . __DIR__ . '/../../../views/entry/extraction/index.html');
}

// Include database connection with path verification
$connectionFile = realpath(__DIR__ . '/../../../includes/connection.php');
if (!$connectionFile) {
    die('Database configuration file not found. Attempted path: ' . __DIR__ . '/../../../includes/connection.php');
}

try {
    include_once $connectionFile;
    if (!isset($pdo)) {
        throw new Exception("Database connection failed");
    }

    // Handle AJAX requests here
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        header('Content-Type: application/json');
        
        // Your existing AJAX handlers...
        
        exit;
    }

    // Load the view file
    include $viewFile;

} catch (Exception $e) {
    if (isset($_POST['ajax'])) {
        header('Content-Type: application/json');
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    } else {
        die('Error: ' . $e->getMessage());
    }
}
?>