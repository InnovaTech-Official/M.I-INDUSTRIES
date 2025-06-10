<?php
// controllers/entry/bom/index.php

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Debug: Log the current file path and included file paths
error_log("Current file path: " . __FILE__);
error_log("Connection include path: " . realpath('../../../includes/connection.php'));

// Include database connection with path verification
$connectionFile = realpath(__DIR__ . '/../../../includes/connection.php');
if (!$connectionFile) {
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'message' => 'Database configuration file not found',
        'debug' => [
            'attempted_path' => __DIR__ . '/../../../includes/connection.php'
        ]
    ]);
    exit;
}

try {
    include_once $connectionFile;
    if (!isset($pdo) || !$pdo) {
        throw new Exception("Database connection failed");
    }
} catch (Throwable $e) {
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'message' => 'Database connection error: ' . $e->getMessage(),
        'error_details' => [
            'file' => $e->getFile(),
            'line' => $e->getLine(),
            'trace' => $e->getTraceAsString()
        ]
    ]);
    exit;
}

// Include the model classes
include_once '../../../models/setup/bom/fetch.php';
include_once '../../../models/setup/bom/post.php';
include_once '../../../models/setup/bom/edit.php';
include_once '../../../models/setup/bom/delete.php';

// Initialize model instances
$bomFetch = new BOMFetch($pdo);
$bomPost = new BOMPost($pdo);
$bomEdit = new BOMEdit($pdo);
$bomDelete = new BOMDelete($pdo);

// Ensure tables exist
$bomPost->ensureTablesExist();

