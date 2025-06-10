<?php
// Model file for fetching machine setup data
require_once __DIR__ . '/../../../includes/connection.php';

/**
 * Get all machine entries from the database
 * @return array Array of machine entries
 */
function getAllMachineEntries() {
    global $pdo;
    
    try {
        // Debug: Log query execution
        error_log("Executing getAllMachineEntries query");
        
        $stmt = $pdo->prepare("SELECT * FROM machine_entries ORDER BY id DESC");
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Debug: Log the result count
        error_log("Found " . count($result) . " machine entries");
        
        if (!is_array($result)) {
            error_log("Query result is not an array, converting to empty array");
            return [];
        }
        
        return $result;
    } catch(PDOException $e) {
        error_log("Database error in getAllMachineEntries: " . $e->getMessage());
        throw new Exception("Error retrieving machine entries: " . $e->getMessage());
    }
}

/**
 * Get a specific machine entry by ID
 * @param int $id The ID to retrieve
 * @return array The machine entry data
 */
function getMachineEntryById($id) {
    global $pdo;
    
    try {
        $stmt = $pdo->prepare("SELECT * FROM machine_entries WHERE id = :id");
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$result) {
            return [];
        }
        
        return $result;
    } catch(PDOException $e) {
        throw new Exception("Error retrieving machine entry: " . $e->getMessage());
    }
}

/**
 * Get the next ID that will be assigned by the database
 * @return int Next ID value
 */
function getNextId() {
    global $pdo;
    
    try {
        // PostgreSQL-specific query to get the next value from the sequence
        $stmt = $pdo->prepare("SELECT nextval('machine_entries_id_seq') AS next_id");
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($result && isset($result['next_id'])) {
            return (int)$result['next_id'];
        }
        
        // If we can't get the sequence value, try getting max ID + 1
        $stmt = $pdo->prepare("SELECT COALESCE(MAX(id), 0) + 1 AS next_id FROM machine_entries");
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($result && isset($result['next_id'])) {
            return (int)$result['next_id'];
        }
        
        // Default to 1 if nothing else works
        return 1;
    } catch(PDOException $e) {
        error_log("Error getting next ID: " . $e->getMessage());
        // Fallback: Try simpler query for max ID
        try {
            $stmt = $pdo->prepare("SELECT COALESCE(MAX(id), 0) + 1 AS next_id FROM machine_entries");
            $stmt->execute();
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($result && isset($result['next_id'])) {
                return (int)$result['next_id'];
            }
        } catch(PDOException $e2) {
            error_log("Second error getting next ID: " . $e2->getMessage());
        }
        
        // Default to 1 if all else fails
        return 1;
    }
}