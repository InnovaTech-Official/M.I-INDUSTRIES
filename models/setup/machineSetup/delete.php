<?php
// Model file for deleting machine setup data
require_once __DIR__ . '/../../../includes/connection.php';

/**
 * Delete a machine entry by ID
 * @param int $id The ID of the entry to delete
 * @return array Result of the operation
 */
function deleteMachineEntryById($id) {
    global $pdo;
    
    // Input validation
    if (!is_numeric($id)) {
        error_log("Invalid ID for deletion: " . print_r($id, true));
        return ['success' => false, 'error' => 'Invalid ID format'];
    }
    
    $id = (int)$id; // Ensure it's an integer
    
    try {
        error_log("Attempting to delete machine entry with ID: $id");
        
        // First check if the entry exists
        $checkStmt = $pdo->prepare("SELECT id FROM machine_entries WHERE id = :id");
        $checkStmt->bindParam(':id', $id, PDO::PARAM_INT);
        $checkStmt->execute();
        
        if ($checkStmt->rowCount() === 0) {
            error_log("No machine entry found with ID: $id");
            return ['success' => false, 'error' => 'Entry not found'];
        }
        
        // Delete the entry
        $stmt = $pdo->prepare("DELETE FROM machine_entries WHERE id = :id");
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            error_log("Successfully deleted machine entry with ID: $id");
            return ['success' => true];
        } else {
            error_log("Failed to delete machine entry with ID: $id");
            return ['success' => false, 'error' => 'Failed to delete entry'];
        }
    } catch(PDOException $e) {
        error_log("Database error while deleting machine entry: " . $e->getMessage());
        return ['success' => false, 'error' => 'Database error: ' . $e->getMessage()];
    }
}