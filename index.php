<?php
session_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Initialize posts array if it doesn't exist
if (!isset($_SESSION['posts'])) {
    $_SESSION['posts'] = [];
}

$today = date('Y-m-d');

// Add or update post logic
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['add_update_post'])) {
    if (isset($_POST['title']) && isset($_POST['content'])) {
        $post = [
            'id' => count($_SESSION['posts']) + 1,
            'title' => $_POST['title'],
            'content' => $_POST['content'],
            'date' => $today,
        ];

        // Check if a post for today already exists
        $todayPostIndex = array_search($today, array_column($_SESSION['posts'], 'date'));
        if ($todayPostIndex !== false) {
            // Update existing post
            $_SESSION['posts'][$todayPostIndex] = $post;
        } else {
            // Add new post
            $_SESSION['posts'][] = $post;
        }

        // Send a JSON response
        header('Content-Type: application/json');
        echo json_encode(['success' => true, 'message' => 'Post updated successfully']);
        exit();
    } else {
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'message' => 'Title and content are required']);
        exit();
    }
}

$posts = $_SESSION['posts'];
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Write Every Day</title>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css">
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div id="countdown-timer" class="countdown-timer"></div>
    
    <nav class="main-nav">
        <div class="container">
            <h1>Write Every Day</h1>
            <button id="post-today-button" class="post-today-button">Post Today</button>
        </div>
    </nav>

    <div class="container">
        <main id="posts-container" class="bento-grid">
            <!-- Posts will be dynamically added here -->
        </main>
    </div>

    <div id="post-modal" class="modal">
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2 id="modal-title"></h2>
            <p id="modal-content"></p>
            <div class="modal-footer">
                <span id="modal-day" class="day"></span> <!-- Added for Day -->
                <span id="modal-date" class="date"></span> <!-- Existing for Date -->
            </div>
        </div>
    </div>

    <div id="edit-post-modal" class="modal">
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2 id="edit-post-title">Today's Blog Post</h2>
            <form id="post-form" class="post-form">
                <div class="form-group">
                    <input type="text" id="title" name="title" placeholder="Title" required>
                </div>
                <div class="form-group">
                    <textarea id="content" name="content" placeholder="Write your content here..." required></textarea>
                </div>
                <div class="form-actions">
                    <button type="submit" id="submit-post-button">Submit Post</button>
                    <button type="button" class="cancel-button">Cancel</button>
                </div>
            </form>
        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>