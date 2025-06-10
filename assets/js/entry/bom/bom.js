$(document).ready(function () {
    // Initialize Select2 for static dropdowns only in the document ready handler
    $('#job-no-select, #machine-no, #finished-good, #main-unit-select').select2({
        placeholder: "Select an option",
        allowClear: true,
        width: '100%'
    });

    // Initialize BOM table with one empty row
    resetBOMTable();

    // Handle job number selection
    $('#job-no-select').on('change', function () {
        // Skip if we're in the middle of resetting the form
        if (window._isResetting) return;
        
        const jobNo = $(this).val();
        if (jobNo) {
            // Clear the auto job number field when a job is selected
            $('#auto-job-no').val('');
            // Fetch BOM details to populate all fields
            fetchBOMDetails(jobNo);
        } else {
            // Reset form and show the auto job number again
            $('#auto-job-no').val(AUTO_JOB_NO);
            resetForm();
        }
    });

    // Set default date
    setDefaultDate();
});

function setDefaultDate() {
    const today = new Date().toISOString().split('T')[0];
    $('.date-field').each(function () {
        if (!$(this).val()) {
            $(this).val(today);
            updateDay(this);
        }
    });
}

function updateDay(dateInput) {
    const date = new Date(dateInput.value);
    if (!isNaN(date)) {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const day = days[date.getDay()];
        $(dateInput).closest('tr').find('.day-select').val(day).trigger('change');
    }
}

function addRow() {
    const tbody = $('#bom-table-body');
    let rawMaterialOptions = '<option value="">Select Material</option>';
    
    // Store material prices in data attributes
    RAW_MATERIALS.forEach(function(material) {
        rawMaterialOptions += `<option value="${material.name}" data-price="${material.pprice || 0}">${material.name}</option>`;
    });
    
    let unitOptions = '<option value="">Select Unit</option>';
    UNITS.forEach(function(unit) {
        unitOptions += `<option value="${unit}">${unit}</option>`;
    });
    
    const row = $(`
        <tr>
            <td><input type="date" class="date-field" onchange="updateDay(this)" /></td>
            <td><select class="day-select">
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
            </select></td>
            <td><select class="raw-material-select" onchange="updateAmount(this)">
                ${rawMaterialOptions}
            </select></td>
            <td>
                <div class="td-unit-container">
                    <select class="unit-select">
                        ${unitOptions}
                    </select>
                    <button type="button" class="btn btn-small btn-accent unit-control-btn" onclick="openAddUnitModal('row')">+</button>
                    <button type="button" class="btn btn-small btn-cancelled unit-control-btn" onclick="openDeleteUnitModal('row')">-</button>
                </div>
            </td>
            <td><input type="number" step="0.01" placeholder="Qty" class="qty-input" oninput="updateTotalDensity(); updateDensity(this); updateAmount(this);" /></td>
            <td><input type="number" step="0.01" placeholder="Amount" class="amount-input" readonly /></td>
            <td><input type="text" class="conversion-field" readonly /></td>
            <td><input type="number" step="0.01" placeholder="Density" class="density-input" /></td>
            <td class="row-controls">
                <button class="btn btn-small btn-cancelled" onclick="removeRow(this)">-</button>
            </td>
        </tr>
    `);
    tbody.append(row);
    row.find('.raw-material-select, .unit-select, .day-select').select2({
        placeholder: "Select an option",
        allowClear: true,
        width: '100%'
    });
    setDefaultDate();
    updateTotalDensity();
}

function removeRow(btn) {
    if ($('#bom-table-body tr').length > 1) {
        $(btn).closest('tr').remove();
        updateTotalDensity();
    } else {
        alert('At least one row is required.');
    }
}

function updateTotalDensity() {
    let total = 0;
    $('.conversion-field').each(function () {
        const conversion = parseFloat($(this).val()) || 0;
        total += conversion;
    });
    $('#total-qty').text(`Total Qty: ${total.toFixed(2)}`);
}

