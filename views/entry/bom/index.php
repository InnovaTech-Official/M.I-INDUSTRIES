<?php
// views/entry/bom/index.php
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Manual BOM Form | InnovaTech</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Poppins:wght@600&display=swap"
        rel="stylesheet" />
    <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
    <link rel="stylesheet" href="../../../assets/css/entry/bom/bom.css">
</head>

<body>
    <div class="form-card">
        <div class="header-container">
            <h1>Manual BOM Form</h1>
            <button class="btn btn-primary" onclick="openStatusModal()">Status</button>
        </div>
        <div class="success-message" id="success-message">BOM saved successfully!</div>
        <div class="error-message" id="error-message"></div>

        <label>Job No (Auto):</label>
        <input type="text" id="auto-job-no" value="<?php echo $autoJobNo; ?>" readonly>

        <label>Job No:</label>
        <select id="job-no-select" style="width: 100%">
            <option value="">Select a Job No</option>
            <?php foreach ($jobNos as $jobNo): ?>
            <option value="<?php echo $jobNo; ?>">
                <?php echo $jobNo; ?>
            </option>
            <?php endforeach; ?>
        </select>

        <label>Machine No:</label>
        <select id="machine-no">
            <option value="">Select Machine</option>
            <?php foreach ($machines as $machine): ?>
            <option value="<?php echo $machine; ?>">
                <?php echo htmlspecialchars($machine); ?>
            </option>
            <?php endforeach; ?>
        </select>

        <label>Finished Good:</label>
        <select id="finished-good">
            <option value="">Select Finished Good</option>
            <?php foreach ($finishedGoods as $fg): ?>
            <option value="<?php echo $fg; ?>">
                <?php echo $fg; ?>
            </option>
            <?php endforeach; ?>
        </select>

        <label>Unit:</label>
        <select id="main-unit-select">
            <option value="">Select Unit</option>
            <?php foreach ($units as $unit): ?>
            <option value="<?php echo $unit; ?>"><?php echo $unit; ?></option>
            <?php endforeach; ?>
        </select>

        <h2 style="font-size: 1.2rem; color: #2b6cb0; margin: 1.5rem 0;">Add New BOM Entries</h2>
        <table id="bom-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Day</th>
                    <th>Raw Material</th>
                    <th>Unit</th>
                    <th>Qty</th>
                    <th>Amount</th>
                    <th>Density Conversion</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="bom-table-body"></tbody>
        </table>
        <div class="total-qty" id="total-qty">Total Qty: 0.00</div>
        <button class="btn btn-accent" onclick="addRow()">+ Add Row</button>
        <button class="btn btn-primary" onclick="saveBOM()">Save BOM</button>

        <h2 style="font-size: 1.2rem; color: #2b6cb0; margin: 2rem 0 1rem;">Existing BOM Entries</h2>
        <table id="summary-table" class="summary-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Raw Material</th>
                    <th>Unit</th>
                    <th>Qty</th>
                </tr>
            </thead>
            <tbody id="summary-body"></tbody>
        </table>
    </div>

    <div class="modal" id="status-modal">
        <div class="modal-content">
            <span class="close" onclick="closeStatusModal()">×</span>
            <h2>BOM Status Management</h2>
            <div class="bom-list" id="bom-list">
                <?php foreach ($allBOMs as $bom): ?>
                    <div class="bom-item">
                        <span>Job No: <?php echo $bom['job_no']; ?> | Machine: <?php echo htmlspecialchars($bom['machine_no']); ?> | Finished Good: <?php echo htmlspecialchars($bom['finished_good']); ?></span>
                        <div class="status-buttons">
                            <button class="btn-status btn-processing <?php echo ($bom['status'] == 'Processing' ? 'active' : ''); ?>" 
                                    onclick="updateStatus(<?php echo $bom['job_no']; ?>, 'Processing')">Processing</button>
                            <button class="btn-status btn-completed <?php echo ($bom['status'] == 'Completed' ? 'active' : ''); ?>" 
                                    onclick="updateStatus(<?php echo $bom['job_no']; ?>, 'Completed')">Completed</button>
                            <button class="btn-status btn-cancelled <?php echo ($bom['status'] == 'Cancelled' ? 'active' : ''); ?>" 
                                    onclick="updateStatus(<?php echo $bom['job_no']; ?>, 'Cancelled')">Cancelled</button>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </div>

    <!-- BOM JavaScript -->
    <script>
    // JavaScript will be included via a separate file
    const BASE_URL = '<?php echo isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http"; ?>://<?php echo $_SERVER['HTTP_HOST']; ?>/Azizabad/controllers/entry/bom/index.php';
    const AUTO_JOB_NO = <?php echo $autoJobNo; ?>;
    const RAW_MATERIALS = <?php echo json_encode($rawMaterials); ?>;
    </script>
    <script src="../../../assets/js/entry/bom/bom.js"></script>
</body>

</html>