<?php
session_start();

// Ensure posts are initialized
if (!isset($_SESSION['posts'])) {
    $_SESSION['posts'] = [];
}

// Return posts as JSON
header('Content-Type: application/json');
echo json_encode($_SESSION['posts']);