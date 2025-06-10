<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Extraction - Azizabad Inventory Management</title>
    
    <!-- CSS files -->
    <link rel="stylesheet" href="../../../assets/css/dashboard.css">
    <link rel="stylesheet" href="../../../assets/css/entry/extraction/extraction.css">
    <link rel="stylesheet" href="../../../assets/css/entry/extraction/bag.css">
    <link rel="stylesheet" href="../../../assets/css/entry/extraction/css-man.css">
    <link rel="stylesheet" href="../../../assets/css/entry/extraction/man-bag-interaction.css">
    <link rel="stylesheet" href="../../../assets/css/entry/extraction/factory-machine.css">
    <link rel="stylesheet" href="../../../assets/css/entry/extraction/factory-machine-animations.css">
    <link rel="stylesheet" href="../../../assets/css/entry/extraction/man-machine-interaction.css">
    
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@500;600;700&display=swap" rel="stylesheet">
    
    <!-- jQuery and Select2 -->
    <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
</head>
<body>
    <!-- Overall wrapper for the layout -->
    <div class="wrapper">
        <!-- Sidebar Navigation - positioned left as defined in dashboard.css -->
        <nav class="navbar">
            <div class="navbar-brand">
                <img src="../../../assets/images/logo.png" alt="Azizabad Logo" class="navbar-logo">
                <span class="navbar-title">Azizabad</span>
            </div>
            
            <ul class="navbar-menu">
                <li class="navbar-item">
                    <a href="../../../dashboard.php" class="navbar-link">
                        <i class="fas fa-home"></i>
                        <span>Dashboard</span>
                    </a>
                </li>
                <li class="navbar-item active">
                    <a href="#" class="navbar-link">
                        <i class="fas fa-box-open"></i>
                        <span>Inventory</span>
                    </a>
                    <ul class="submenu">
                        <li><a href="../production/index.php">Production</a></li>
                        <li class="active"><a href="./index.php">Extraction</a></li>
                        <li><a href="../dispatch/index.php">Dispatch</a></li>
                    </ul>
                </li>
                <li class="navbar-item">
                    <a href="../../../reports.php" class="navbar-link">
                        <i class="fas fa-chart-bar"></i>
                        <span>Reports</span>
                    </a>
                </li>
                <li class="navbar-item">
                    <a href="../../../settings.php" class="navbar-link">
                        <i class="fas fa-cog"></i>
                        <span>Settings</span>
                    </a>
                </li>
            </ul>
        </nav>

        <!-- Main content - with adjusted margin for sidebar -->
        <div class="main-content">
            <h1>Extraction</h1>
            
            <!-- Container for visual elements -->
            <div class="container">
                <!-- The bag and quantity -->
                <div class="bag">
                    <div class="bag-stitching"></div>
                </div>
                
                <div class="qty-container">
                    <div class="qty">Total Qty: <span id="qty">1000</span> kg</div>
                </div>
                
                <!-- The CSS man -->
                <div class="man-wrapper">
                    <div class="css-man">
                        <div class="body-core">
                            <div class="head">
                                <div class="hair"></div>
                                <div class="eye-left"></div>
                                <div class="eye-right"></div>
                                <div class="eyebrow-left"></div>
                                <div class="eyebrow-right"></div>
                                <div class="mouth"></div>
                                <div class="ear-left"></div>
                                <div class="ear-right"></div>
                            </div>
                            <div class="neck"></div>
                            <div class="torso">
                                <div class="button"></div>
                                <div class="button"></div>
                                <div class="button"></div>
                            </div>
                            <div class="hips"></div>
                        </div>
                        
                        <div class="limbs">
                            <!-- Arms -->
                            <div class="arm arm-left">
                                <div class="upper-arm"></div>
                                <div class="elbow"></div>
                                <div class="forearm"></div>
                                <div class="wrist"></div>
                                <div class="hand">
                                    <div class="thumb"></div>
                                    <div class="fingers">
                                        <div class="finger">
                                            <div class="nail"></div>
                                        </div>
                                        <div class="finger">
                                            <div class="nail"></div>
                                        </div>
                                        <div class="finger">
                                            <div class="nail"></div>
                                        </div>
                                        <div class="finger">
                                            <div class="nail"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="arm arm-right">
                                <div class="upper-arm"></div>
                                <div class="elbow"></div>
                                <div class="forearm"></div>
                                <div class="wrist"></div>
                                <div class="hand">
                                    <div class="thumb"></div>
                                    <div class="fingers">
                                        <div class="finger">
                                            <div class="nail"></div>
                                        </div>
                                        <div class="finger">
                                            <div class="nail"></div>
                                        </div>
                                        <div class="finger">
                                            <div class="nail"></div>
                                        </div>
                                        <div class="finger">
                                            <div class="nail"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Legs -->
                            <div class="leg leg-left">
                                <div class="thigh">
                                    <div class="thigh-muscle"></div>
                                    <div class="femur"></div>
                                </div>
                                <div class="knee">
                                    <div class="patella"></div>
                                    <div class="knee-ligament"></div>
                                </div>
                                <div class="calf">
                                    <div class="calf-muscle"></div>
                                    <div class="tibia"></div>
                                    <div class="fibula"></div>
                                </div>
                                <div class="ankle">
                                    <div class="joint-capsule"></div>
                                </div>
                                <div class="foot foot-left">
                                    <div class="shoe">
                                        <div class="toes">
                                            <div class="toe"></div>
                                            <div class="toe"></div>
                                            <div class="toe"></div>
                                            <div class="toe"></div>
                                            <div class="toe"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="leg leg-right">
                                <div class="thigh">
                                    <div class="thigh-muscle"></div>
                                    <div class="femur"></div>
                                </div>
                                <div class="knee">
                                    <div class="patella"></div>
                                    <div class="knee-ligament"></div>
                                </div>
                                <div class="calf">
                                    <div class="calf-muscle"></div>
                                    <div class="tibia"></div>
                                    <div class="fibula"></div>
                                </div>
                                <div class="ankle">
                                    <div class="joint-capsule"></div>
                                </div>
                                <div class="foot foot-right">
                                    <div class="shoe">
                                        <div class="toes">
                                            <div class="toe"></div>
                                            <div class="toe"></div>
                                            <div class="toe"></div>
                                            <div class="toe"></div>
                                            <div class="toe"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Factory machine -->
                <div class="factory-machine">
                    <div class="machine-body">
                        <div class="machine-panel">
                            <div class="control-lights">
                                <div class="light light-green"></div>
                                <div class="light light-yellow"></div>
                                <div class="light light-red"></div>
                            </div>
                            <div class="control-buttons">
                                <div class="button"></div>
                                <div class="button button-main"></div>
                            </div>
                            <div class="display-screen">
                                <div class="screen-content"></div>
                            </div>
                        </div>
                        
                        <div class="machine-components">
                            <div class="gears">
                                <div class="gear gear-large"></div>
                                <div class="gear gear-medium"></div>
                                <div class="gear gear-small"></div>
                            </div>
                            <div class="pistons">
                                <div class="piston piston-left">
                                    <div class="piston-rod"></div>
                                    <div class="piston-head"></div>
                                </div>
                                <div class="piston piston-right">
                                    <div class="piston-rod"></div>
                                    <div class="piston-head"></div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="conveyor">
                            <div class="conveyor-belt">
                                <div class="belt-section"></div>
                                <div class="belt-section"></div>
                                <div class="belt-section"></div>
                                <div class="belt-section"></div>
                                <div class="belt-section"></div>
                            </div>
                            <div class="product-output">
                                <div class="product-item"></div>
                            </div>
                        </div>
                        
                        <div class="machine-housing">
                            <div class="panel-seams"></div>
                            <div class="vents">
                                <div class="vent vent-1"></div>
                                <div class="vent vent-2"></div>
                                <div class="vent vent-3"></div>
                            </div>
                            <div class="rivets">
                                <div class="rivet rivet-1"></div>
                                <div class="rivet rivet-2"></div>
                                <div class="rivet rivet-3"></div>
                                <div class="rivet rivet-4"></div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="machine-base">
                        <div class="support-legs">
                            <div class="leg leg-1"></div>
                            <div class="leg leg-2"></div>
                            <div class="leg leg-3"></div>
                            <div class="leg leg-4"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Form fields -->
            <div class="fields-container">
                <form id="extractionForm" class="fields">
                    <div>
                        <label for="extractionDate">Extraction Date</label>
                        <input type="date" id="extractionDate" name="extractionDate" value="<?php echo date('Y-m-d'); ?>" required>
                    </div>
                    
                    <div>
                        <label for="jobNo">Job No</label>
                        <select id="jobNo" name="jobNo" class="searchable-select" required>
                            <option value="">Select a Job No</option>
                        </select>
                    </div>
                    
                    <div>
                        <label for="machineNo">Machine No</label>
                        <input type="text" id="machineNo" name="machineNo" readonly>
                    </div>
                    
                    <div>
                        <label for="finishedGood">Finished Good</label>
                        <input type="text" id="finishedGood" name="finishedGood" readonly>
                    </div>
                    
                    <div>
                        <label for="wastage">Wastage (kg)</label>
                        <input type="number" id="wastage" name="wastage" min="0" step="0.01">
                    </div>
                    
                    <div>
                        <label for="extractionQty">Extraction Qty (kg)</label>
                        <input type="number" id="extractionQty" name="extractionQty" min="1" required>
                    </div>
                    
                    <div class="button-container">
                        <a href="../../../dashboard.php" class="action-button back-button">Back</a>
                        <button type="button" id="extractButton" class="action-button extract-button">Extract</button>
                    </div>
                </form>
            </div>
            
            <!-- Sound effect for extraction -->
            <audio id="plopSound" src="../../../assets/audio/plop.mp3" preload="auto"></audio>
        </div>
    </div>
    
    <!-- Font Awesome -->
    <script src="https://kit.fontawesome.com/a076d05399.js" crossorigin="anonymous"></script>
    
    <!-- Custom scripts -->
    <script src="../../../assets/js/entry/extraction/extraction-api.js"></script>
    <script>
        $(document).ready(function() {
            // Initialize Select2
            $('.searchable-select').select2({
                placeholder: "Select a Job No",
                allowClear: true
            });
            
            // Load available jobs
            loadJobs();
            
            // Event listener for job selection
            $('#jobNo').on('change', function() {
                const jobId = $(this).val();
                if (jobId) {
                    loadMachineDetails(jobId);
                } else {
                    $('#machineNo').val('');
                    $('#finishedGood').val('');
                }
            });
            
            // Event listener for extraction button
            $('#extractButton').on('click', function() {
                // Validate form
                const form = document.getElementById('extractionForm');
                if (!form.checkValidity()) {
                    form.reportValidity();
                    return;
                }
                
                // Trigger extraction animation and save data
                $('.css-man').addClass('extracting');
                $('.factory-machine').addClass('being-operated running');
                
                // Save extraction
                saveExtraction();
                
                // Remove animation classes after animation completes
                setTimeout(function() {
                    $('.css-man').removeClass('extracting');
                    $('.factory-machine').removeClass('being-operated running');
                }, 4000);
            });
        });
    </script>
</body>
</html>