<?php
// php/get_items.php - Return all items as JSON (with image support)

header('Content-Type: application/json');

include 'db.php';

// Enable error display for debugging (remove or comment this line later for production)
ini_set('display_errors', 1);
error_reporting(E_ALL);

$sql = "
    SELECT
        i.id,
        i.name,
        i.price,
        i.description,
        i.image AS image
    FROM items i
    ORDER BY i.id DESC
";

$result = $connect->query($sql);

$items = [];

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $items[] = $row;
    }
    echo json_encode($items);   // This should return [] if no items, or real data
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Query failed: " . $connect->error
    ]);
}

$connect->close();
?>