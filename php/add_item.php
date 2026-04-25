<?php
session_start();
header('Content-Type: application/json');

include 'db.php';

$user_id = isset($_SESSION['user_id']) ? intval($_SESSION['user_id']) : 0;

if ($user_id <= 0) {
    echo json_encode(["status" => "error", "message" => "Please sign in first"]);
    exit;
}

$title       = trim($_POST['title'] ?? '');
$price       = floatval($_POST['price'] ?? 0);
$description = trim($_POST['description'] ?? '');

$image = '';

$uploadErrorMessages = [
    UPLOAD_ERR_INI_SIZE   => 'The uploaded file is too large (php.ini limit)',
    UPLOAD_ERR_FORM_SIZE  => 'The uploaded file is too large (form limit)',
    UPLOAD_ERR_PARTIAL    => 'The uploaded file was only partially uploaded',
    UPLOAD_ERR_NO_FILE    => 'No file was uploaded',
    UPLOAD_ERR_NO_TMP_DIR => 'Missing a temporary folder on the server',
    UPLOAD_ERR_CANT_WRITE => 'Failed to write file to disk',
    UPLOAD_ERR_EXTENSION  => 'A PHP extension stopped the file upload',
];

// Handle image upload
$file = null;
if (isset($_FILES['image'])) {
    $file = $_FILES['image'];
} elseif (isset($_FILES['image']['name'][0])) {
    $file = [
        'name' => $_FILES['image']['name'][0],
        'type' => $_FILES['image']['type'][0],
        'tmp_name' => $_FILES['image']['tmp_name'][0],
        'error' => $_FILES['image']['error'][0],
        'size' => $_FILES['image']['size'][0],
    ];
}

if ($file) {
    if (!empty($file['error'])) {
        if ($file['error'] !== UPLOAD_ERR_NO_FILE) {
            $msg = $uploadErrorMessages[$file['error']] ?? 'Upload failed';
            echo json_encode(["status" => "error", "message" => $msg]);
            exit;
        }
    } elseif (!empty($file['tmp_name'])) {
        $target_dir = "../uploads/";

        if (!is_dir($target_dir)) {
            mkdir($target_dir, 0755, true);
        }

        $file_ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $allowed = array('jpg', 'jpeg', 'png', 'gif');

        if (!in_array($file_ext, $allowed)) {
            echo json_encode(["status" => "error", "message" => "Invalid image type. Use JPG, PNG, or GIF."]);
            exit;
        }

        if ($file['size'] >= 5000000) {
            echo json_encode(["status" => "error", "message" => "Image is too large. Max 5MB."]);
            exit;
        }

        $new_filename = time() . '_' . rand(1000, 9999) . '.' . $file_ext;
        $target_file  = $target_dir . $new_filename;

        if (move_uploaded_file($file['tmp_name'], $target_file)) {
            $image = $new_filename;
        } else {
            echo json_encode(["status" => "error", "message" => "Failed to save uploaded image"]);
            exit;
        }
    }
}

if (empty($title) || $price <= 0) {
    echo json_encode(["status" => "error", "message" => "Title and price are required"]);
    exit;
}

$stmt = $connect->prepare("INSERT INTO items (user_id, name, price, description, image) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("isdss", $user_id, $title, $price, $description, $image);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Item posted successfully!"]);
} else {
    echo json_encode(["status" => "error", "message" => "Database error: " . $stmt->error]);
}

$stmt->close();
$connect->close();
?>
