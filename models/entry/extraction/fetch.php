<?php
/**
 * Fetch.php - Handles data retrieval for the extraction page
 */

// Set the content type header to JSON
header('Content-Type: application/json');

// Database connection
require_once '../../../includes/connection.php';

// Get the action parameter from the request
$action = isset($_GET['action']) ? $_GET['action'] : '';

// Handle different actions based on the request
try {
    switch ($action) {
        case 'getAvailableJobs':
            getAvailableJobs();
            break;
            
        case 'getJobDetails':
            $jobNo = isset($_GET['jobNo']) ? $_GET['jobNo'] : null;
            
            if ($jobNo) {
                getJobDetails($jobNo);
            } else {
                echo json_encode(['error' => 'Job No is required']);
            }
            break;
            
        case 'saveExtraction':
            saveExtraction();
            break;
            
        default:
            echo json_encode(['error' => 'Invalid action']);
            break;
    }
} catch (Exception $e) {
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}

/**
 * Fetch all available jobs for extraction
 */
function getAvailableJobs() {
    // Simple query to fetch active jobs with remaining quantity
    $jobs = db_get_all("SELECT job_no, machine_no, finished_good, total_qty
                          FROM bom_headers
                          WHERE status = 'Processing' AND CAST(total_qty AS DECIMAL) > 0
                          ORDER BY created_at DESC");
    
    echo json_encode(['jobs' => $jobs ?: []]);
}

/**
 * Get details for a specific job
 * 
 * @param string $jobNo The job number
 */
function getJobDetails($jobNo) {
    // Simple query to fetch job details
    $job = db_get_row("SELECT job_no, machine_no, finished_good, total_qty
                        FROM bom_headers
                        WHERE job_no = ?", [$jobNo]);
    
    if ($job) {
        echo json_encode($job);
    } else {
        echo json_encode([
            'error' => 'Job not found',
            'machine_no' => '',
            'finished_good' => ''
        ]);
    }
}

/**
 * Save extraction data
 */
function saveExtraction() {
    global $pdo;
    
    // Check if the request method is POST
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        echo json_encode([
            'status' => 'error',
            'message' => 'Invalid request method'
        ]);
        return;
    }
    
    try {
        // Get form data directly from $_POST
        $extractionDate = isset($_POST['extractionDate']) ? $_POST['extractionDate'] : null;
        $jobNo = isset($_POST['jobNo']) ? $_POST['jobNo'] : null;
        $machineNo = isset($_POST['machineNo']) ? $_POST['machineNo'] : null;
        $finishedGood = isset($_POST['finishedGood']) ? $_POST['finishedGood'] : null;
        $wastagePercent = isset($_POST['wastage']) && $_POST['wastage'] !== '' ? $_POST['wastage'] : 0;
        $extractionQty = isset($_POST['extractionQty']) ? $_POST['extractionQty'] : null;
        $originalQty = isset($_POST['originalQty']) ? $_POST['originalQty'] : null;
        
        // Use client-calculated values if available
        $wastageAmount = isset($_POST['wastageAmount']) ? $_POST['wastageAmount'] : null;
        $availableQty = isset($_POST['availableQty']) ? $_POST['availableQty'] : null;
        
        // Validate required fields
        if (!$extractionDate || !$jobNo || !$machineNo || !$finishedGood || !$extractionQty) {
            echo json_encode([
                'status' => 'error',
                'message' => 'All fields are required'
            ]);
            return;
        }
        
        // Start a transaction
        $pdo->beginTransaction();
        
        // Ensure extractions table exists
        ensureExtractionsTableExists();
        
        // Get the current quantity from the database
        $currentQty = db_get_var("SELECT total_qty FROM bom_headers WHERE job_no = ?", [$jobNo]);
        
        if ($currentQty === null) {
            $pdo->rollBack();
            echo json_encode([
                'status' => 'error',
                'message' => 'Job not found'
            ]);
            return;
        }
        
        // Recalculate on the server side for validation
        $wastageAmount = ($currentQty * floatval($wastagePercent)) / 100;
        $availableQty = floatval($currentQty) - $wastageAmount;
        
        // Fix floating point precision issues before comparison
        // Round to 3 decimal places to avoid floating point comparison issues
        $precision = 1000;
        $extractionQtyRounded = round(floatval($extractionQty) * $precision) / $precision;
        $availableQtyRounded = round($availableQty * $precision) / $precision;
        
        // Check if there's enough quantity for extraction (with precision fix)
        if ($extractionQtyRounded > $availableQtyRounded) {
            $pdo->rollBack();
            echo json_encode([
                'status' => 'error',
                'message' => "Extraction quantity ($extractionQty) exceeds available quantity ($availableQty)"
            ]);
            return;
        }
        
        // Insert extraction record
        $extractionData = [
            'date' => $extractionDate,
            'job_id' => $jobNo,
            'machine_no' => $machineNo,
            'finished_good' => $finishedGood,
            'wastage_percent' => $wastagePercent,
            'wastage_qty' => $wastageAmount,
            'available_qty' => $availableQty,
            'extraction_qty' => $extractionQty,
            'final_qty' => max(0, $availableQty - floatval($extractionQty))
        ];
        
        db_insert('extractions', $extractionData);
        
        // Calculate total to deduct (wastage + extraction)
        $totalToDeduct = $wastageAmount + floatval($extractionQty);
        
        // Update BOM header quantity
        $newQty = max(0, floatval($currentQty) - $totalToDeduct);
        
        // If quantity becomes zero or negative, update status to Completed
        if ($newQty <= 0) {
            db_update('bom_headers', 
                     ['total_qty' => 0, 'status' => 'Completed'], 
                     'job_no = ?', 
                     [$jobNo]);
        } else {
            db_update('bom_headers', 
                     ['total_qty' => $newQty], 
                     'job_no = ?', 
                     [$jobNo]);
        }
        
        // Commit the transaction
        $pdo->commit();
        
        echo json_encode([
            'status' => 'success',
            'message' => 'Extraction saved successfully',
            'original_qty' => $currentQty,
            'wastage_percent' => $wastagePercent,
            'wastage_amount' => $wastageAmount,
            'available_qty' => $availableQty,
            'extraction_qty' => $extractionQty,
            'remaining_qty' => $newQty
        ]);
    } catch (Exception $e) {
        if (isset($pdo) && $pdo->inTransaction()) {
            $pdo->rollBack();
        }
        
        echo json_encode([
            'status' => 'error',
            'message' => 'Error: ' . $e->getMessage()
        ]);
    }
}

/**
 * Ensure extractions table exists
 */
function ensureExtractionsTableExists() {
    global $pdo;
    
    // Check if the table exists
    $tableExists = db_get_var("SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'extractions'
    )");
    
    if (!$tableExists) {
        // Create the table
        db_query("CREATE TABLE extractions (
            id SERIAL PRIMARY KEY,
            date DATE NOT NULL,
            job_id VARCHAR(255) NOT NULL,
            machine_no VARCHAR(50) NOT NULL,
            finished_good VARCHAR(255) NOT NULL,
            wastage_percent DECIMAL(10,2) DEFAULT 0,
            wastage_qty DECIMAL(10,2) DEFAULT 0,
            available_qty DECIMAL(10,2) NOT NULL,
            extraction_qty DECIMAL(10,2) NOT NULL,
            final_qty DECIMAL(10,2) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )");
    } else {
        // Check if we need to add the new columns for wastage calculations
        $hasAvailableQtyColumn = db_get_var("SELECT EXISTS (
            SELECT FROM information_schema.columns
            WHERE table_schema = 'public' 
            AND table_name = 'extractions'
            AND column_name = 'available_qty'
        )");
        
        if (!$hasAvailableQtyColumn) {
            // Add the new columns
            db_query("ALTER TABLE extractions 
                ADD COLUMN wastage_percent DECIMAL(10,2) DEFAULT 0,
                ADD COLUMN wastage_qty DECIMAL(10,2) DEFAULT 0,
                ADD COLUMN available_qty DECIMAL(10,2) DEFAULT 0,
                ADD COLUMN final_qty DECIMAL(10,2) DEFAULT 0");
            
            // Update existing records to calculate values
            db_query("UPDATE extractions 
                SET wastage_percent = wastage,
                    wastage_qty = (SELECT total_qty FROM bom_headers WHERE job_no = job_id) * wastage / 100,
                    available_qty = (SELECT total_qty FROM bom_headers WHERE job_no = job_id) - ((SELECT total_qty FROM bom_headers WHERE job_no = job_id) * wastage / 100),
                    final_qty = available_qty - extraction_qty
                WHERE id > 0");
        }
    }
}
?>