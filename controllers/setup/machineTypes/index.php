<?php
// Controller file for machine types operations
header('Content-Type: application/json');

require_once __DIR__ . '/../../../models/setup/machineTypes/fetch.php';

// Get JSON input
$requestBody = file_get_contents('php://input');
$requestData = json_decode($requestBody, true);

// Default response
$response = ['success' => false, 'error' => 'Invalid action'];

// Check if action is set
if (isset($requestData['action'])) {
    try {
        switch($requestData['action']) {
            case 'get_all':
                $machineTypes = getAllMachineTypes();
                $response = $machineTypes;
                break;
                
            case 'get':
                if (isset($requestData['id'])) {
                    $machineType = getMachineTypeById($requestData['id']);
                    if (!empty($machineType)) {
                        $response = $machineType;
                    } else {
                        $response = ['success' => false, 'error' => 'Machine type not found'];
                    }
                } else {
                    $response = ['success' => false, 'error' => 'ID is required'];
                }
                break;
                
            case 'save':
                // Validate required fields
                if (empty($requestData['name'])) {
                    $response = ['success' => false, 'error' => 'Machine type name is required'];
                    break;
                }
                
                if (empty($requestData['category'])) {
                    $response = ['success' => false, 'error' => 'Category is required'];
                    break;
                }
                
                // Default values for optional fields
                if (!isset($requestData['maintenance_cycle'])) {
                    $requestData['maintenance_cycle'] = 90; // Default 90 days
                }
                
                if (!isset($requestData['estimated_lifetime'])) {
                    $requestData['estimated_lifetime'] = 10; // Default 10 years
                }
                
                // Save the machine type
                $id = saveMachineType($requestData);
                if ($id) {
                    $response = ['success' => true, 'id' => $id, 'message' => 'Machine type saved successfully'];
                } else {
                    $response = ['success' => false, 'error' => 'Failed to save machine type'];
                }
                break;
                
            case 'delete':
                if (isset($requestData['id'])) {
                    $result = deleteMachineType($requestData['id']);
                    if ($result) {
                        $response = ['success' => true, 'message' => 'Machine type deleted successfully'];
                    } else {
                        $response = ['success' => false, 'error' => 'Machine type not found or could not be deleted'];
                    }
                } else {
                    $response = ['success' => false, 'error' => 'ID is required for deletion'];
                }
                break;
                
            default:
                $response = ['success' => false, 'error' => 'Unknown action: ' . $requestData['action']];
                break;
        }
    } catch (Exception $e) {
        $response = ['success' => false, 'error' => $e->getMessage()];
        error_log('Error in machine types controller: ' . $e->getMessage());
    }
}

// Output response
echo json_encode($response);
exit;