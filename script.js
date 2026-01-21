/**
 * Student Feedback App - Frontend Logic
 * Integrates with Backend APIs to store and retrieve feedback permanently.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Select DOM Elements
    const feedbackForm = document.getElementById('feedbackForm');
    const studentNameInput = document.getElementById('studentName');
    const feedbackTextInput = document.getElementById('feedbackText');
    const charCounter = document.getElementById('charCounter');
    const feedbackContainer = document.getElementById('feedbackContainer');
    const submitBtn = feedbackForm.querySelector('button[type="submit"]');

    // 2. Constants & Configuration
    // ------------------------------------------------------------------------
    // [DEPLOYMENT CONFIGURATION]
    // Update the 'PRODUCTION_API_URL' below with your Render Backend URL after deployment.
    // Example: 'https://my-backend-app.onrender.com/api/feedback'
    const PRODUCTION_API_URL = 'https://student-feedback-web-application.onrender.com/api/feedback';

    // Automatically use Localhost if running locally, otherwise use Production URL
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const API_URL = isLocalhost ? 'http://localhost:5000/api/feedback' : PRODUCTION_API_URL;
    const MAX_CHARS = 500;

    // 3. Event Listeners
    feedbackForm.addEventListener('submit', handleFormSubmit);

    // Input Validations
    [studentNameInput, feedbackTextInput].forEach(input => {
        input.addEventListener('input', () => clearError(input));
    });

    // Character Counter
    feedbackTextInput.addEventListener('input', updateCharCounter);

    // Event Delegation for Dynamic Cards (Like & Delete - UI Only for now)
    feedbackContainer.addEventListener('click', handleCardActions);

    // 4. Initial Load
    fetchFeedbacks();

    /**
     * Fetches all feedback from the backend and renders it.
     */
    async function fetchFeedbacks() {
        try {
            showLoadingIndicator();

            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error('Failed to fetch feedback');
            }

            const result = await response.json();

            // Clear current container (remove "No feedback" placeholders)
            feedbackContainer.innerHTML = '';

            if (result.data.length === 0) {
                showNoFeedbackMessage();
            } else {
                // Render each feedback item
                result.data.forEach(feedbackData => {
                    createFeedbackCard(feedbackData, false); // false = append to end (since they are sorted by newest first from DB)
                });
            }

        } catch (error) {
            console.error('Error loading feedback:', error);
            feedbackContainer.innerHTML = `<p class="error-message" style="text-align:center;">Failed to load feedback. Please try again later.</p>`;
        }
    }

    /**
     * Handles the main form submission logic (POST to Backend)
     */
    async function handleFormSubmit(e) {
        e.preventDefault();

        const isNameValid = validateInput(studentNameInput, 'Please enter your name.');
        const isFeedbackValid = validateInput(feedbackTextInput, 'Please enter your feedback.');

        if (!isNameValid || !isFeedbackValid) {
            return;
        }

        const formData = {
            name: studentNameInput.value.trim(),
            feedback: feedbackTextInput.value.trim()
        };

        setLoadingState(true);

        try {
            // POST Request to Backend
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Submission failed');
            }

            const result = await response.json();

            // Success: Render the new card immediately
            // The backend returns the saved object in result.data
            createFeedbackCard(result.data, true); // true = prepend to top

            // Reset Form and UI
            feedbackForm.reset();
            updateCharCounter();
            showSuccessFeedback();

            // Remove "No feedback" message if it exists
            const noFeedbackMsg = feedbackContainer.querySelector('.no-feedback-msg');
            if (noFeedbackMsg) {
                noFeedbackMsg.remove();
            }

        } catch (error) {
            console.error('Submission error:', error);
            alert(`Error: ${error.message}`);
        } finally {
            setLoadingState(false);
        }
    }

    /**
     * Dynamically creates a feedback card with Actions
     * @param {Object} data - The feedback object from the API
     * @param {Boolean} isNew - If true, prepends and scrolls to view. If false, appends.
     */
    function createFeedbackCard(data, isNew = false) {
        const card = document.createElement('article');
        card.className = 'feedback-card';
        if (isNew) card.classList.add('fade-in'); // Add animation class for new items

        const date = new Date(data.createdAt);
        const timeString = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });

        // Icons (SVG)
        const heartIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`;
        const trashIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`;

        card.innerHTML = `
            <div class="feedback-header">
                <h3 class="student-name">${escapeHtml(data.name)}</h3>
                <span class="feedback-time">${timeString}</span>
            </div>
            <p class="feedback-content">${escapeHtml(data.feedback)}</p>
            
            <!-- Interactive Footer (UI Only for now) -->
            <div class="feedback-footer">
                <button class="btn-icon like-btn" aria-label="Like feedback">
                    ${heartIcon}
                    <span class="like-count">0</span>
                </button>
                <button class="btn-icon delete-btn" aria-label="Delete feedback">
                    ${trashIcon}
                </button>
            </div>
        `;

        if (isNew) {
            feedbackContainer.prepend(card);
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            feedbackContainer.appendChild(card);
        }
    }

    // --- Helper Functions ---

    function showLoadingIndicator() {
        feedbackContainer.innerHTML = '<p style="text-align:center; color: #666;">Loading feedback...</p>';
    }

    function showNoFeedbackMessage() {
        feedbackContainer.innerHTML = '<p class="no-feedback-msg" style="text-align: center; color: var(--text-muted); grid-column: 1 / -1;">No feedback yet. Be the first!</p>';
    }

    function updateCharCounter() {
        const currentLength = feedbackTextInput.value.length;
        charCounter.textContent = `${currentLength}/${MAX_CHARS}`;

        if (currentLength >= MAX_CHARS) {
            charCounter.classList.add('limit-reached');
            charCounter.classList.remove('limit-near');
        } else if (currentLength >= MAX_CHARS * 0.9) {
            charCounter.classList.add('limit-near');
            charCounter.classList.remove('limit-reached');
        } else {
            charCounter.classList.remove('limit-near', 'limit-reached');
        }
    }

    function validateInput(inputElement, errorMessage) {
        const value = inputElement.value.trim();
        const parent = inputElement.parentElement;
        clearError(inputElement);

        if (!value) {
            inputElement.classList.add('input-error');
            const errorText = document.createElement('small');
            errorText.className = 'error-message';
            errorText.textContent = errorMessage;
            parent.appendChild(errorText);

            setTimeout(() => {
                inputElement.classList.remove('input-error');
            }, 3000); // Auto-clear error after 3s

            return false;
        }
        return true;
    }

    function clearError(inputElement) {
        const parent = inputElement.parentElement;
        const existingError = parent.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        inputElement.classList.remove('input-error');
    }

    function setLoadingState(isLoading) {
        if (isLoading) {
            submitBtn.classList.add('btn-loading');
            submitBtn.disabled = true;
        } else {
            submitBtn.classList.remove('btn-loading');
            submitBtn.disabled = false;
        }
    }

    function showSuccessFeedback() {
        // Optional: Could add a toast notification here
        console.log('Feedback submitted!');
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // --- UI Only Interactions (Likes/Delete) ---
    // Note: These do not persist to the database in this version
    function handleCardActions(e) {
        const target = e.target;

        // Like Button
        const likeBtn = target.closest('.like-btn');
        if (likeBtn) {
            toggleLike(likeBtn);
            return;
        }

        // Delete Button
        const deleteBtn = target.closest('.delete-btn');
        if (deleteBtn) {
            deleteCard(deleteBtn);
            return;
        }
    }

    function toggleLike(btn) {
        const countSpan = btn.querySelector('.like-count');
        let count = parseInt(countSpan.textContent, 10);

        btn.classList.toggle('liked');
        const isLiked = btn.classList.contains('liked');

        const heartFilled = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`;
        const heartOutline = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`;

        if (isLiked) {
            count++;
            btn.innerHTML = `${heartFilled} <span class="like-count">${count}</span>`;
        } else {
            count--;
            btn.innerHTML = `${heartOutline} <span class="like-count">${count}</span>`;
        }
    }

    function deleteCard(btn) {
        const card = btn.closest('.feedback-card');
        if (confirm('Delete this feedback? (This action is local only for now)')) {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => card.remove(), 300);
        }
    }
});
