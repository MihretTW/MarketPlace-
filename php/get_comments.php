<?php
// php/get_comments.php
header('Content-Type: application/json');
include 'db.php';

$item_id = isset($_GET['item_id']) ? intval($_GET['item_id']) : 0;

if ($item_id <= 0) {
    echo json_encode(["status" => "error", "message" => "Missing item_id"]);
    exit;
}

$sql = "SELECT c.id, c.comment_text, c.created_at, u.username
        FROM comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.item_id = ?
        ORDER BY c.id DESC";

if (!($stmt = $connect->prepare($sql))) {
    echo json_encode(["status" => "error", "message" => "Database error"]);
    $connect->close();
    exit;
}

$stmt->bind_param("i", $item_id);

if (!$stmt->execute()) {
    echo json_encode(["status" => "error", "message" => "Database error"]);
    $stmt->close();
    $connect->close();
    exit;
}

$result = $stmt->get_result();
$comments = [];
while ($row = $result->fetch_assoc()) {
    $comments[] = $row;
}

echo json_encode(["status" => "success", "comments" => $comments]);

$stmt->close();
$connect->close();
?>