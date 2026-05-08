<?php
$servername = getenv('MYSQLHOST');
$username   = getenv('MYSQLUSER');
$password   = getenv('MYSQLPASSWORD');
$dbname     = getenv('MYSQLDATABASE');
$port       = (int) getenv('MYSQLPORT');

$connect = new mysqli($servername, $username, $password, $dbname, $port);

if ($connect->connect_error) {
    die(json_encode(["status" => "error", "message" => "Database connection failed: " . $connect->connect_error]));
}

$connect->set_charset("utf8mb4");
?>
