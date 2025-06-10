<?php
// Include database connection
require_once '../../../includes/connection.php';

try {
    // Prepare and execute the query to fetch BOM headers
    $stmt = $pdo->prepare("SELECT job_no, machine_no, finished_good, total_qty, status, created_at 
                          FROM bom_headers 
                          ORDER BY created_at DESC");
    $stmt->execute();
    
    // Fetch all records as an associative array
    $bomHeaders = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Return data as JSON
    header('Content-Type: application/json');
    echo json_encode(['success' => true, 'data' => $bomHeaders]);
    
} catch (PDOException $e) {
    // Return error as JSON
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'Error fetching BOM headers: ' . $e->getMessage()]);
}
?>