<?php
session_start();

// Add CORS headers for Flutter web preview
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Accept, X-Requested-With");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Debug helper function to safely output information
function safe_debug_info($obj) {
    if (is_string($obj)) {
        return htmlspecialchars($obj);
    }
    return $obj;
}

// Capture all database related information
$db_diagnostics = [];

// If this is a GET request, simply display the login page
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    include('../../views/auth/login.html');
    exit();
}

try {
    // Include database wrapper with error diagnostics
    include('../../includes/connection.php');
} catch (Throwable $e) {
    $db_diagnostics['include_error'] = safe_debug_info($e->getMessage());
    
    // Respond with useful error info
    if (isset($_POST['ajax']) && $_POST['ajax'] === 'true') {
        $response = [
            'success' => false,
            'error' => 'Database configuration error: Could not include database files.',
            'debug' => [
                'file' => basename($e->getFile()),
                'line' => $e->getLine(),
                'message' => safe_debug_info($e->getMessage()),
                'diagnostics' => $db_diagnostics
            ]
        ];
        header('Content-Type: application/json');
        echo json_encode($response);
        exit();
    } else {
        $_SESSION['login_error'] = 'Database configuration error. Please contact support.';
        include('../../views/auth/login.html');
        exit();
    }
}

// Check if the form is submitted
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $isAjax = isset($_POST['ajax']) && $_POST['ajax'] === 'true';
    $isDebug = isset($_POST['debug']) && $_POST['debug'] === 'true';
    $response = ['success' => false];
    
    try {
        // Test database connectivity - will throw exception if fails
        if (!isset($pdo) || $pdo === null) {
            throw new Exception("Database connection not established. Check database configuration.");
        }
        
        // Test database general query
        try {
            $db_test = $pdo->query("SELECT 1 as test");
            if (!$db_test) {
                throw new Exception("Could not perform test query");
            }
            $db_diagnostics['connection_test'] = 'Success';
        } catch (Throwable $e) {
            $db_diagnostics['connection_test_error'] = safe_debug_info($e->getMessage());
            throw new Exception("Database connection error: " . $e->getMessage());
        }
        
        // Check tables existence
        try {
            $db_test = $pdo->query("SELECT * FROM users LIMIT 0");
            $db_diagnostics['table_test'] = 'Users table exists';
        } catch (Throwable $e) {
            $db_diagnostics['table_test_error'] = safe_debug_info($e->getMessage());
            throw new Exception("Users table does not exist or is not accessible: " . $e->getMessage());
        }
        
        // Validate input data
        if (!isset($_POST['username']) || !isset($_POST['password']) || 
            empty(trim($_POST['username'])) || empty(trim($_POST['password']))) {
            throw new Exception("Username and password are required.");
        }
        
        $username = trim($_POST['username']);
        $password = $_POST['password'];

        // Fetch user details from the database using the wrapper functions
        try {
            $sql = "
                SELECT u.id, u.username, u.password, u.is_admin, u.blocked, u.role_id, r.role_name 
                FROM users u 
                LEFT JOIN roles r ON u.role_id = r.id 
                WHERE u.username = ?
            ";
            $user = db_get_row($sql, [$username]);
            $db_diagnostics['query_test'] = 'Success';
        } catch (Throwable $e) {
            $db_diagnostics['query_error'] = safe_debug_info($e->getMessage());
            throw new Exception("Error retrieving user data: " . $e->getMessage());
        }

        if ($user) {
            if (password_verify($password, $user['password'])) {
                if ($user['blocked']) {
                    $error = "Your account has been blocked. Please contact the administrator.";
                    
                    if ($isAjax) {
                        $response['error'] = $error;
                    }
                } else {
                    // Start session with user data
                    $_SESSION['user_id'] = $user['id'];
                    $_SESSION['username'] = $user['username'];
                    $_SESSION['is_admin'] = $user['is_admin'];
                    $_SESSION['role_id'] = $user['role_id'];
                    $_SESSION['role_name'] = $user['role_name'];

                    // Update user's active status using wrapper function
                    // Use TRUE instead of 1 for PostgreSQL boolean type
                    db_query("UPDATE users SET is_active = TRUE WHERE id = ?", [$user['id']]);
                    
                    if ($isAjax) {
                        $response['success'] = true;
                        $response['redirect'] = '../../controllers/dashboard/dashboard.php';
                        echo json_encode($response);
                        exit();
                    } else {
                        // Redirect to dashboard controller for traditional form submission
                        header('Location: ../../controllers/dashboard/dashboard.php');
                        exit();
                    }
                }
            } else {
                $error = "Invalid username or password.";
                
                if ($isAjax) {
                    $response['error'] = $error;
                }
            }
        } else {
            $error = "Invalid username or password.";
            
            if ($isAjax) {
                $response['error'] = $error;
            }
        }
    } catch (PDOException $e) {
        // Get specific error information
        $errorCode = $e->getCode();
        $errorMessage = $e->getMessage();
        error_log("Database error in login.php: Code: $errorCode, Message: " . $errorMessage);
        
        // Provide more specific error messages based on common database errors
        if ($errorCode == '08001' || $errorCode == '08006') {
            $error = "Cannot connect to database server. Please check if PostgreSQL is running.";
        } else if (strpos($errorMessage, 'could not find driver') !== false) {
            $error = "PostgreSQL database driver not installed. Please install php-pgsql extension.";
        } else if ($errorCode == '42P01') {
            $error = "Database table not found. The application might not be properly installed.";
        } else if ($errorCode == '28P01') {
            $error = "Database authentication failed. Please check database credentials.";
        } else if (strpos($errorMessage, 'database "loan_db" does not exist') !== false) {
            $error = "Database 'loan_db' does not exist. Please create it or update config.";
        } else {
            $error = "A database error occurred. Please try again or contact support.";
        }
        
        if ($isAjax) {
            $response['error'] = $error;
            if ($isDebug) {
                $response['debug'] = [
                    'code' => $errorCode,
                    'message' => safe_debug_info($errorMessage),
                    'file' => basename($e->getFile()),
                    'line' => $e->getLine(),
                    'trace' => array_slice(explode("\n", $e->getTraceAsString()), 0, 3),
                    'diagnostics' => $db_diagnostics
                ];
            }
        }
    } catch (Exception $e) {
        error_log("General error in login.php: " . $e->getMessage());
        $error = $e->getMessage();
        
        if ($isAjax) {
            $response['error'] = $error;
            if ($isDebug) {
                $response['debug'] = [
                    'message' => safe_debug_info($e->getMessage()),
                    'file' => basename($e->getFile()),
                    'line' => $e->getLine(),
                    'diagnostics' => $db_diagnostics
                ];
            }
        }
    }
    
    // Return JSON response for AJAX requests
    if ($isAjax) {
        header('Content-Type: application/json');
        echo json_encode($response);
        exit();
    } else if (isset($error)) {
        // For traditional form submissions, store error in session and render login page
        $_SESSION['login_error'] = $error;
        include('../../views/auth/login.html');
        exit();
    }
}
?>
