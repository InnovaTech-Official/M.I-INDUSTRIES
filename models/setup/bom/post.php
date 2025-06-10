<?php
// Models/setup/bom/post.php
// Handles creating new BOM entries

class BOMPost {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    // Save a new BOM or update existing one
    public function saveBOM($job_no, $machine_no, $finished_good, $unit, $bom_entries) {
        try {
            $this->pdo->beginTransaction();

            // Get all available units from the database
            $unitStmt = $this->pdo->query("SELECT name FROM unit");
            $dbUnits = $unitStmt->fetchAll(PDO::FETCH_COLUMN);
            
            // Default units to include if unit table is empty or missing
            $defaultUnits = ['Grams', 'Kilograms', 'Liters', 'Tonne', 'Kilogram', 'Gram', 'Liter'];
            
            // Combine both unit sources (database units take precedence)
            $validUnits = array_merge($defaultUnits, $dbUnits);
            
            // Validate unit - only if a unit is actually provided
            if ($unit && !in_array($unit, $validUnits)) {
                throw new PDOException("Invalid unit selected: " . $unit);
            }

            // Check if BOM exists
            $stmt = $this->pdo->prepare("SELECT COUNT(*) FROM bom_headers WHERE job_no = ?");
            $stmt->execute([$job_no]);
            $exists = $stmt->fetchColumn();

            // Update or insert header
            if ($exists) {
                $stmt = $this->pdo->prepare("UPDATE bom_headers SET machine_no = ?, finished_good = ?, unit = ?, status = 'Processing' WHERE job_no = ?");
                $stmt->execute([$machine_no, $finished_good, $unit ?: NULL, $job_no]);
            } else {
                $stmt = $this->pdo->prepare("INSERT INTO bom_headers (job_no, machine_no, finished_good, unit, status, created_at) VALUES (?, ?, ?, ?, 'Processing', NOW())");
                $stmt->execute([$job_no, $machine_no, $finished_good, $unit ?: NULL]);
            }

            // Insert new entries with duplicate check
            if (!empty($bom_entries)) {
                $insertStmt = $this->pdo->prepare("INSERT INTO bom_entries (job_no, date, day, raw_material, unit, qty, amount, density_conversion) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
                $existingEntriesStmt = $this->pdo->prepare("SELECT date, raw_material, unit, qty FROM bom_entries WHERE job_no = ?");
                $existingEntriesStmt->execute([$job_no]);
                $existingEntries = $existingEntriesStmt->fetchAll(PDO::FETCH_ASSOC);
                $existingKeys = [];
                foreach ($existingEntries as $entry) {
                    $existingKeys[] = $entry['date'] . '|' . $entry['raw_material'] . '|' . $entry['unit'] . '|' . $entry['qty'];
                }

                foreach ($bom_entries as $entry) {
                    if ($entry['date'] && $entry['raw_material'] && $entry['unit'] && $entry['qty']) {
                        // Validate unit
                        if (!in_array($entry['unit'], $validUnits)) {
                            throw new PDOException("Invalid unit in BOM entry: " . $entry['unit']);
                        }

                        // Check for duplicate entry
                        $entryKey = $entry['date'] . '|' . $entry['raw_material'] . '|' . $entry['unit'] . '|' . $entry['qty'];
                        if (in_array($entryKey, $existingKeys)) {
                            continue; // Skip duplicate
                        }
                        $existingKeys[] = $entryKey;

                        // Calculate density conversion based on unit and qty
                        // If density input was provided for liters, use it for the conversion
                        $densityValue = isset($entry['density']) && floatval($entry['density']) > 0 ? 
                                       floatval($entry['density']) : 1;
                        
                        $densityConversion = $this->calculateDensityConversion($entry['unit'], $entry['qty'], $densityValue);
                        
                        $insertStmt->execute([
                            $job_no,
                            $entry['date'],
                            $entry['day'],
                            $entry['raw_material'],
                            $entry['unit'],
                            floatval($entry['qty']),
                            floatval($entry['amount'] ?? 0),
                            $densityConversion
                        ]);
                    }
                }

                // Recalculate total_qty from all entries
                $this->recalculateTotalQty($job_no);
            }

            $this->pdo->commit();
            return [
                'success' => true, 
                'message' => 'BOM saved successfully'
            ];
        } catch (PDOException $e) {
            $this->pdo->rollBack();
            error_log("Error saving BOM: " . $e->getMessage());
            return [
                'success' => false, 
                'message' => 'Error saving BOM: ' . $e->getMessage()
            ];
        }
    }

    // Calculate density conversion based on unit - always convert to KG
    public function calculateDensityConversion($unit, $qty, $densityValue = 1) {
        $qty = floatval($qty);
        switch (strtolower($unit)) {
            case 'liter':
            case 'liters':
                // For Liters, use the provided density value for the conversion
                return $qty * $densityValue;
            case 'gram':
            case 'grams':
                return $qty / 1000; // Grams to KG: divide by 1000
            case 'kilogram':
            case 'kilograms':
                return $qty; // Already in KG
            case 'tonne':
                return $qty * 1000; // Tonne to KG: multiply by 1000
            default:
                return $qty; // Default assumes already in KG
        }
    }

    // Update BOM status
    public function updateStatus($job_no, $status) {
        try {
            $stmt = $this->pdo->prepare("UPDATE bom_headers SET status = ? WHERE job_no = ?");
            $stmt->execute([$status, $job_no]);
            return ['success' => true];
        } catch (PDOException $e) {
            error_log("Error updating status: " . $e->getMessage());
            return ['success' => false, 'message' => 'Error updating status'];
        }
    }

    // Recalculate total quantity for a BOM
    private function recalculateTotalQty($job_no) {
        $totalStmt = $this->pdo->prepare("SELECT SUM(density_conversion) AS total FROM bom_entries WHERE job_no = ?");
        $totalStmt->execute([$job_no]);
        $totalDensity = $totalStmt->fetchColumn() ?: 0;

        $stmt = $this->pdo->prepare("UPDATE bom_headers SET total_qty = ? WHERE job_no = ?");
        $stmt->execute([$totalDensity, $job_no]);
    }

    // Ensure database tables exist - Updated for PostgreSQL syntax
    public function ensureTablesExist() {
        $this->pdo->exec("
            CREATE TABLE IF NOT EXISTS bom_headers (
                job_no INT PRIMARY KEY,
                machine_no VARCHAR(100),
                finished_good VARCHAR(100),
                unit VARCHAR(50),
                total_qty DECIMAL(10,2) DEFAULT 0,
                status VARCHAR(20) DEFAULT 'Processing',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ");
        $this->pdo->exec("
            CREATE TABLE IF NOT EXISTS bom_entries (
                id SERIAL PRIMARY KEY,
                job_no INT,
                date DATE,
                day VARCHAR(20),
                raw_material VARCHAR(100),
                unit VARCHAR(50),
                qty DECIMAL(10,2),
                amount DECIMAL(10,2),
                density_conversion DECIMAL(10,2),
                FOREIGN KEY (job_no) REFERENCES bom_headers(job_no)
            )
        ");
        $this->pdo->exec("
            CREATE TABLE IF NOT EXISTS machine_entries (
                id SERIAL PRIMARY KEY,
                job_no INT,
                date DATE,
                machine_name VARCHAR(100),
                machine_type VARCHAR(100),
                other VARCHAR(100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ");
        $this->pdo->exec("
            CREATE TABLE IF NOT EXISTS products (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100),
                category VARCHAR(100)
            )
        ");
    }
}