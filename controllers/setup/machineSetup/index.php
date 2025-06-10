<?php
// Machine Setup Controller
session_start();
require_once __DIR__ . '/../../../models/setup/machineSetup/fetch.php';
require_once __DIR__ . '/../../../models/setup/machineSetup/post.php';
require_once __DIR__ . '/../../../models/setup/machineSetup/edit.php';
require_once __DIR__ . '/../../../models/setup/machineSetup/delete.php';

// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Handle AJAX requests
if ($_SERVER['REQUEST_METHOD'] === 'POST' && !empty($_SERVER['CONTENT_TYPE']) && strpos($_SERVER['CONTENT_TYPE'], 'application/json') !== false) {
    // Get the JSON input
    $json = file_get_contents('php://input');
    error_log("Received JSON: " . $json); // Log received data
    
    $data = json_decode($json, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON data: ' . json_last_error_msg()]);
        exit;
    }
    
    // Process based on action
    if (isset($data['action'])) {
        switch ($data['action']) {
            case 'get_next_id':
                $next_id = getNextId();
                echo json_encode([
                    'next_id' => $next_id
                ]);
                break;
                
            case 'get_all':
                // Get all machine entries for table population
                try {
                    $entries = getAllMachineEntries();
                    error_log("get_all found " . count($entries) . " entries");
                    
                    // Verify we have valid data
                    if (!is_array($entries)) {
                        error_log("getAllMachineEntries did not return an array");
                        $entries = [];
                    }
                    
                    // Debug output
                    error_log("Sending response for get_all: " . json_encode($entries));
                    
                    // Send response
                    header('Content-Type: application/json');
                    echo json_encode($entries);
                } catch(Exception $e) {
                    error_log("Error in get_all: " . $e->getMessage());
                    http_response_code(500);
                    echo json_encode(['error' => $e->getMessage()]);
                }
                break;
                
            case 'get':
                if (isset($data['id'])) {
                    $entry = getMachineEntryById($data['id']);
                    echo json_encode($entry);
                } else {
                    http_response_code(400);
                    echo json_encode(['error' => 'Missing id parameter']);
                }
                break;
                
            case 'save':
                error_log("Processing save action for entry");
                $result = saveMachineEntry($data);
                error_log("Save result: " . json_encode($result));
                echo json_encode($result);
                break;
                
            case 'delete':
                if (isset($data['id'])) {
                    $result = deleteMachineEntryById($data['id']);
                    echo json_encode($result);
                } else {
                    http_response_code(400);
                    echo json_encode(['error' => 'Missing id parameter']);
                }
                break;
                
            default:
                http_response_code(400);
                echo json_encode(['error' => 'Invalid action: ' . $data['action']]);
        }
        exit;
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Missing action parameter']);
        exit;
    }
}

// Regular page load - show the view with data
try {
    include __DIR__ . '/../../../views/setup/machineSetup/index.html';
} catch (Exception $e) {
    $error = $e->getMessage();
    include __DIR__ . '/../../../views/setup/machineSetup/index.html';
}