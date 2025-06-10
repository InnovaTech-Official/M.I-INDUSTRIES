<?php
// Model file for editing machine setup entries
require_once __DIR__ . '/../../../includes/connection.php';
require_once __DIR__ . '/fetch.php';

/**
 * Update an existing machine entry
 * @param array $data The updated entry data
 * @return array Status of the operation
 */
function updateMachineEntry($data) {
    global $pdo;
    
    try {
        // Validate required fields
        if (!isset($data['job_no']) || !isset($data['date']) || 
            !isset($data['machine_name']) || !isset($data['machine_type'])) {
            return ['success' => false, 'error' => 'Missing required fields'];
        }
        
        // Check if entry exists
        $existingEntry = getMachineEntry($data['job_no']);
        
        if (!$existingEntry || empty($existingEntry)) {
            return ['success' => false, 'error' => 'Entry not found'];
        }
        
        // Handle null values properly for PostgreSQL
        $other = $data['other'] ?: null;
        
        // Update existing entry
        $stmt = $pdo->prepare("UPDATE machine_entries SET 
            date = :date,
            machine_name = :machine_name,
            machine_type = :machine_type,
            other = :other
            WHERE job_no = :job_no");
        
        // Bind parameters
        $stmt->bindParam(':job_no', $data['job_no'], PDO::PARAM_STR);
        $stmt->bindParam(':date', $data['date']);
        $stmt->bindParam(':machine_name', $data['machine_name']);
        $stmt->bindParam(':machine_type', $data['machine_type']);
        $stmt->bindParam(':other', $other);
        
        $stmt->execute();
        
        return ['success' => true];
        
    } catch(PDOException $e) {
        return ['success' => false, 'error' => 'Database error: ' . $e->getMessage()];
    } catch(Exception $e) {
        return ['success' => false, 'error' => $e->getMessage()];
    }
}