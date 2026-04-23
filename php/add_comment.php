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

?>
