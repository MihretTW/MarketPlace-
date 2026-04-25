<?php
// php/signin.php
session_start();
include 'db.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

$email    = trim($data['email'] ?? '');
$password = $data['password'] ?? '';

if (empty($email) || empty($password)) {
    echo json_encode(["status" => "error", "message" => "Email and password are required"]);
    exit;
}

if (!($stmt = $connect->prepare("SELECT id, username, phone, location, telegram_username, password FROM users WHERE email = ? LIMIT 1"))) {
    echo json_encode(["status" => "error", "message" => "Database error"]);
    exit;
}

$stmt->bind_param("s", $email);

if (!$stmt->execute()) {
    echo json_encode(["status" => "error", "message" => "Database error"]);
    $stmt->close();
    $connect->close();
    exit;
}

$stmt->bind_result($id, $username, $phone, $location, $telegram_username, $hashed_password);

if ($stmt->fetch() && password_verify($password, $hashed_password)) {
    $_SESSION['user_id']  = $id;
    $_SESSION['username'] = $username;
    $_SESSION['phone'] = $phone;
    $_SESSION['location'] = $location;
    $_SESSION['telegram_username'] = $telegram_username;

    echo json_encode([
        "status"   => "success",
        "message"  => "Login successful",
        "username" => $username,
        "user"     => $username,
        "phone" => $phone,
        "location" => $location,
        "telegram_username" => $telegram_username
    ]);
} else {
    echo json_encode(["status" => "error", "message" => "Invalid email or password"]);
}

$stmt->close();
$connect->close();
?>
