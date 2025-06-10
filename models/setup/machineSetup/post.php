<?php
// Model file for creating new machine setup entries
require_once __DIR__ . '/../../../includes/connection.php';
require_once __DIR__ . '/fetch.php';

/**
 * Save a machine entry (create new or update existing)
 * @param array $data The entry data
 * @return array Status of the operation
 */
function saveMachineEntry($data) {
    global $pdo;
    
    try {
        // Validate required fields
        if (!isset($data['date']) || !isset($data['machine_name']) || !isset($data['machine_type'])) {
            return ['success' => false, 'error' => 'Missing required fields'];
        }
        
        // Remove action field if present
        if (isset($data['action'])) {
            unset($data['action']);
        }
        
        // Handle null values properly for PostgreSQL
        $other = isset($data['other']) && $data['other'] !== '' ? $data['other'] : null;
        
        // Check if this is an edit (ID provided) or a new entry
        if (isset($data['id']) && !empty($data['id'])) {
            // Update existing entry - Check if it exists first
            $existingEntry = getMachineEntryById($data['id']);
            
            if (!$existingEntry || empty($existingEntry)) {
                return ['success' => false, 'error' => 'Entry not found'];
            }
            
            $stmt = $pdo->prepare("UPDATE machine_entries SET 
                date = :date,
                machine_name = :machine_name,
                machine_type = :machine_type,
                other = :other
                WHERE id = :id");
                
            $stmt->bindParam(':id', $data['id'], PDO::PARAM_INT);
            $stmt->bindParam(':date', $data['date']);
            $stmt->bindParam(':machine_name', $data['machine_name']);
            $stmt->bindParam(':machine_type', $data['machine_type']);
            $stmt->bindParam(':other', $other);
            
            error_log("Updating entry with ID: " . $data['id']);
        } else {
            // Create new entry
            $stmt = $pdo->prepare("INSERT INTO machine_entries 
                (date, machine_name, machine_type, other) 
                VALUES (:date, :machine_name, :machine_type, :other)");
                
            $stmt->bindParam(':date', $data['date']);
            $stmt->bindParam(':machine_name', $data['machine_name']);
            $stmt->bindParam(':machine_type', $data['machine_type']);
            $stmt->bindParam(':other', $other);
            
            error_log("Creating new entry");
        }
        
        $stmt->execute();
        
        return ['success' => true];
        
    } catch(PDOException $e) {
        error_log("Database error in saveMachineEntry: " . $e->getMessage());
        return ['success' => false, 'error' => 'Database error: ' . $e->getMessage()];
    } catch(Exception $e) {
        error_log("General error in saveMachineEntry: " . $e->getMessage());
        return ['success' => false, 'error' => $e->getMessage()];
    }
}