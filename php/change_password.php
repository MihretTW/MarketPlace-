<?php
// php/change_password.php
session_start();
include 'db.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["status" => "error", "message" => "Not authenticated"]);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

$old_password = $data['old_password'] ?? '';
$new_password = $data['new_password'] ?? '';

if (empty($old_password) || empty($new_password)) {
    echo json_encode(["status" => "error", "message" => "Old password and new password are required"]);
    exit;
}

if (strlen($new_password) < 6) {
    echo json_encode(["status" => "error", "message" => "New password must be at least 6 characters"]);
    exit;
}

$user_id = intval($_SESSION['user_id']);

if (!($stmt = $connect->prepare("SELECT password FROM users WHERE id = ? LIMIT 1"))) {
    echo json_encode(["status" => "error", "message" => "Database error"]);
    exit;
}

$stmt->bind_param("i", $user_id);

if (!$stmt->execute()) {
    echo json_encode(["status" => "error", "message" => "Database error"]);
    $stmt->close();
    $connect->close();
    exit;
}

$stmt->bind_result($hashed_password);

if (!$stmt->fetch()) {
    echo json_encode(["status" => "error", "message" => "User not found"]);
    $stmt->close();
    $connect->close();
    exit;
}

$stmt->close();

if (!password_verify($old_password, $hashed_password)) {
    echo json_encode(["status" => "error", "message" => "Old password is incorrect"]);
    $connect->close();
    exit;
}

$new_hash = password_hash($new_password, PASSWORD_DEFAULT);

if (!($stmt2 = $connect->prepare("UPDATE users SET password = ? WHERE id = ?"))) {
    echo json_encode(["status" => "error", "message" => "Database error"]);
    $connect->close();
    exit;
}

$stmt2->bind_param("si", $new_hash, $user_id);

if (!$stmt2->execute()) {
    echo json_encode(["status" => "error", "message" => "Could not update password"]);
    $stmt2->close();
    $connect->close();
    exit;
}

$stmt2->close();
$connect->close();

echo json_encode(["status" => "success", "message" => "Password updated successfully"]);
?>