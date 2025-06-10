<?php
// Model file for fetching machine types data
require_once __DIR__ . '/../../../includes/connection.php';

/**
 * Get all machine types from the database
 * @return array Array of machine types
 */
function getAllMachineTypes() {
    global $pdo;
    
    try {
        // Debug: Log query execution
        error_log("Executing getAllMachineTypes query");
        
        $stmt = $pdo->prepare("SELECT * FROM machine_types ORDER BY id ASC");
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Debug: Log the result count
        error_log("Found " . count($result) . " machine types");
        
        if (!is_array($result)) {
            error_log("Query result is not an array, converting to empty array");
            return [];
        }
        
        return $result;
    } catch(PDOException $e) {
        error_log("Database error in getAllMachineTypes: " . $e->getMessage());
        throw new Exception("Error retrieving machine types: " . $e->getMessage());
    }
}

/**
 * Get a specific machine type by ID
 * @param int $id The ID to retrieve
 * @return array The machine type data
 */
function getMachineTypeById($id) {
    global $pdo;
    
    try {
        $stmt = $pdo->prepare("SELECT * FROM machine_types WHERE id = :id");
        $stmt->bindParam(':id', $id, PDO::PARAM_STR);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$result) {
            return [];
        }
        
        return $result;
    } catch(PDOException $e) {
        throw new Exception("Error retrieving machine type: " . $e->getMessage());
    }
}

/**
 * Save or update a machine type
 * @param array $data The machine type data to save
 * @return int|bool The ID of the created/updated machine type or false on failure
 */
function saveMachineType($data) {
    global $pdo;
    
    try {
        // Determine if we're updating or inserting
        if (!empty($data['id'])) {
            // Update existing machine type
            $stmt = $pdo->prepare("
                UPDATE machine_types 
                SET name = :name, 
                    category = :category, 
                    description = :description,
                    maintenance_cycle = :maintenance_cycle,
                    estimated_lifetime = :estimated_lifetime
                WHERE id = :id
            ");
            
            $stmt->bindParam(':id', $data['id'], PDO::PARAM_STR);
            $stmt->bindParam(':name', $data['name'], PDO::PARAM_STR);
            $stmt->bindParam(':category', $data['category'], PDO::PARAM_STR);
            $stmt->bindParam(':description', $data['description'], PDO::PARAM_STR);
            $stmt->bindParam(':maintenance_cycle', $data['maintenance_cycle'], PDO::PARAM_INT);
            $stmt->bindParam(':estimated_lifetime', $data['estimated_lifetime'], PDO::PARAM_INT);
            
            $stmt->execute();
            return $data['id'];
        } else {
            // Generate a new machine type ID if not provided
            if (empty($data['id'])) {
                $data['id'] = generateMachineTypeId();
            }
            
            // Insert new machine type
            $stmt = $pdo->prepare("
                INSERT INTO machine_types (
                    id, name, category, description, maintenance_cycle, estimated_lifetime
                ) VALUES (
                    :id, :name, :category, :description, :maintenance_cycle, :estimated_lifetime
                )
            ");
            
            $stmt->bindParam(':id', $data['id'], PDO::PARAM_STR);
            $stmt->bindParam(':name', $data['name'], PDO::PARAM_STR);
            $stmt->bindParam(':category', $data['category'], PDO::PARAM_STR);
            $stmt->bindParam(':description', $data['description'], PDO::PARAM_STR);
            $stmt->bindParam(':maintenance_cycle', $data['maintenance_cycle'], PDO::PARAM_INT);
            $stmt->bindParam(':estimated_lifetime', $data['estimated_lifetime'], PDO::PARAM_INT);
            
            $stmt->execute();
            return $data['id'];
        }
    } catch(PDOException $e) {
        error_log("Error saving machine type: " . $e->getMessage());
        throw new Exception("Error saving machine type: " . $e->getMessage());
    }
}

/**
 * Delete a machine type
 * @param string $id The ID of the machine type to delete
 * @return bool Success or failure
 */
function deleteMachineType($id) {
    global $pdo;
    
    try {
        $stmt = $pdo->prepare("DELETE FROM machine_types WHERE id = :id");
        $stmt->bindParam(':id', $id, PDO::PARAM_STR);
        $stmt->execute();
        
        return $stmt->rowCount() > 0;
    } catch(PDOException $e) {
        error_log("Error deleting machine type: " . $e->getMessage());
        throw new Exception("Error deleting machine type: " . $e->getMessage());
    }
}

/**
 * Generate a new machine type ID
 * @return string New machine type ID
 */
function generateMachineTypeId() {
    global $pdo;
    
    try {
        // Get the highest numeric part of existing IDs
        $stmt = $pdo->prepare("
            SELECT id FROM machine_types 
            WHERE id LIKE 'MT%' 
            ORDER BY CAST(SUBSTRING(id, 3) AS UNSIGNED) DESC 
            LIMIT 1
        ");
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($result && isset($result['id'])) {
            // Extract the numeric part and increment
            $numericPart = intval(substr($result['id'], 2));
            $nextNumeric = $numericPart + 1;
            
            // Format with leading zeros (MT001, MT002, etc.)
            return 'MT' . str_pad($nextNumeric, 3, '0', STR_PAD_LEFT);
        }
        
        // Default to MT001 if no existing IDs
        return 'MT001';
    } catch(PDOException $e) {
        error_log("Error generating machine type ID: " . $e->getMessage());
        // Fallback to timestamp-based ID
        return 'MT' . str_pad(rand(1, 999), 3, '0', STR_PAD_LEFT);
    }
}