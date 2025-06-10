<?php
session_start();
include('../../includes/connection.php');

if (isset($_SESSION['user_id'])) {
    // Set user as inactive
    $stmt = $pdo->prepare("UPDATE users SET is_active = 0 WHERE id = :user_id");
    $stmt->execute(['user_id' => $_SESSION['user_id']]);
}

// Clear session
session_destroy();

// Redirect to login
header('Location: ../../views/auth/login.php');
exit;
?>