// Handle AJAX requests
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    header('Content-Type: application/json');
    
    // New endpoint to fetch all initial data needed for the page
    if (isset($_POST['fetch_initial_data'])) {
        try {
            $data = [
                'success' => true,
                'autoJobNo' => $bomFetch->getAutoJobNo(),
                'jobNos' => $bomFetch->getAllJobNos(),
                'machines' => $bomFetch->getAvailableMachines(),
                'finishedGoods' => $bomFetch->getFinishedGoods(),
                'rawMaterials' => $bomFetch->getRawMaterials(),
                'units' => $bomFetch->getUnits(),
                'allBOMs' => $bomFetch->getAllBOMsWithStatus()
            ];
            echo json_encode($data);
        } catch (Throwable $e) {
            echo json_encode([
                'success' => false,
                'message' => 'Error fetching initial data: ' . $e->getMessage(),
                'error_details' => [
                    'file' => $e->getFile(),
                    'line' => $e->getLine()
                ]
            ]);
        }
        exit;
    }
    
    // Add a new unit
    if (isset($_POST['add_unit'])) {
        $unit_name = trim($_POST['unit_name']);
        
        if (empty($unit_name)) {
            echo json_encode(['success' => false, 'message' => 'Unit name cannot be empty']);
            exit;
        }
        
        // Check if unit already exists
        $units = $bomFetch->getUnits();
        if (in_array($unit_name, $units)) {
            echo json_encode(['success' => false, 'message' => 'This unit already exists']);
            exit;
        }
        
        // Add the unit
        try {
            // Create unit table if it doesn't exist
            $pdo->exec("
                CREATE TABLE IF NOT EXISTS unit (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(50) UNIQUE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ");
            
            $stmt = $pdo->prepare("INSERT INTO unit (name) VALUES (?)");
            $stmt->execute([$unit_name]);
            
            echo json_encode(['success' => true, 'message' => 'Unit added successfully']);
        } catch (PDOException $e) {
            error_log("Error adding unit: " . $e->getMessage());
            echo json_encode(['success' => false, 'message' => 'Error adding unit: ' . $e->getMessage()]);
        }
        exit;
    }
    
    // Delete a unit
    if (isset($_POST['delete_unit'])) {
        $unit_name = trim($_POST['unit_name']);
        
        if (empty($unit_name)) {
            echo json_encode(['success' => false, 'message' => 'Unit name cannot be empty']);
            exit;
        }
        
        // Check if unit is in use
        $isUnitInUse = false;
        
        try {
            $stmt = $pdo->prepare("SELECT COUNT(*) FROM bom_headers WHERE unit = ?");
            $stmt->execute([$unit_name]);
            $headerCount = $stmt->fetchColumn();
            
            $stmt = $pdo->prepare("SELECT COUNT(*) FROM bom_entries WHERE unit = ?");
            $stmt->execute([$unit_name]);
            $entriesCount = $stmt->fetchColumn();
            
            if ($headerCount > 0 || $entriesCount > 0) {
                $isUnitInUse = true;
            }
            
            if ($isUnitInUse) {
                echo json_encode(['success' => false, 'message' => 'This unit is in use and cannot be deleted']);
                exit;
            }
            
            // Delete the unit
            $stmt = $pdo->prepare("DELETE FROM unit WHERE name = ?");
            $stmt->execute([$unit_name]);
            
            echo json_encode(['success' => true, 'message' => 'Unit deleted successfully']);
        } catch (PDOException $e) {
            error_log("Error deleting unit: " . $e->getMessage());
            echo json_encode(['success' => false, 'message' => 'Error deleting unit: ' . $e->getMessage()]);
        }
        exit;
    }
    
    // Save BOM
    if (isset($_POST['save_bom'])) {
        $job_no = $_POST['job_no'] ?? $bomFetch->getAutoJobNo();
        $machine_no = $_POST['machine_no'] ?? '';
        $finished_good = $_POST['finished_good'] ?? '';
        $unit = $_POST['main_unit'] ?? '';
        $bom_entries = json_decode($_POST['bom_entries'] ?? '[]', true);
        
        $result = $bomPost->saveBOM($job_no, $machine_no, $finished_good, $unit, $bom_entries);
        echo json_encode($result);
        exit;
    }
    
    // Update status
    if (isset($_POST['update_status'])) {
        $job_no = $_POST['job_no'];
        $status = $_POST['status'];
        
        $result = $bomPost->updateStatus($job_no, $status);
        echo json_encode($result);
        exit;
    }
    
    // Fetch BOM details
    if (isset($_POST['fetch_bom']) && isset($_POST['job_no'])) {
        $jobNo = $_POST['job_no'];
        $details = $bomFetch->getBOMDetails($jobNo);
        echo json_encode($details);
        exit;
    }
    
    // Calculate density conversion
    if (isset($_POST['calculate_density'])) {
        $unit = $_POST['unit'] ?? '';
        $qty = floatval($_POST['qty'] ?? 0);
        
        $density = $bomPost->calculateDensityConversion($unit, $qty);
        echo json_encode(['success' => true, 'density' => $density]);
        exit;
    }
    
    // Fetch machines (for AJAX refresh after status update)
    if (isset($_POST['fetch_machines'])) {
        $machines = $bomFetch->getAvailableMachines();
        echo json_encode(['success' => true, 'machines' => $machines]);
        exit;
    }
    
    // Delete BOM entry
    if (isset($_POST['delete_entry'])) {
        $entry_id = $_POST['entry_id'];
        
        $result = $bomDelete->deleteBOMEntry($entry_id);
        echo json_encode($result);
        exit;
    }
    
    // Delete entire BOM
    if (isset($_POST['delete_bom'])) {
        $job_no = $_POST['job_no'];
        
        $result = $bomDelete->deleteBOM($job_no);
        echo json_encode($result);
        exit;
    }
    
    // Update BOM entry
    if (isset($_POST['update_entry'])) {
        $entry_id = $_POST['entry_id'];
        $date = $_POST['date'];
        $day = $_POST['day'];
        $raw_material = $_POST['raw_material'];
        $unit = $_POST['unit'];
        $qty = $_POST['qty'];
        $amount = $_POST['amount'] ?? 0;
        
        $result = $bomEdit->updateBOMEntry($entry_id, $date, $day, $raw_material, $unit, $qty, $amount);
        echo json_encode($result);
        exit;
    }
    
    // Return error for unknown requests
    echo json_encode(['success' => false, 'message' => 'Unknown request']);
    exit;
}

// Load the view - now using HTML instead of PHP
include __DIR__ . '/../../../views/entry/bom/index.html';
?>