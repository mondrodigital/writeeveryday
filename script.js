document.addEventListener('DOMContentLoaded', function() {
    const postsContainer = document.getElementById('posts-container');
    const postTodayButton = document.getElementById('post-today-button');
    const editPostModal = document.getElementById('edit-post-modal');
    const postModal = document.getElementById('post-modal');
    const postForm = document.getElementById('post-form');
    const countdownTimer = document.getElementById('countdown-timer');

    function fetchPosts() {
        fetch('get_posts.php')
            .then(response => response.json())
            .then(posts => {
                renderPosts(posts);
                updatePostTodayButton(posts);
            })
            .catch(error => console.error('Error:', error));
    }

    function renderPosts(posts) {
        postsContainer.innerHTML = '';
        posts.forEach((post, index) => {
            const postElement = createPostElement(post, index + 1); // Pass the day number
            postsContainer.appendChild(postElement);
        });
    }

    function createPostElement(post, dayNumber) {
        const postDiv = document.createElement('div');
        postDiv.className = 'bento-card';
        postDiv.innerHTML = `
            <div class="card-content">
                <h2>${post.title}</h2>
                <p>${post.content.substring(0, 100)}...</p>
                <span class="read-more" data-id="${post.id}" data-day="${dayNumber}">Read more...</span>
            </div>
            <div class="card-footer">
                <span class="day">Day ${dayNumber}</span>
                <span class="date">${post.date}</span>
            </div>
        `;
        return postDiv;
    }

    function updatePostTodayButton(posts) {
        const today = new Date().toISOString().split('T')[0];
        const todayPost = posts.find(post => post.date === today);
        postTodayButton.textContent = todayPost ? 'Edit Today\'s Post' : 'Post Today';
    }

    postTodayButton.addEventListener('click', function() {
        const today = new Date().toISOString().split('T')[0];
        fetch('get_posts.php')
            .then(response => response.json())
            .then(posts => {
                const todayPost = posts.find(post => post.date === today);
                if (todayPost) {
                    // Populate the modal with today's post data
                    document.getElementById('title').value = todayPost.title;
                    document.getElementById('content').value = todayPost.content;
                    editPostModal.style.display = 'block';
                } else {
                    // If no post exists for today, show the modal with empty fields
                    document.getElementById('title').value = '';
                    document.getElementById('content').value = '';
                    editPostModal.style.display = 'block';
                }
            })
            .catch(error => console.error('Error:', error));
    });

    postForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        formData.append('add_update_post', '1');

        fetch('index.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                editPostModal.style.display = 'none';
                fetchPosts();
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        });
    });

    // Close button functionality for all modals
    document.querySelectorAll('.close, .cancel-button').forEach(element => {
        element.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });

    postsContainer.addEventListener('click', function(e) {
        if (e.target.classList.contains('read-more')) {
            const postId = e.target.dataset.id;
            const dayNumber = e.target.dataset.day; // Get the day number from the clicked element
            fetch(`get_post.php?id=${postId}`)
                .then(response => response.json())
                .then(post => {
                    document.getElementById('modal-title').textContent = post.title;
                    document.getElementById('modal-content').textContent = post.content;
                    document.getElementById('modal-day').textContent = `Day ${dayNumber}`; // Set Day
                    document.getElementById('modal-date').textContent = post.date;
                    postModal.style.display = 'block';
                })
                .catch(error => console.error('Error:', error));
        }
    });

    // Close modal when clicking outside of it
    window.addEventListener('click', function(event) {
        if (event.target === postModal) {
            postModal.style.display = 'none';
        }
        if (event.target === editPostModal) {
            editPostModal.style.display = 'none';
        }
    });

    function updateCountdownTimer() {
        const now = new Date();
        const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        const timeLeft = tomorrow - now;
        
        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        countdownTimer.textContent = `Time left to edit: ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        if (timeLeft > 0) {
            setTimeout(updateCountdownTimer, 1000);
        } else {
            fetchPosts();
            updateCountdownTimer();
        }
    }

    fetchPosts();
    updateCountdownTimer();
});