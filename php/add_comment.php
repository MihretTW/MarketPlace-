<?php
// php/add_comment.php
session_start();
header('Content-Type: application/json');
include 'db.php';

$user_id = isset($_SESSION['user_id']) ? intval($_SESSION['user_id']) : 0;
if ($user_id <= 0) {
    echo json_encode(["status" => "error", "message" => "Please sign in to comment"]);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

$item_id = intval($data['item_id'] ?? 0);
$comment_text = trim($data['comment_text'] ?? '');

if ($item_id <= 0 || $comment_text === '') {
    echo json_encode(["status" => "error", "message" => "Item id and comment are required"]);
    exit;
}

if (mb_strlen($comment_text) > 500) {
    echo json_encode(["status" => "error", "message" => "Comment is too long (max 500 characters)"]);
    exit;
}

if (!($stmt = $connect->prepare("INSERT INTO comments (item_id, user_id, comment_text) VALUES (?, ?, ?)"))) {
    echo json_encode(["status" => "error", "message" => "Database error"]);
    $connect->close();
    exit;
}

$stmt->bind_param("iis", $item_id, $user_id, $comment_text);

if (!$stmt->execute()) {
    echo json_encode(["status" => "error", "message" => "Database error"]);
    $stmt->close();
    $connect->close();
    exit;
}

$stmt->close();
$connect->close();

echo json_encode(["status" => "success", "message" => "Comment posted"]);
?>
