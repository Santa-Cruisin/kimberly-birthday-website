// Password answers for each card
const answers = {
    1: ['french toast'], // Card 1 - breakfast foods
    2: ['stress-relief', 'zen-yoga', 'black-pepper', 'wood-spice', 'lavender'], // Card 2 - aroma choices
    3: ['garden', 'streets', 'history', 'option 1', 'option 2', 'option 3'] // Card 3 - adventure choices
};

// Current card being displayed
let currentCard = 0;

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    // Start button functionality
    const startBtn = document.getElementById('start-btn');
    if (startBtn) {
        startBtn.addEventListener('click', function() {
            showCard(1);
        });
    }

    // Add click handlers for aroma options
    const aromaOptions = document.querySelectorAll('.aroma-option');
    aromaOptions.forEach(option => {
        option.addEventListener('click', function() {
            const aroma = this.getAttribute('data-aroma');
            document.getElementById('answer2').value = aroma;
        });
    });

    // Add click handlers for adventure options
    const adventureOptions = document.querySelectorAll('.adventure-option');
    adventureOptions.forEach(option => {
        option.addEventListener('click', function() {
            const adventure = this.getAttribute('data-adventure');
            document.getElementById('answer3').value = adventure;
        });
    });

    // Add enter key support for input fields
    const inputs = document.querySelectorAll('.answer-input');
    inputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const cardNumber = parseInt(this.id.replace('answer', ''));
                checkAnswer(cardNumber);
            }
        });
    });
});

// Show a specific card
function showCard(cardNumber) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });

    // Show the requested card
    const targetPage = document.getElementById(`card${cardNumber}`);
    if (targetPage) {
        targetPage.classList.add('active');
        currentCard = cardNumber;
        
        // Scroll to top smoothly for mobile
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Add entrance animation
        targetPage.style.animation = 'none';
        targetPage.offsetHeight; // Trigger reflow
        targetPage.style.animation = 'successPulse 0.6s ease-in-out';
        
        // Focus on input if it exists
        const input = document.getElementById(`answer${cardNumber}`);
        if (input) {
            setTimeout(() => input.focus(), 300);
        }
    }
}

// Check if the answer is correct
function checkAnswer(cardNumber) {
    const input = document.getElementById(`answer${cardNumber}`);
    const userAnswer = input.value.toLowerCase().trim();
    const correctAnswers = answers[cardNumber];
    
    if (!correctAnswers) {
        console.error('No answers defined for card', cardNumber);
        return;
    }

    // Check if the answer is correct
    const isCorrect = correctAnswers.some(answer => 
        userAnswer.includes(answer) || answer.includes(userAnswer)
    );

    if (isCorrect) {
        // Success animation
        input.classList.add('success');
        setTimeout(() => input.classList.remove('success'), 600);
        
        // Show success message
        showSuccessMessage(cardNumber);
        
        // Move to next card after a delay
        setTimeout(() => {
            if (cardNumber < 4) {
                showCard(cardNumber + 1);
            }
        }, 2000);
        
    } else {
        // Error animation
        input.classList.add('error');
        setTimeout(() => input.classList.remove('error'), 600);
        
        // Clear input and show error message
        input.value = '';
        showErrorMessage(cardNumber);
    }
}

// Show success message
function showSuccessMessage(cardNumber) {
    const cardContainer = document.querySelector(`#card${cardNumber} .card-container`);
    
    // Create success message
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <div style="
            background: linear-gradient(135deg, #4CAF50, #45a049);
            color: white;
            padding: 20px;
            border-radius: 15px;
            text-align: center;
            margin-top: 20px;
            animation: successPulse 0.6s ease-in-out;
        ">
            <i class="fas fa-check-circle" style="font-size: 2rem; margin-bottom: 10px;"></i>
            <h3 style="margin: 10px 0; font-family: 'Dancing Script', cursive;">Perfect! ✨</h3>
            <p style="margin: 0;">Unlocking your next surprise...</p>
        </div>
    `;
    
    cardContainer.appendChild(successDiv);
    
    // Remove success message after animation
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.parentNode.removeChild(successDiv);
        }
    }, 2000);
}

// Show error message
function showErrorMessage(cardNumber) {
    const cardContainer = document.querySelector(`#card${cardNumber} .card-container`);
    
    // Remove any existing error message
    const existingError = cardContainer.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Create error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
        <div style="
            background: linear-gradient(135deg, #ff6b6b, #ee5a52);
            color: white;
            padding: 15px;
            border-radius: 10px;
            text-align: center;
            margin-top: 15px;
            animation: errorShake 0.6s ease-in-out;
        ">
            <i class="fas fa-times-circle" style="margin-right: 8px;"></i>
            <span>Try again, my love! 💕</span>
        </div>
    `;
    
    cardContainer.appendChild(errorDiv);
    
    // Remove error message after 3 seconds
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.parentNode.removeChild(errorDiv);
        }
    }, 3000);
}

// Add some fun interactive effects
function addSparkles() {
    const sparkle = document.createElement('div');
    sparkle.innerHTML = '✨';
    sparkle.style.cssText = `
        position: fixed;
        left: ${Math.random() * window.innerWidth}px;
        top: ${Math.random() * window.innerHeight}px;
        font-size: 20px;
        pointer-events: none;
        z-index: 1000;
        animation: sparkle 2s ease-out forwards;
    `;
    document.body.appendChild(sparkle);
    
    setTimeout(() => {
        if (sparkle.parentNode) {
            sparkle.parentNode.removeChild(sparkle);
        }
    }, 2000);
}

// Add sparkles on click
document.addEventListener('click', function(e) {
    if (Math.random() < 0.3) { // 30% chance
        addSparkles();
    }
});

// Add keyboard shortcuts for testing (you can remove these later)
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + number to jump to card (for testing)
    if ((e.ctrlKey || e.metaKey) && e.key >= '1' && e.key <= '4') {
        e.preventDefault();
        showCard(parseInt(e.key));
    }
    
    // Ctrl/Cmd + Enter to auto-answer (for testing)
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        const input = document.querySelector('.answer-input:focus');
        if (input) {
            const cardNumber = parseInt(input.id.replace('answer', ''));
            const correctAnswer = answers[cardNumber][0];
            input.value = correctAnswer;
            checkAnswer(cardNumber);
        }
    }
});

// Add some ambient animations
function createFloatingHeart() {
    const heart = document.createElement('div');
    heart.innerHTML = '💕';
    heart.style.cssText = `
        position: fixed;
        left: ${Math.random() * window.innerWidth}px;
        top: ${window.innerHeight + 50}px;
        font-size: 24px;
        pointer-events: none;
        z-index: 999;
        animation: floatUp 8s linear forwards;
    `;
    document.body.appendChild(heart);
    
    setTimeout(() => {
        if (heart.parentNode) {
            heart.parentNode.removeChild(heart);
        }
    }, 8000);
}

// Add floating hearts periodically
setInterval(createFloatingHeart, 10000); // Every 10 seconds

// Add CSS for floating animation
const style = document.createElement('style');
style.textContent = `
    @keyframes floatUp {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.8;
        }
        100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
    
    .success-message {
        position: relative;
        z-index: 10;
    }
    
    .error-message {
        position: relative;
        z-index: 10;
    }
`;
document.head.appendChild(style); 