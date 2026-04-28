<?php
// php/get_item.php
header('Content-Type: application/json');

include 'db.php';

$id = isset($_GET['id']) ? intval($_GET['id']) : 0;
$category = $_GET['category'] ?? null;

if ($id > 0) {
    if (!($stmt = $connect->prepare("SELECT items.*, users.username, users.telegram_username FROM items JOIN users ON items.user_id = users.id WHERE items.id = ? LIMIT 1"))) {
        echo json_encode(["status" => "error", "message" => "Query failed"]);
        exit;
    }

    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $item = $result ? $result->fetch_assoc() : null;

    echo json_encode($item ?: ["status" => "error", "message" => "Item not found"]);
    $stmt->close();
    $connect->close();
    exit;
}

if ($category) {
    $stmt = $connect->prepare("SELECT items.*, users.username, users.telegram_username FROM items JOIN users ON items.user_id = users.id WHERE category = ? ORDER BY items.id DESC");
    $stmt->bind_param("s", $category);
    $stmt->execute();
} else {
    $stmt = $connect->prepare("SELECT items.*, users.username, users.telegram_username FROM items JOIN users ON items.user_id = users.id ORDER BY items.id DESC");
    $stmt->execute();
}

$result = $stmt->get_result();
$items = [];
while ($row = $result->fetch_assoc()) {
    $items[] = $row;
}

echo json_encode($items);
$stmt->close();
$connect->close();
?>