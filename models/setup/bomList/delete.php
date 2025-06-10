<?php
// Include database connection
require_once '../../../includes/connection.php';

// Check if job_no is provided
if (!isset($_POST['job_no']) || empty($_POST['job_no'])) {
    echo json_encode(['success' => false, 'message' => 'Job number is required']);
    exit;
}

$job_no = $_POST['job_no'];

try {
    // Begin transaction
    $pdo->beginTransaction();
    
    // Delete the BOM header
    $stmt = $pdo->prepare("DELETE FROM bom_headers WHERE job_no = :job_no");
    $stmt->bindParam(':job_no', $job_no, PDO::PARAM_INT);
    $stmt->execute();
    
    // Check if any row was affected
    if ($stmt->rowCount() === 0) {
        throw new PDOException("No record found with Job No: " . $job_no);
    }
    
    // Commit transaction
    $pdo->commit();
    
    // Return success response
    echo json_encode(['success' => true, 'message' => 'BOM entry deleted successfully']);
    
} catch (PDOException $e) {
    // Rollback transaction on error
    $pdo->rollBack();
    
    // Return error response
    echo json_encode(['success' => false, 'message' => 'Error deleting BOM entry: ' . $e->getMessage()]);
}
?>