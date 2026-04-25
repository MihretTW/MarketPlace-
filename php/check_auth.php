<?php
// php/check_auth.php
session_start();
header('Content-Type: application/json');

if (isset($_SESSION['user_id'])) {
    echo json_encode([
        'loggedin' => true,
        'user_id'  => $_SESSION['user_id'],
        'username' => $_SESSION['username'] ?? 'User',
        'phone' => $_SESSION['phone'] ?? '',
        'location' => $_SESSION['location'] ?? '',
        'telegram_username' => $_SESSION['telegram_username'] ?? ''
    ]);
} else {

    echo json_encode([
        'loggedin' => false
    ]);
}
?>