function updateDensity(input) {
    const qty = parseFloat($(input).val()) || 0;
    const unit = $(input).closest('tr').find('.unit-select').val();
    const densityField = $(input).closest('tr').find('.density-input');
    const conversionField = $(input).closest('tr').find('.conversion-field');
    
    if (unit && qty) {
        // Handle conversion locally for better performance
        let conversion = 0;
        
        switch(unit.toLowerCase()) {
            case 'gram':
                conversion = qty / 1000; // Convert grams to kg (1000g = 1kg)
                conversionField.val(conversion.toFixed(2));
                updateTotalDensity();
                break;
                
            case 'kilogram':
                conversion = qty; // Already in kg
                conversionField.val(conversion.toFixed(2));
                updateTotalDensity();
                break;
                
            case 'tonne':
                conversion = qty * 1000; // Convert tonnes to kg (1t = 1000kg)
                conversionField.val(conversion.toFixed(2));
                updateTotalDensity();
                break;
                
            case 'liter':
                const density = parseFloat(densityField.val()) || 1; // Default density to 1 if not specified
                conversion = qty * density; // Liters to KG: qty * density
                conversionField.val(conversion.toFixed(2));
                updateTotalDensity();
                break;
                
            default:
                // For unknown units, use the server calculation
                $.ajax({
                    url: BASE_URL,
                    method: 'POST',
                    data: { calculate_density: true, unit: unit, qty: qty },
                    success: function (response) {
                        if (response.success) {
                            conversionField.val(parseFloat(response.density).toFixed(2));
                            updateTotalDensity();
                        } else {
                            $('#error-message').text(response.message).show().delay(3000).fadeOut();
                        }
                    },
                    error: function () {
                        $('#error-message').text('Error calculating conversion').show().delay(3000).fadeOut();
                    }
                });
        }
    } else {
        conversionField.val('');
        updateTotalDensity();
    }
}

// Calculate and update amount based on raw material price and quantity
function updateAmount(element) {
    const row = $(element).closest('tr');
    const rawMaterialSelect = row.find('.raw-material-select');
    const qtyInput = row.find('.qty-input');
    const amountInput = row.find('.amount-input');
    
    // Get the price from data attribute of selected option
    const selectedOption = rawMaterialSelect.find('option:selected');
    const price = parseFloat(selectedOption.data('price')) || 0;
    const qty = parseFloat(qtyInput.val()) || 0;
    
    // Calculate and set the amount
    const amount = price * qty;
    amountInput.val(amount.toFixed(2));
}

// Add event listener for unit selection changes
$(document).on('change', '.unit-select', function() {
    const unitValue = $(this).val();
    const row = $(this).closest('tr');
    const densityField = row.find('.density-input');
    const qtyField = row.find('.qty-input');
    
    // Toggle density field visibility based on unit selection
    if (unitValue && unitValue.toLowerCase() === 'liters') {
        row.addClass('liter-selected');
        // Trigger recalculation when density field is shown and already has a qty
        if (parseFloat(qtyField.val()) > 0) {
            // Add small delay to ensure the field is visible first
            setTimeout(() => updateDensity(qtyField[0]), 100);
        }
    } else {
        row.removeClass('liter-selected');
        // Trigger recalculation with the new unit
        if (parseFloat(qtyField.val()) > 0) {
            updateDensity(qtyField[0]);
        }
    }
});

// Also listen for changes in the density field to update conversion
$(document).on('input', '.density-input', function() {
    const qtyField = $(this).closest('tr').find('.qty-input');
    updateDensity(qtyField[0]);
});

function openStatusModal() {
    $('#status-modal').show();
}

function closeStatusModal() {
    $('#status-modal').hide();
}

function updateStatus(jobNo, status) {
    $.ajax({
        url: BASE_URL,
        method: 'POST',
        data: { update_status: true, job_no: jobNo, status: status },
        success: function (response) {
            if (response.success) {
                $(`#bom-list .bom-item:contains('Job No: ${jobNo}') .btn-status`).removeClass('active');
                $(`#bom-list .bom-item:contains('Job No: ${jobNo}') .btn-${status.toLowerCase()}`).addClass('active');
                alert('Status updated to ' + status);
                // Refresh machine dropdown
                $.ajax({
                    url: BASE_URL,
                    method: 'POST',
                    data: { fetch_machines: true },
                    success: function (response) {
                        if (response.success) {
                            $('#machine-no').empty().append('<option value="">Select Machine</option>');
                            response.machines.forEach(machine => {
                                $('#machine-no').append(`<option value="${machine.id}">${machine.id} - ${machine.machine_name || 'N/A'} (${machine.machine_type || 'Unknown Type'})</option>`);
                            });
                            $('#machine-no').trigger('change');
                        }
                    }
                });
            } else {
                $('#error-message').text(response.message).show().delay(3000).fadeOut();
            }
        },
        error: function () {
            $('#error-message').text('Error updating status').show().delay(3000).fadeOut();
        }
    });
}

