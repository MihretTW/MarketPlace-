<?php
// php/signup.php
session_start();
include 'db.php';   

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

$username = trim($data['username'] ?? '');
$phone    = trim($data['phone'] ?? '');
$location = trim($data['location'] ?? '');
$telegram_username = trim($data['telegram_username'] ?? '');
$email    = trim($data['email'] ?? '');
$password = $data['password'] ?? '';

if (empty($username) || empty($phone) || empty($location) || empty($telegram_username) || empty($email) || empty($password)) {
    echo json_encode(["status" => "error", "message" => "All fields are required"]);
    exit;
}

// basic email format check
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["status" => "error", "message" => "Invalid email format"]);
    exit;
}

if (!($stmt = $connect->prepare("SELECT id FROM users WHERE email = ? OR username = ? LIMIT 1"))) {
    echo json_encode(["status" => "error", "message" => "Something went wrong. Please try again."]);
    exit;
}

$stmt->bind_param("ss", $email, $username);

if (!$stmt->execute()) {
    echo json_encode(["status" => "error", "message" => "Something went wrong. Please try again."]);
    $stmt->close();
    $connect->close();
    exit;
}

$stmt->store_result();

if ($stmt->num_rows > 0) {
    echo json_encode(["status" => "error", "message" => "Username or Email already exists"]);
    $stmt->close();
    $connect->close();
    exit;
}

$stmt->close();

$hashed_password = password_hash($password, PASSWORD_DEFAULT);

if (!($stmt = $connect->prepare("INSERT INTO users (username, phone, location, telegram_username, email, password) VALUES (?, ?, ?, ?, ?, ?)"))) {
    echo json_encode(["status" => "error", "message" => "Something went wrong. Please try again."]);
    $connect->close();
    exit;
}

$stmt->bind_param("ssssss", $username, $phone, $location, $telegram_username, $email, $hashed_password);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Account created successfully! You can now sign in."]);
} else {
    echo json_encode(["status" => "error", "message" => "Something went wrong. Please try again."]);
}

$stmt->close();
$connect->close();
?>
