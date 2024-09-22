<?php
session_start();

if (isset($_GET['id']) && isset($_SESSION['posts'])) {
    $postId = $_GET['id'];
    $post = array_filter($_SESSION['posts'], function($p) use ($postId) {
        return $p['id'] == $postId;
    });

    if (!empty($post)) {
        header('Content-Type: application/json');
        echo json_encode(reset($post));
        exit();
    }
}

header('HTTP/1.1 404 Not Found');
echo json_encode(['error' => 'Post not found']);