function fetchBOMDetails(jobNo) {
    $.ajax({
        url: BASE_URL,
        method: 'POST',
        data: { fetch_bom: true, job_no: jobNo },
        dataType: 'json',
        success: function (response) {
            if (response.success && response.header) {
                // Populate header fields from bom_headers table
                $('#machine-no').val(response.header.machine_no).trigger('change');
                $('#finished-good').val(response.header.finished_good).trigger('change');
                $('#main-unit-select').val(response.header.unit).trigger('change');
                $('#total-qty').text(`Total Qty: ${parseFloat(response.header.total_qty || 0).toFixed(2)}`);

                // Populate summary table with entries
                const summaryBody = $('#summary-body');
                summaryBody.empty();
                if (response.entries.length > 0) {
                    response.entries.forEach(entry => {
                        summaryBody.append(`
                            <tr>
                                <td>${entry.date}</td>
                                <td>${entry.raw_material}</td>
                                <td>${entry.unit}</td>
                                <td>${parseFloat(entry.qty).toFixed(2)}</td>
                            </tr>
                        `);
                    });
                }

                // Reset BOM table to one empty row
                resetBOMTable();
            } else {
                resetForm();
                $('#error-message').text(response.message || 'No BOM data found').show().delay(3000).fadeOut();
            }
        },
        error: function (xhr, status, error) {
            resetForm();
            console.error("AJAX Error:", error, xhr.responseText);
            $('#error-message').text('Error fetching BOM data: ' + error).show().delay(3000).fadeOut();
        }
    });
}

function resetBOMTable() {
    const tbody = $('#bom-table-body');
    tbody.empty();
    
    // No longer adding a default row - table will start empty
    updateTotalDensity();
}

function resetForm() {
    // Use a flag to avoid triggering infinite recursion
    window._isResetting = true;
    
    // Clear selections without triggering change events
    $('#machine-no').val('');
    $('#finished-good').val('');
    $('#main-unit-select').val('');
    $('#job-no-select').val('');
    
    // Update select2 appearance without triggering change events
    $('#machine-no').trigger('change.select2');
    $('#finished-good').trigger('change.select2');
    $('#main-unit-select').trigger('change.select2');
    $('#job-no-select').trigger('change.select2');
    
    $('#auto-job-no').val(AUTO_JOB_NO);
    $('#summary-body').empty();
    resetBOMTable();
    updateTotalDensity();
    
    // Reset the flag
    window._isResetting = false;
}

function saveBOM() {
    const jobNo = $('#job-no-select').val() || $('#auto-job-no').val();
    const machineNo = $('#machine-no').val();
    const finishedGood = $('#finished-good').val();
    const unit = $('#main-unit-select').val();
    const bomEntries = [];

    $('#bom-table-body tr').each(function () {
        const entry = {
            date: $(this).find('.date-field').val(),
            day: $(this).find('.day-select').val(),
            raw_material: $(this).find('.raw-material-select').val(),
            unit: $(this).find('.unit-select').val(),
            qty: parseFloat($(this).find('.qty-input').val()) || 0,
            amount: parseFloat($(this).find('.amount-input').val()) || 0,
            density_conversion: parseFloat($(this).find('.conversion-field').val()) || 0,
            density: parseFloat($(this).find('.density-input').val()) || 0
        };
        if (entry.date && entry.raw_material && entry.unit && entry.qty) {
            bomEntries.push(entry);
        }
    });

    if (bomEntries.length === 0) {
        $('#error-message').text('Please add at least one valid BOM entry with Date, Raw Material, Unit, and Qty.').show().delay(3000).fadeOut();
        return;
    }

    $.ajax({
        url: BASE_URL,
        method: 'POST',
        data: {
            save_bom: true,
            job_no: jobNo,
            machine_no: machineNo,
            finished_good: finishedGood,
            main_unit: unit,
            bom_entries: JSON.stringify(bomEntries)
        },
        success: function (response) {
            if (response.success) {
                $('#success-message').show().delay(5000).fadeOut(function() {
                    window.location.reload();
                });
            } else {
                $('#error-message').text(response.message).show().delay(3000).fadeOut();
            }
        },
        error: function (xhr) {
            $('#error-message').text('Error saving BOM: ' + (xhr.responseJSON ? xhr.responseJSON.message : 'Unknown error')).show().delay(3000).fadeOut();
        }
    });
}