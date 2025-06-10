// Setup Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // DOM elements
  const setupCards = document.querySelectorAll('.setup-card');
  const setupModal = document.getElementById('setup-modal');
  const closeModal = document.querySelector('.close-modal');
  const setupFormTitle = document.getElementById('setup-form-title');
  const setupFormContainer = document.getElementById('setup-form-container');
  const saveSetupBtn = document.getElementById('save-setup');
  const cancelSetupBtn = document.getElementById('cancel-setup');
  const searchInput = document.getElementById('setup-search-input');

  // Setup form data - would normally be fetched from a database
  const setupForms = {
    'company-info': {
      title: 'Company Information',
      form: `
        <div class="form-section">
          <h3 class="form-section-title">Basic Information</h3>
          <div class="form-row">
            <div class="form-group">
              <label for="company-name">Company Name</label>
              <input type="text" id="company-name" value="InnovaTech Solutions">
            </div>
            <div class="form-group">
              <label for="company-short-name">Short Name</label>
              <input type="text" id="company-short-name" value="InnovaTech">
            </div>
          </div>
          <div class="form-group">
            <label for="company-tagline">Tagline/Slogan</label>
            <input type="text" id="company-tagline" value="Innovative Solutions for Tomorrow">
          </div>
          <div class="form-group">
            <label for="company-logo">Company Logo</label>
            <input type="file" id="company-logo" accept="image/*">
            <div class="helper-text">Recommended size: 200x60 pixels, max 2MB</div>
          </div>
        </div>
        <div class="form-section">
          <h3 class="form-section-title">Contact Information</h3>
          <div class="form-row">
            <div class="form-group">
              <label for="company-email">Email Address</label>
              <input type="email" id="company-email" value="info@innovatech.com">
            </div>
            <div class="form-group">
              <label for="company-phone">Phone Number</label>
              <input type="text" id="company-phone" value="+1 (555) 123-4567">
            </div>
          </div>
          <div class="form-group">
            <label for="company-website">Website</label>
            <input type="text" id="company-website" value="https://www.innovatech.com">
          </div>
          <div class="form-group">
            <label for="company-address">Address</label>
            <textarea id="company-address">123 Tech Park Drive, Suite 500
Silicon Valley, CA 94025
United States</textarea>
          </div>
        </div>
        <div class="form-section">
          <h3 class="form-section-title">Business Information</h3>
          <div class="form-row">
            <div class="form-group">
              <label for="company-tax-id">Tax ID / VAT Number</label>
              <input type="text" id="company-tax-id" value="US-TAX-12345678">
            </div>
            <div class="form-group">
              <label for="company-reg-number">Registration Number</label>
              <input type="text" id="company-reg-number" value="REG-987654321">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="company-founded">Founded Date</label>
              <input type="date" id="company-founded" value="2010-06-15">
            </div>
            <div class="form-group">
              <label for="company-employees">Number of Employees</label>
              <input type="number" id="company-employees" value="250">
            </div>
          </div>
        </div>
      `
    },
    'chart-of-accounts': {
      title: 'Chart of Accounts',
      form: `
        <div class="form-section">
          <h3 class="form-section-title">Account Structure</h3>
          <div class="form-group">
            <label for="account-digits">Account Code Length</label>
            <select id="account-digits">
              <option value="4">4 Digits</option>
              <option value="5" selected>5 Digits</option>
              <option value="6">6 Digits</option>
              <option value="7">7 Digits</option>
            </select>
            <div class="helper-text">Number of digits in account codes</div>
          </div>
          <div class="form-group">
            <label for="account-separator">Account Code Separator</label>
            <select id="account-separator">
              <option value="-" selected>Hyphen (-)</option>
              <option value=".">Dot (.)</option>
              <option value="/">Slash (/)</option>
              <option value="">None</option>
            </select>
          </div>
        </div>
        <div class="form-section">
          <h3 class="form-section-title">Default Account Groups</h3>
          <div class="form-group">
            <label>Enable Standard Account Groups</label>
            <div class="checkbox-group">
              <div class="checkbox-item">
                <input type="checkbox" id="group-assets" checked>
                <label for="group-assets">Assets (10000-19999)</label>
              </div>
              <div class="checkbox-item">
                <input type="checkbox" id="group-liabilities" checked>
                <label for="group-liabilities">Liabilities (20000-29999)</label>
              </div>
              <div class="checkbox-item">
                <input type="checkbox" id="group-equity" checked>
                <label for="group-equity">Equity (30000-39999)</label>
              </div>
              <div class="checkbox-item">
                <input type="checkbox" id="group-income" checked>
                <label for="group-income">Income (40000-49999)</label>
              </div>
              <div class="checkbox-item">
                <input type="checkbox" id="group-expenses" checked>
                <label for="group-expenses">Expenses (50000-59999)</label>
              </div>
            </div>
          </div>
        </div>
        <div class="form-section">
          <h3 class="form-section-title">Default Accounts</h3>
          <div class="form-row">
            <div class="form-group">
              <label for="default-cash">Default Cash Account</label>
              <select id="default-cash">
                <option value="10100" selected>10100 - Cash on Hand</option>
                <option value="10200">10200 - Cash at Bank</option>
                <option value="10300">10300 - Petty Cash</option>
              </select>
            </div>
            <div class="form-group">
              <label for="default-receivable">Default Accounts Receivable</label>
              <select id="default-receivable">
                <option value="11000" selected>11000 - Accounts Receivable</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="default-payable">Default Accounts Payable</label>
              <select id="default-payable">
                <option value="20100" selected>20100 - Accounts Payable</option>
              </select>
            </div>
            <div class="form-group">
              <label for="default-sales">Default Sales Account</label>
              <select id="default-sales">
                <option value="40100" selected>40100 - Sales Revenue</option>
                <option value="40200">40200 - Service Revenue</option>
              </select>
            </div>
          </div>
        </div>
      `
    },
    'user-roles': {
      title: 'User Roles & Permissions',
      form: `
        <div class="form-section">
          <h3 class="form-section-title">Role Management</h3>
          <div class="form-group">
            <label for="role-select">Select Role to Edit</label>
            <select id="role-select">
              <option value="admin">Administrator</option>
              <option value="manager">Manager</option>
              <option value="accountant">Accountant</option>
              <option value="sales">Sales Representative</option>
              <option value="inventory">Inventory Clerk</option>
              <option value="custom">+ Create New Role</option>
            </select>
          </div>
          <div id="new-role-name" class="form-group" style="display: none;">
            <label for="role-name">New Role Name</label>
            <input type="text" id="role-name" placeholder="Enter role name">
          </div>
        </div>
        <div class="form-section">
          <h3 class="form-section-title">Module Permissions</h3>
          <table class="permissions-table">
            <thead>
              <tr>
                <th>Module</th>
                <th>View</th>
                <th>Create</th>
                <th>Edit</th>
                <th>Delete</th>
                <th>Approve</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Customer Management</td>
                <td><input type="checkbox" checked></td>
                <td><input type="checkbox" checked></td>
                <td><input type="checkbox" checked></td>
                <td><input type="checkbox"></td>
                <td><input type="checkbox"></td>
              </tr>
              <tr>
                <td>Vendor Management</td>
                <td><input type="checkbox" checked></td>
                <td><input type="checkbox" checked></td>
                <td><input type="checkbox" checked></td>
                <td><input type="checkbox"></td>
                <td><input type="checkbox"></td>
              </tr>
              <tr>
                <td>Sales & Invoicing</td>
                <td><input type="checkbox" checked></td>
                <td><input type="checkbox" checked></td>
                <td><input type="checkbox" checked></td>
                <td><input type="checkbox"></td>
                <td><input type="checkbox" checked></td>
              </tr>
              <tr>
                <td>Purchasing</td>
                <td><input type="checkbox" checked></td>
                <td><input type="checkbox" checked></td>
                <td><input type="checkbox"></td>
                <td><input type="checkbox"></td>
                <td><input type="checkbox" checked></td>
              </tr>
              <tr>
                <td>Inventory</td>
                <td><input type="checkbox" checked></td>
                <td><input type="checkbox"></td>
                <td><input type="checkbox"></td>
                <td><input type="checkbox"></td>
                <td><input type="checkbox"></td>
              </tr>
              <tr>
                <td>Accounting</td>
                <td><input type="checkbox" checked></td>
                <td><input type="checkbox"></td>
                <td><input type="checkbox"></td>
                <td><input type="checkbox"></td>
                <td><input type="checkbox"></td>
              </tr>
              <tr>
                <td>Reports</td>
                <td><input type="checkbox" checked></td>
                <td><input type="checkbox"></td>
                <td><input type="checkbox"></td>
                <td><input type="checkbox"></td>
                <td><input type="checkbox"></td>
              </tr>
              <tr>
                <td>System Setup</td>
                <td><input type="checkbox"></td>
                <td><input type="checkbox"></td>
                <td><input type="checkbox"></td>
                <td><input type="checkbox"></td>
                <td><input type="checkbox"></td>
              </tr>
            </tbody>
          </table>
        </div>
      `
    },
    'machine-types': {
      title: 'Machine Types',
      form: `
        <div class="form-section">
          <h3 class="form-section-title">Machine Type Categories</h3>
          <div class="form-group">
            <label for="machine-category-select">Existing Machine Categories</label>
            <select id="machine-category-select">
              <option value="production">Production Machines</option>
              <option value="packaging">Packaging Equipment</option>
              <option value="transport">Material Transport</option>
              <option value="testing">Quality Testing Equipment</option>
              <option value="custom">+ Add New Category</option>
            </select>
          </div>
          <div id="new-category-name" class="form-group" style="display: none;">
            <label for="category-name">New Category Name</label>
            <input type="text" id="category-name" placeholder="Enter category name">
          </div>
        </div>
        <div class="form-section">
          <h3 class="form-section-title">Machine Type Details</h3>
          <div class="form-row">
            <div class="form-group">
              <label for="machine-type-name">Machine Type Name</label>
              <input type="text" id="machine-type-name" placeholder="e.g. CNC Milling Machine">
            </div>
            <div class="form-group">
              <label for="machine-type-code">Type Code</label>
              <input type="text" id="machine-type-code" placeholder="e.g. CNC-01">
            </div>
          </div>
          <div class="form-group">
            <label for="machine-type-description">Description</label>
            <textarea id="machine-type-description" placeholder="Describe the machine type and its general purpose"></textarea>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="default-maintenance-cycle">Default Maintenance Cycle (days)</label>
              <input type="number" id="default-maintenance-cycle" value="90">
              <div class="helper-text">Recommended maintenance interval in days</div>
            </div>
            <div class="form-group">
              <label for="estimated-lifetime">Estimated Lifetime (years)</label>
              <input type="number" id="estimated-lifetime" value="10">
            </div>
          </div>
        </div>
        <div class="form-section">
          <h3 class="form-section-title">Specification Parameters</h3>
          <p class="helper-text">Define the specification fields that will be tracked for this machine type</p>
          <div id="specification-fields">
            <div class="specification-row">
              <div class="form-row">
                <div class="form-group">
                  <label>Parameter Name</label>
                  <input type="text" placeholder="e.g. Power Rating" value="Power Rating">
                </div>
                <div class="form-group">
                  <label>Unit</label>
                  <input type="text" placeholder="e.g. kW" value="kW">
                </div>
                <div class="form-group" style="flex: 0 0 auto; align-self: flex-end;">
                  <button type="button" class="secondary-btn remove-spec-btn">Remove</button>
                </div>
              </div>
            </div>
            <div class="specification-row">
              <div class="form-row">
                <div class="form-group">
                  <label>Parameter Name</label>
                  <input type="text" placeholder="e.g. Maximum Capacity" value="Maximum Capacity">
                </div>
                <div class="form-group">
                  <label>Unit</label>
                  <input type="text" placeholder="e.g. kg/hr" value="kg/hr">
                </div>
                <div class="form-group" style="flex: 0 0 auto; align-self: flex-end;">
                  <button type="button" class="secondary-btn remove-spec-btn">Remove</button>
                </div>
              </div>
            </div>
          </div>
          <button type="button" id="add-spec-btn" class="secondary-btn" style="margin-top: 10px;">
            <i class="fas fa-plus"></i> Add Specification
          </button>
        </div>
      `
    },
    'machine-register': {
      title: 'Machine Register',
      form: `
        <div class="form-section">
          <h3 class="form-section-title">Machine Information</h3>
          <div class="form-row">
            <div class="form-group">
              <label for="machine-name">Machine Name</label>
              <input type="text" id="machine-name" placeholder="Enter machine name">
            </div>
            <div class="form-group">
              <label for="machine-id">Machine ID</label>
              <input type="text" id="machine-id" placeholder="Enter unique machine ID">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="machine-type">Machine Type</label>
              <select id="machine-type">
                <option value="">Select machine type</option>
                <option value="cnc-mill">CNC Milling Machine</option>
                <option value="laser-cutter">Laser Cutter</option>
                <option value="inj-molder">Injection Molder</option>
                <option value="3d-printer">3D Printer</option>
              </select>
            </div>
            <div class="form-group">
              <label for="machine-location">Location</label>
              <select id="machine-location">
                <option value="main-floor">Main Production Floor</option>
                <option value="secondary">Secondary Production Area</option>
                <option value="packaging">Packaging Department</option>
                <option value="warehouse">Warehouse</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label for="machine-description">Description</label>
            <textarea id="machine-description" placeholder="Enter machine description"></textarea>
          </div>
        </div>
        <div class="form-section">
          <h3 class="form-section-title">Manufacturer Information</h3>
          <div class="form-row">
            <div class="form-group">
              <label for="manufacturer">Manufacturer</label>
              <input type="text" id="manufacturer" placeholder="Enter manufacturer name">
            </div>
            <div class="form-group">
              <label for="model-number">Model Number</label>
              <input type="text" id="model-number" placeholder="Enter model number">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="serial-number">Serial Number</label>
              <input type="text" id="serial-number" placeholder="Enter serial number">
            </div>
            <div class="form-group">
              <label for="year-manufactured">Year Manufactured</label>
              <input type="number" id="year-manufactured" placeholder="Enter year" min="1900" max="2099">
            </div>
          </div>
        </div>
        <div class="form-section">
          <h3 class="form-section-title">Acquisition Details</h3>
          <div class="form-row">
            <div class="form-group">
              <label for="purchase-date">Purchase Date</label>
              <input type="date" id="purchase-date">
            </div>
            <div class="form-group">
              <label for="purchase-cost">Purchase Cost</label>
              <input type="number" id="purchase-cost" placeholder="Enter cost" step="0.01">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="warranty-expiry">Warranty Expiry</label>
              <input type="date" id="warranty-expiry">
            </div>
            <div class="form-group">
              <label for="asset-number">Asset Number</label>
              <input type="text" id="asset-number" placeholder="Enter asset tracking number">
            </div>
          </div>
        </div>
        <div class="form-section">
          <h3 class="form-section-title">Operational Parameters</h3>
          <div class="form-row">
            <div class="form-group">
              <label for="power-rating">Power Rating (kW)</label>
              <input type="number" id="power-rating" step="0.1">
            </div>
            <div class="form-group">
              <label for="max-capacity">Maximum Capacity (kg/hr)</label>
              <input type="number" id="max-capacity" step="0.1">
            </div>
          </div>
          <div class="form-group">
            <label for="operational-status">Operational Status</label>
            <select id="operational-status">
              <option value="operational">Operational</option>
              <option value="maintenance">Under Maintenance</option>
              <option value="repair">Needs Repair</option>
              <option value="inactive">Inactive</option>
              <option value="decommissioned">Decommissioned</option>
            </select>
          </div>
        </div>
      `
    },
    'maintenance-schedule': {
      title: 'Maintenance Schedule',
      form: `
        <div class="form-section">
          <h3 class="form-section-title">Maintenance Plan Setup</h3>
          <div class="form-group">
            <label for="plan-name">Maintenance Plan Name</label>
            <input type="text" id="plan-name" placeholder="Enter plan name">
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="plan-type">Plan Type</label>
              <select id="plan-type">
                <option value="preventive">Preventive Maintenance</option>
                <option value="predictive">Predictive Maintenance</option>
                <option value="corrective">Corrective Maintenance</option>
                <option value="condition">Condition-Based Maintenance</option>
              </select>
            </div>
            <div class="form-group">
              <label for="priority-level">Priority Level</label>
              <select id="priority-level">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>
        </div>
        <div class="form-section">
          <h3 class="form-section-title">Machine Selection</h3>
          <div class="form-group">
            <label>Select Machines for Maintenance Plan</label>
            <div class="checkbox-group">
              <div class="checkbox-item">
                <input type="checkbox" id="machine-1" checked>
                <label for="machine-1">CNC Mill - Floor 1 (M001)</label>
              </div>
              <div class="checkbox-item">
                <input type="checkbox" id="machine-2">
                <label for="machine-2">Laser Cutter - Precision Room (M002)</label>
              </div>
              <div class="checkbox-item">
                <input type="checkbox" id="machine-3">
                <label for="machine-3">Injection Molder - Production Line 2 (M003)</label>
              </div>
              <div class="checkbox-item">
                <input type="checkbox" id="machine-4" checked>
                <label for="machine-4">3D Printer - Prototyping Lab (M004)</label>
              </div>
              <div class="checkbox-item">
                <input type="checkbox" id="machine-5">
                <label for="machine-5">Conveyor Belt System - Main Floor (M005)</label>
              </div>
            </div>
          </div>
        </div>
        <div class="form-section">
          <h3 class="form-section-title">Schedule Configuration</h3>
          <div class="form-row">
            <div class="form-group">
              <label for="schedule-type">Schedule Type</label>
              <select id="schedule-type">
                <option value="fixed">Fixed Interval</option>
                <option value="calendar">Calendar Based</option>
                <option value="usage">Usage Based</option>
              </select>
            </div>
            <div class="form-group">
              <label for="interval-value">Interval</label>
              <div style="display: flex; gap: 10px;">
                <input type="number" id="interval-value" value="30" style="width: 70%;">
                <select id="interval-unit" style="width: 30%;">
                  <option value="days">Days</option>
                  <option value="weeks">Weeks</option>
                  <option value="months">Months</option>
                  <option value="hours">Operating Hours</option>
                </select>
              </div>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="next-date">Next Scheduled Date</label>
              <input type="date" id="next-date">
            </div>
            <div class="form-group">
              <label for="estimated-duration">Estimated Duration</label>
              <div style="display: flex; gap: 10px;">
                <input type="number" id="estimated-duration" value="4" style="width: 70%;">
                <select id="duration-unit" style="width: 30%;">
                  <option value="hours">Hours</option>
                  <option value="days">Days</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div class="form-section">
          <h3 class="form-section-title">Maintenance Tasks</h3>
          <div id="maintenance-tasks">
            <div class="task-row">
              <div class="form-row">
                <div class="form-group" style="flex: 2;">
                  <label>Task Description</label>
                  <input type="text" value="Check and tighten all fasteners and connections">
                </div>
                <div class="form-group" style="flex: 1;">
                  <label>Assigned To</label>
                  <select>
                    <option value="technician">Maintenance Technician</option>
                    <option value="engineer">Engineer</option>
                    <option value="operator">Machine Operator</option>
                    <option value="external">External Service</option>
                  </select>
                </div>
                <div class="form-group" style="flex: 0 0 auto; align-self: flex-end;">
                  <button type="button" class="secondary-btn remove-task-btn">Remove</button>
                </div>
              </div>
            </div>
            <div class="task-row">
              <div class="form-row">
                <div class="form-group" style="flex: 2;">
                  <label>Task Description</label>
                  <input type="text" value="Lubricate all moving parts according to manual specifications">
                </div>
                <div class="form-group" style="flex: 1;">
                  <label>Assigned To</label>
                  <select>
                    <option value="technician">Maintenance Technician</option>
                    <option value="engineer">Engineer</option>
                    <option value="operator">Machine Operator</option>
                    <option value="external">External Service</option>
                  </select>
                </div>
                <div class="form-group" style="flex: 0 0 auto; align-self: flex-end;">
                  <button type="button" class="secondary-btn remove-task-btn">Remove</button>
                </div>
              </div>
            </div>
            <div class="task-row">
              <div class="form-row">
                <div class="form-group" style="flex: 2;">
                  <label>Task Description</label>
                  <input type="text" value="Inspect and replace worn components if necessary">
                </div>
                <div class="form-group" style="flex: 1;">
                  <label>Assigned To</label>
                  <select>
                    <option value="technician">Maintenance Technician</option>
                    <option value="engineer">Engineer</option>
                    <option value="operator">Machine Operator</option>
                    <option value="external">External Service</option>
                  </select>
                </div>
                <div class="form-group" style="flex: 0 0 auto; align-self: flex-end;">
                  <button type="button" class="secondary-btn remove-task-btn">Remove</button>
                </div>
              </div>
            </div>
          </div>
          <button type="button" id="add-task-btn" class="secondary-btn" style="margin-top: 10px;">
            <i class="fas fa-plus"></i> Add Task
          </button>
        </div>
      `
    }
  };

  // Setup card click handlers
  setupCards.forEach(card => {
    card.addEventListener('click', function() {
      const setupType = this.getAttribute('data-setup');
      
      // Special handling for machine setup related cards
      if (setupType === 'machine-register') {
        // Open the machine register modal directly instead of redirecting
        openMachineRegisterModal();
        return;
      } else if (setupType === 'machine-types') {
        // Open the machine types modal directly instead of redirecting
        openMachineTypesModal();
        return;
      } else if (setupType === 'maintenance-schedule') {
        window.location.href = `/Azizabad/views/setup/machineSetup/index.html?type=${setupType}`;
        return;
      }
      
      openSetupForm(setupType);
    });
  });

  // Close modal handlers
  closeModal.addEventListener('click', closeSetupForm);
  cancelSetupBtn.addEventListener('click', closeSetupForm);
  window.addEventListener('click', function(event) {
    if (event.target === setupModal) {
      closeSetupForm();
    }
  });

  // Save setup handler
  saveSetupBtn.addEventListener('click', function() {
    // Show saving indicator
    saveSetupBtn.textContent = 'Saving...';
    saveSetupBtn.disabled = true;
    
    // Simulate API call delay
    setTimeout(() => {
      // Show success message
      showToast('Setup changes saved successfully');
      
      // Reset button
      saveSetupBtn.textContent = 'Save Changes';
      saveSetupBtn.disabled = false;
      
      // Close the modal
      closeSetupForm();
    }, 1000);
  });

  // Search functionality
  searchInput.addEventListener('keyup', function() {
    const searchTerm = this.value.toLowerCase();
    
    if (searchTerm.length < 2) {
      // Show all sections and cards if search is too short
      document.querySelectorAll('.setup-section').forEach(section => {
        section.style.display = 'block';
      });
      
      setupCards.forEach(card => {
        card.style.display = 'flex';
      });
      
      return;
    }
    
    // Hide all sections initially
    document.querySelectorAll('.setup-section').forEach(section => {
      section.style.display = 'none';
    });
    
    // Filter cards
    setupCards.forEach(card => {
      const title = card.querySelector('h3').textContent.toLowerCase();
      const description = card.querySelector('p').textContent.toLowerCase();
      
      if (title.includes(searchTerm) || description.includes(searchTerm)) {
        card.style.display = 'flex';
        // Show parent section
        card.closest('.setup-section').style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  });

  // Special event listeners for role selection
  document.addEventListener('change', function(e) {
    if (e.target && e.target.id === 'role-select') {
      const newRoleField = document.getElementById('new-role-name');
      if (e.target.value === 'custom') {
        newRoleField.style.display = 'block';
      } else {
        newRoleField.style.display = 'none';
      }
    }
  });

  // Function to open the setup form modal
  function openSetupForm(setupType) {
    // Default generic form if specific form not found
    const formData = setupForms[setupType] || {
      title: formatTitle(setupType),
      form: `
        <div class="form-message">
          <i class="fas fa-cog"></i>
          <h3>${formatTitle(setupType)} Setup</h3>
          <p>This setup module will be available soon.</p>
        </div>
        <style>
          .form-message {
            text-align: center;
            padding: 40px 0;
            color: #64748b;
          }
          
          .form-message i {
            font-size: 3rem;
            margin-bottom: 16px;
            color: #1E3A8A;
          }
          
          .form-message h3 {
            margin: 0 0 8px 0;
            color: #1E3A8A;
            font-size: 1.25rem;
          }
          
          .form-message p {
            margin: 0;
            font-size: 1rem;
          }
          
          .permissions-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 24px;
            font-size: 0.875rem;
          }
          
          .permissions-table th {
            text-align: left;
            padding: 12px 16px;
            background: #f1f5f9;
            color: #475569;
            font-weight: 600;
            border-bottom: 2px solid #e2e8f0;
          }
          
          .permissions-table td {
            padding: 12px 16px;
            border-bottom: 1px solid #e2e8f0;
            color: #334155;
          }
          
          .checkbox-group {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }
          
          .checkbox-item {
            display: flex;
            align-items: center;
            gap: 8px;
          }
          
          .checkbox-item input[type="checkbox"] {
            width: auto;
          }
        </style>
      `
    };
    
    // Set the modal title
    setupFormTitle.textContent = formData.title;
    
    // Set the form content
    setupFormContainer.innerHTML = formData.form;
    
    // Show the modal
    setupModal.style.display = 'block';
  }

  // Function to close the setup form modal
  function closeSetupForm() {
    setupModal.style.display = 'none';
  }

  // Helper function to format setup type as title
  function formatTitle(setupType) {
    return setupType
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  // Toast notification function
  function showToast(message) {
    // Create toast element if it doesn't exist
    let toast = document.querySelector('.toast-notification');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast-notification';
      document.body.appendChild(toast);
      
      // Add toast styles if not present
      if (!document.getElementById('toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
          .toast-notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #1E3A8A;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1001;
            font-size: 0.875rem;
            transition: all 0.3s ease;
            transform: translateY(100px);
            opacity: 0;
          }
          
          .toast-notification.show {
            transform: translateY(0);
            opacity: 1;
          }
        `;
        document.head.appendChild(style);
      }
    }
    
    // Set message and show toast
    toast.textContent = message;
    toast.classList.add('show');
    
    // Hide toast after 3 seconds
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  // Function to open the machine register modal
  function openMachineRegisterModal() {
    // Create modal if it doesn't exist yet
    if (!document.getElementById('machine-register-modal')) {
      createMachineRegisterModal();
    }
    
    // Show the modal
    document.getElementById('machine-register-modal').style.display = 'block';
  }

  // Function to create the machine register modal
  function createMachineRegisterModal() {
    const modal = document.createElement('div');
    modal.id = 'machine-register-modal';
    modal.className = 'modal';
    
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2 id="machine-modal-title">Add New Machine</h2>
          <span class="close-modal machine-modal-close">&times;</span>
        </div>
        <div class="modal-body">
          <form id="machineRegisterForm">
            <div class="form-group">
              <label for="machine-id">Machine ID</label>
              <input type="text" id="machine-id" readonly placeholder="Auto-generated ID">
            </div>
            
            <div class="form-group">
              <label for="machine-date">Date</label>
              <input type="date" id="machine-date" required>
            </div>
            
            <div class="form-group">
              <label for="machine-name-input">Machine Name</label>
              <input type="text" id="machine-name-input" required placeholder="Enter machine name">
            </div>
            
            <div class="form-group">
              <label for="machine-type-input">Machine Type</label>
              <input type="text" id="machine-type-input" required placeholder="Enter machine type">
            </div>
            
            <div class="form-group">
              <label for="machine-other">Other</label>
              <input type="text" id="machine-other" placeholder="Additional information">
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button id="save-machine" class="primary-btn">Save Machine</button>
          <button id="cancel-machine" class="secondary-btn">Cancel</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners for the modal
    document.querySelector('.machine-modal-close').addEventListener('click', closeMachineModal);
    document.getElementById('cancel-machine').addEventListener('click', closeMachineModal);
    document.getElementById('save-machine').addEventListener('click', saveMachine);
    
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('machine-date').value = today;
    
    // Close when clicking outside
    window.addEventListener('click', function(event) {
      if (event.target === modal) {
        closeMachineModal();
      }
    });
  }

  // Function to close the machine register modal
  function closeMachineModal() {
    document.getElementById('machine-register-modal').style.display = 'none';
  }

  // Function to save machine data
  function saveMachine() {
    // Get values from form
    const entry = {
      action: 'save',
      id: document.getElementById('machine-id').value.trim() || null,
      date: document.getElementById('machine-date').value,
      machine_name: document.getElementById('machine-name-input').value.trim(),
      machine_type: document.getElementById('machine-type-input').value.trim(),
      other: document.getElementById('machine-other').value.trim() || null
    };

    // Client-side validation
    if (!entry.date || !entry.machine_name || !entry.machine_type) {
      showToast('All required fields must be filled with valid values', 'error');
      return;
    }

    // Send AJAX request
    $.ajax({
      url: '/Azizabad/controllers/setup/machineSetup/index.php',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(entry),
      success: function(response) {
        // First clear any existing errors
        if (typeof response === 'string') {
          try {
            response = JSON.parse(response);
          } catch (e) {
            // If parsing fails, assume it's an error message
            showToast('Error: ' + response, 'error');
            return;
          }
        }
        
        if (response.success === true) {
          showToast('Machine saved successfully!', 'success');
          closeMachineModal();
          // Reset form
          document.getElementById('machineRegisterForm').reset();
          const today = new Date().toISOString().split('T')[0];
          document.getElementById('machine-date').value = today;
        } else {
          showToast('Error: ' + (response.error || 'Unknown server error'), 'error');
        }
      },
      error: function(xhr, status, error) {
        let errorMsg = 'Unknown error';
        try {
          const response = JSON.parse(xhr.responseText);
          errorMsg = response.error || errorMsg;
        } catch (e) {
          errorMsg = xhr.responseText || errorMsg;
        }
        showToast('Error saving machine: ' + errorMsg, 'error');
      }
    });
  }

  // Function to open the machine types modal
  function openMachineTypesModal() {
    // Create modal if it doesn't exist yet
    if (!document.getElementById('machine-types-modal')) {
      createMachineTypesModal();
    }
    
    // Show the modal and load machine types
    document.getElementById('machine-types-modal').style.display = 'block';
    loadMachineTypes();
  }

  // Function to create the machine types modal
  function createMachineTypesModal() {
    const modal = document.createElement('div');
    modal.id = 'machine-types-modal';
    modal.className = 'modal';
    
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2 id="machine-types-title">Existing Machines</h2>
          <span class="close-modal machine-types-close">&times;</span>
        </div>
        <div class="modal-body">
          <!-- Loading indicator -->
          <div id="types-loading-indicator" style="text-align: center; margin-top: 20px; display: none;">
            <p>Loading machine types...</p>
          </div>
          
          <!-- No data message -->
          <div id="no-types-message" style="text-align: center; margin-top: 20px; display: none;">
            <p>No machines found. Use "Machine Register" to add a new machine.</p>
          </div>
          
          <!-- Machine table directly embedded (no iframe) -->
          <table id="machine-types-table" style="margin-top: 20px; width: 100%;">
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Machine Name</th>
                <th>Machine Type</th>
                <th>Other</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="machine-types-body">
              <!-- Table rows will be populated by JavaScript -->
            </tbody>
          </table>
        </div>
        <div class="modal-footer">
          <button id="close-types" class="secondary-btn">Close</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners for the modal
    document.querySelector('.machine-types-close').addEventListener('click', closeMachineTypesModal);
    document.getElementById('close-types').addEventListener('click', closeMachineTypesModal);
    
    // Close when clicking outside
    window.addEventListener('click', function(event) {
      if (event.target === modal) {
        closeMachineTypesModal();
      }
    });
  }

  // Function to close the machine types modal
  function closeMachineTypesModal() {
    document.getElementById('machine-types-modal').style.display = 'none';
  }

  // Function to load machine types
  function loadMachineTypes() {
    const loadingIndicator = document.getElementById('types-loading-indicator');
    const noDataMessage = document.getElementById('no-types-message');
    const typesTable = document.getElementById('machine-types-table');
    const tableBody = document.getElementById('machine-types-body');
    
    // Show loading indicator
    loadingIndicator.style.display = 'block';
    noDataMessage.style.display = 'none';
    tableBody.innerHTML = ''; // Clear existing rows
    
    // Fetch machine data from the database
    $.ajax({
      url: '/Azizabad/controllers/setup/machineSetup/index.php',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ action: 'get_all' }),
      success: function(response) {
        console.log('Machine data response:', response);
        
        // Parse response if it's a string
        let machineData = response;
        if (typeof response === 'string') {
          try {
            machineData = JSON.parse(response);
          } catch (e) {
            console.error('Error parsing machine data response:', e);
            machineData = [];
          }
        }
        
        // Ensure machineData is an array
        if (!Array.isArray(machineData)) {
          if (typeof machineData === 'object' && machineData !== null) {
            // Convert object to array
            let machineArray = [];
            for (let key in machineData) {
              if (machineData.hasOwnProperty(key)) {
                machineArray.push(machineData[key]);
              }
            }
            machineData = machineArray;
          } else {
            machineData = []; // Fallback to empty array
          }
        }
        
        // Hide loading indicator
        loadingIndicator.style.display = 'none';
        
        // Show table or no-data message
        if (machineData.length === 0) {
          noDataMessage.style.display = 'block';
          typesTable.style.display = 'none';
        } else {
          // Populate table with machine data
          machineData.forEach(machine => {
            // Format the date nicely if it exists
            let formattedDate = machine.date || '';
            if (formattedDate) {
              try {
                const dateObj = new Date(formattedDate);
                if (!isNaN(dateObj.getTime())) {
                  formattedDate = dateObj.toISOString().split('T')[0];
                }
              } catch (e) {
                console.error('Error formatting date:', e);
              }
            }
            
            const row = document.createElement('tr');
            row.innerHTML = `
              <td>${machine.id || ''}</td>
              <td>${formattedDate}</td>
              <td>${machine.machine_name || ''}</td>
              <td>${machine.machine_type || ''}</td>
              <td>${machine.other || ''}</td>
              <td>
                <button class="btn-small" style="background-color: #3B82F6; color: white;" onclick="editMachine('${machine.id}')">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="btn-small" style="background-color: #EF4444; color: white;" onclick="deleteMachine('${machine.id}')">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            `;
            tableBody.appendChild(row);
          });
          
          typesTable.style.display = 'table';
          noDataMessage.style.display = 'none';
          
          // Add global functions for edit and delete
          window.editMachine = function(id) {
            openMachineEditModal(id);
          };
          
          window.deleteMachine = function(id) {
            if (confirm(`Are you sure you want to delete machine ${id}?`)) {
              // Delete the machine from the database
              $.ajax({
                url: '/Azizabad/controllers/setup/machineSetup/index.php',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ 
                  action: 'delete', 
                  id: parseInt(id) 
                }),
                success: function(response) {
                  console.log('Delete response:', response);
                  
                  // Parse response if it's a string
                  if (typeof response === 'string') {
                    try {
                      response = JSON.parse(response);
                    } catch (e) {
                      console.error('Error parsing delete response:', e);
                    }
                  }
                  
                  if (response && response.success === true) {
                    showToast(`Machine ${id} deleted successfully`, 'success');
                    loadMachineTypes(); // Reload the table
                  } else {
                    showToast(`Error: ${response.error || 'Failed to delete machine'}`, 'error');
                  }
                },
                error: function(xhr, status, error) {
                  console.log('AJAX Error during delete:', { 
                    status: status, 
                    error: error, 
                    response: xhr.responseText
                  });
                  
                  showToast('Error deleting machine: ' + error, 'error');
                }
              });
            }
          };
        }
      },
      error: function(xhr, status, error) {
        console.log('AJAX Error:', { 
          status: status, 
          error: error, 
          response: xhr.responseText
        });
        
        // Hide loading indicator and show error state
        loadingIndicator.style.display = 'none';
        noDataMessage.style.display = 'block';
        noDataMessage.innerHTML = '<p style="color: #EF4444;">Error loading machine data. Please try again.</p>';
        typesTable.style.display = 'none';
      }
    });
  }
  
  // Function to open a machine edit modal
  function openMachineEditModal(id) {
    // Create the modal if it doesn't exist
    if (!document.getElementById('machine-edit-modal')) {
      const modal = document.createElement('div');
      modal.id = 'machine-edit-modal';
      modal.className = 'modal';
      
      modal.innerHTML = `
        <div class="modal-content">
          <div class="modal-header">
            <h2 id="edit-modal-title">Edit Machine</h2>
            <span class="close-modal edit-modal-close">&times;</span>
          </div>
          <div class="modal-body">
            <div id="edit-loading-indicator" style="text-align: center; margin-top: 20px; display: none;">
              <p>Loading machine data...</p>
            </div>
            
            <form id="machineEditForm">
              <div class="form-group">
                <label for="edit-machine-id">Machine ID</label>
                <input type="text" id="edit-machine-id" readonly>
              </div>
              
              <div class="form-group">
                <label for="edit-machine-date">Date</label>
                <input type="date" id="edit-machine-date" required>
              </div>
              
              <div class="form-group">
                <label for="edit-machine-name">Machine Name</label>
                <input type="text" id="edit-machine-name" required placeholder="Enter machine name">
              </div>
              
              <div class="form-group">
                <label for="edit-machine-type">Machine Type</label>
                <input type="text" id="edit-machine-type" required placeholder="Enter machine type">
              </div>
              
              <div class="form-group">
                <label for="edit-machine-other">Other</label>
                <input type="text" id="edit-machine-other" placeholder="Additional information">
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button id="update-machine" class="primary-btn">Update Machine</button>
            <button id="cancel-edit" class="secondary-btn">Cancel</button>
          </div>
        </div>
      `;
      
      document.body.appendChild(modal);
      
      // Add event listeners for the modal
      document.querySelector('.edit-modal-close').addEventListener('click', closeMachineEditModal);
      document.getElementById('cancel-edit').addEventListener('click', closeMachineEditModal);
      document.getElementById('update-machine').addEventListener('click', updateMachine);
      
      // Close when clicking outside
      window.addEventListener('click', function(event) {
        if (event.target === modal) {
          closeMachineEditModal();
        }
      });
    }
    
    // Show the modal and loading indicator
    const modal = document.getElementById('machine-edit-modal');
    modal.style.display = 'block';
    
    const loadingIndicator = document.getElementById('edit-loading-indicator');
    loadingIndicator.style.display = 'block';
    
    const form = document.getElementById('machineEditForm');
    form.style.display = 'none';
    
    // Fetch machine data from the database
    $.ajax({
      url: '/Azizabad/controllers/setup/machineSetup/index.php',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ action: 'get', id: id }),
      success: function(response) {
        console.log('Edit machine response:', response);
        
        let machineData = response;
        
        // Try to parse the response if it's a string
        if (typeof response === 'string') {
          try {
            machineData = JSON.parse(response);
            console.log('Parsed machine data:', machineData);
          } catch(e) {
            console.error('Failed to parse machine data:', e);
          }
        }
        
        // Hide loading indicator
        loadingIndicator.style.display = 'none';
        
        if (machineData && Object.keys(machineData).length > 0) {
          // Populate form with machine data
          document.getElementById('edit-machine-id').value = machineData.id || '';
          
          // Format date if needed
          let formattedDate = machineData.date || '';
          if (formattedDate && formattedDate.includes('T')) {
            formattedDate = formattedDate.split('T')[0]; // Extract YYYY-MM-DD part
          }
          document.getElementById('edit-machine-date').value = formattedDate;
          
          document.getElementById('edit-machine-name').value = machineData.machine_name || '';
          document.getElementById('edit-machine-type').value = machineData.machine_type || '';
          document.getElementById('edit-machine-other').value = machineData.other || '';
          
          // Show the form
          form.style.display = 'block';
        } else {
          showToast('Machine data not found or has no data', 'error');
          closeMachineEditModal();
        }
      },
      error: function(xhr, status, error) {
        console.log('AJAX Error fetching machine:', { 
          status: status, 
          error: error, 
          response: xhr.responseText
        });
        
        loadingIndicator.style.display = 'none';
        showToast('Error loading machine data: ' + error, 'error');
        closeMachineEditModal();
      }
    });
  }

  // Function to close the machine edit modal
  function closeMachineEditModal() {
    document.getElementById('machine-edit-modal').style.display = 'none';
  }

  // Function to update a machine entry
  function updateMachine() {
    // Get values from form
    const entry = {
      action: 'save',
      id: document.getElementById('edit-machine-id').value,
      date: document.getElementById('edit-machine-date').value,
      machine_name: document.getElementById('edit-machine-name').value.trim(),
      machine_type: document.getElementById('edit-machine-type').value.trim(),
      other: document.getElementById('edit-machine-other').value.trim() || null
    };

    // Client-side validation
    if (!entry.date || !entry.machine_name || !entry.machine_type) {
      showToast('All required fields must be filled with valid values', 'error');
      return;
    }

    // Update button state
    const updateBtn = document.getElementById('update-machine');
    updateBtn.textContent = 'Updating...';
    updateBtn.disabled = true;

    // Send AJAX request
    $.ajax({
      url: '/Azizabad/controllers/setup/machineSetup/index.php',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(entry),
      success: function(response) {
        console.log('Update response:', response);
        
        // Parse response if it's a string
        if (typeof response === 'string') {
          try {
            response = JSON.parse(response);
          } catch (e) {
            // If parsing fails, assume it's an error message
            showToast('Error: ' + response, 'error');
            updateBtn.textContent = 'Update Machine';
            updateBtn.disabled = false;
            return;
          }
        }
        
        if (response.success === true) {
          showToast('Machine updated successfully!', 'success');
          closeMachineEditModal();
          loadMachineTypes(); // Reload the table
        } else {
          showToast('Error: ' + (response.error || 'Unknown server error'), 'error');
        }
        
        updateBtn.textContent = 'Update Machine';
        updateBtn.disabled = false;
      },
      error: function(xhr, status, error) {
        console.log('AJAX Error during update:', { 
          status: status, 
          error: error, 
          response: xhr.responseText
        });
        
        let errorMsg = 'Unknown error';
        try {
          const response = JSON.parse(xhr.responseText);
          errorMsg = response.error || errorMsg;
        } catch (e) {
          errorMsg = xhr.responseText || errorMsg;
        }
        
        showToast('Error updating machine: ' + errorMsg, 'error');
        updateBtn.textContent = 'Update Machine';
        updateBtn.disabled = false;
      }
    });
  }
});