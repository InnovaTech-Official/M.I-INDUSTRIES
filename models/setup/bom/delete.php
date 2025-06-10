<?php
// Models/setup/bom/delete.php
// Handles deleting BOM entries

class BOMDelete {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    // Delete a specific BOM entry
    public function deleteBOMEntry($entry_id) {
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
            
            // Delete the entry
            $stmt = $this->pdo->prepare("DELETE FROM bom_entries WHERE id = ?");
            $stmt->execute([$entry_id]);
            
            // Recalculate total_qty for this job_no
            $this->recalculateTotalQty($job_no);
            
            return [
                'success' => true, 
                'message' => 'BOM entry deleted successfully'
            ];
        } catch (PDOException $e) {
            error_log("Error deleting BOM entry: " . $e->getMessage());
            return [
                'success' => false, 
                'message' => 'Error deleting BOM entry: ' . $e->getMessage()
            ];
        }
    }

    // Delete an entire BOM (header and all entries)
    public function deleteBOM($job_no) {
        try {
            $this->pdo->beginTransaction();
            
            // Delete all entries first (due to foreign key constraint)
            $stmt = $this->pdo->prepare("DELETE FROM bom_entries WHERE job_no = ?");
            $stmt->execute([$job_no]);
            
            // Then delete the header
            $stmt = $this->pdo->prepare("DELETE FROM bom_headers WHERE job_no = ?");
            $stmt->execute([$job_no]);
            
            $this->pdo->commit();
            return [
                'success' => true, 
                'message' => 'BOM deleted successfully'
            ];
        } catch (PDOException $e) {
            $this->pdo->rollBack();
            error_log("Error deleting BOM: " . $e->getMessage());
            return [
                'success' => false, 
                'message' => 'Error deleting BOM: ' . $e->getMessage()
            ];
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