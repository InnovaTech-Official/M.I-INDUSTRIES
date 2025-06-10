<?php
// Models/setup/bom/edit.php
// Handles editing existing BOM entries

class BOMEdit {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    // Update an existing BOM header
    public function updateBOMHeader($job_no, $machine_no, $finished_good, $unit) {
        try {
            $stmt = $this->pdo->prepare("UPDATE bom_headers SET machine_no = ?, finished_good = ?, unit = ? WHERE job_no = ?");
            $stmt->execute([$machine_no, $finished_good, $unit ?: NULL, $job_no]);
            return [
                'success' => true, 
                'message' => 'BOM header updated successfully'
            ];
        } catch (PDOException $e) {
            error_log("Error updating BOM header: " . $e->getMessage());
            return [
                'success' => false, 
                'message' => 'Error updating BOM header: ' . $e->getMessage()
            ];
        }
    }

    // Update a specific BOM entry
    public function updateBOMEntry($entry_id, $date, $day, $raw_material, $unit, $qty, $amount) {
        try {
            // Get the job_no for this entry to recalculate totals later
            $stmt = $this->pdo->prepare("SELECT job_no FROM bom_entries WHERE id = ?");
            $stmt->execute([$entry_id]);
            $job_no = $stmt->fetchColumn();
            
            if (!$job_no) {
                return [
                    'success' => false, 
                    'message' => 'Entry not found'
                ];
            }

            // Calculate density conversion
            $density = $this->calculateDensityConversion($unit, $qty);
            
            // Update the entry
            $stmt = $this->pdo->prepare("UPDATE bom_entries SET date = ?, day = ?, raw_material = ?, unit = ?, qty = ?, amount = ?, density_conversion = ? WHERE id = ?");
            $stmt->execute([
                $date,
                $day,
                $raw_material,
                $unit,
                floatval($qty),
                floatval($amount),
                $density,
                $entry_id
            ]);
            
            // Recalculate total_qty for this job_no
            $this->recalculateTotalQty($job_no);
            
            return [
                'success' => true, 
                'message' => 'BOM entry updated successfully'
            ];
        } catch (PDOException $e) {
            error_log("Error updating BOM entry: " . $e->getMessage());
            return [
                'success' => false, 
                'message' => 'Error updating BOM entry: ' . $e->getMessage()
            ];
        }
    }

    // Calculate density conversion based on unit
    public function calculateDensityConversion($unit, $qty) {
        $qty = floatval($qty);
        switch (strtolower($unit)) {
            case 'liter':
            case 'liters':
                return $qty * 1; // Assuming density = 1 for liters
            case 'gram':
            case 'grams':
                return $qty / 1000; // Kilograms = Grams / 1000
            case 'kilogram':
            case 'kilograms':
                return $qty; // Already in KG
            case 'tonne':
                return $qty * 1000; // Kilograms = Tonne × 1000
            default:
                return $qty; // Default to kilograms
        }
    }

    // Recalculate total quantity for a BOM
    private function recalculateTotalQty($job_no) {
        $totalStmt = $this->pdo->prepare("SELECT SUM(density_conversion) AS total FROM bom_entries WHERE job_no = ?");
        $totalStmt->execute([$job_no]);
        $totalDensity = $totalStmt->fetchColumn() ?: 0;

        $stmt = $this->pdo->prepare("UPDATE bom_headers SET total_qty = ? WHERE job_no = ?");
        $stmt->execute([$totalDensity, $job_no]);
        
        return $totalDensity;
    }
}