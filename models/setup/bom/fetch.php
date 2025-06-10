<?php
// Models/setup/bom/fetch.php
// Handles all data retrieval related to BOM

class BOMFetch {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    // Get latest job number for auto-increment
    public function getAutoJobNo() {
        $stmt = $this->pdo->query("SELECT MAX(job_no) AS max_job_no FROM bom_headers");
        $maxJobNo = $stmt->fetch(PDO::FETCH_ASSOC)['max_job_no'];
        return $maxJobNo ? $maxJobNo + 1 : 1;
    }

    // Get all job numbers
    public function getAllJobNos() {
        return $this->pdo->query("SELECT job_no FROM bom_headers ORDER BY job_no")->fetchAll(PDO::FETCH_COLUMN);
    }

    // Get available machines (not in Processing status)
    public function getAvailableMachines() {
        try {
            $machinesStmt = $this->pdo->query("
                SELECT id, machine_name, machine_type 
                FROM machine_entries
                ORDER BY id
            ");
            return $machinesStmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error fetching machines: " . $e->getMessage());
            return [];
        }
    }

    // Get all finished goods
    public function getFinishedGoods() {
        return $this->pdo->query("SELECT name FROM products WHERE category = 'Finished Good' ORDER BY name")->fetchAll(PDO::FETCH_COLUMN);
    }

    // Get all raw materials with their prices
    public function getRawMaterials() {
        return $this->pdo->query("SELECT name, pprice FROM products WHERE category = 'Raw Material' ORDER BY name")->fetchAll(PDO::FETCH_ASSOC);
    }

    // Get details for a specific BOM
    public function getBOMDetails($jobNo) {
        try {
            // First check if the job number exists
            $checkStmt = $this->pdo->prepare("SELECT COUNT(*) FROM bom_headers WHERE job_no = ?");
            $checkStmt->execute([$jobNo]);
            if ($checkStmt->fetchColumn() == 0) {
                return [
                    'success' => false,
                    'message' => 'Job number not found'
                ];
            }
            
            // Get header information
            $headerStmt = $this->pdo->prepare("SELECT * FROM bom_headers WHERE job_no = ?");
            $headerStmt->execute([$jobNo]);
            $header = $headerStmt->fetch(PDO::FETCH_ASSOC);
            
            // Get entry information - removed density and density_conversion as they're calculated fields
            $entriesStmt = $this->pdo->prepare("SELECT date, day, raw_material, unit, qty, amount FROM bom_entries WHERE job_no = ?");
            $entriesStmt->execute([$jobNo]);
            $entries = $entriesStmt->fetchAll(PDO::FETCH_ASSOC);
            
            return [
                'success' => true,
                'header' => $header,
                'entries' => $entries
            ];
        } catch (PDOException $e) {
            error_log("Error fetching BOM details: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Database error: ' . $e->getMessage()
            ];
        }
    }

    // Get all BOMs with status
    public function getAllBOMsWithStatus() {
        try {
            $stmt = $this->pdo->query("SELECT job_no, machine_no, finished_good, status FROM bom_headers ORDER BY job_no");
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error fetching BOMs with status: " . $e->getMessage());
            return [];
        }
    }

    // Get available units - updated to only fetch from the unit table, no hardcoded defaults
    public function getUnits() {
        try {
            // Check if unit table exists
            $stmt = $this->pdo->query("SELECT to_regclass('public.unit') IS NOT NULL AS exists");
            $tableExists = $stmt->fetch(PDO::FETCH_ASSOC)['exists'];
            
            if ($tableExists) {
                // Fetch units from database
                $stmt = $this->pdo->query("SELECT name FROM unit ORDER BY name");
                $dbUnits = $stmt->fetchAll(PDO::FETCH_COLUMN);
                
                // Return database units, even if empty
                return $dbUnits;
            }
            
            // Return empty array if table doesn't exist
            return [];
        } catch (PDOException $e) {
            error_log("Error fetching units: " . $e->getMessage());
            // Return empty array in case of error
            return [];
        }
    }
}