// Password answers for each card
const answers = {
    1: ['french toast'], // Card 1 - breakfast foods
    2: ['stress-relief', 'zen-yoga', 'black-pepper', 'wood-spice', 'lavender'], // Card 2 - aroma choices
    3: ['garden', 'streets', 'history', 'option 1', 'option 2', 'option 3'] // Card 3 - adventure choices
};

// Unlock times (EST) - July 3, 2025
const unlockTimes = {
    landing: new Date('2025-07-03T10:30:00-04:00'), // 10:30 AM EST
    card2: new Date('2025-07-03T12:00:00-04:00'),   // 12:00 PM EST
    card3: new Date('2025-07-03T12:00:00-04:00'),   // 12:00 PM EST
    card4: new Date('2025-07-03T16:00:00-04:00'),   // 4:00 PM EST
    card5: new Date('2025-07-03T19:30:00-04:00')    // 7:30 PM EST
};

// Current card being displayed
let currentCard = 0;
let countdownIntervals = {};

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    // Check initial unlock status
    checkUnlockStatus();
    
    // Start countdown timers
    startCountdownTimers();
    
    // Start button functionality
    const startBtn = document.getElementById('start-btn');
    if (startBtn) {
        startBtn.addEventListener('click', function() {
            if (!this.classList.contains('locked')) {
                showCard(1);
            }
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

    // Add event listener for Card #4 to Card #5 button
    const toCard5Btn = document.getElementById('to-card5-btn');
    if (toCard5Btn) {
        toCard5Btn.addEventListener('click', function() {
            if (!this.classList.contains('locked')) {
                showCard(5);
            }
        });
    }
});

// Check if it's time to unlock various elements
function checkUnlockStatus() {
    const now = new Date();
    
    // Check landing page unlock
    if (now >= unlockTimes.landing) {
        unlockLanding();
    }
    
    // Check card unlocks
    if (now >= unlockTimes.card2) {
        unlockCard(2);
    }
    if (now >= unlockTimes.card3) {
        unlockCard(3);
    }
    if (now >= unlockTimes.card4) {
        unlockCard(4);
    }
    if (now >= unlockTimes.card5) {
        unlockCard(5);
    }
}

// Unlock the landing page
function unlockLanding() {
    const lockScreen = document.getElementById('landing-lock');
    const startBtn = document.getElementById('start-btn');
    
    if (lockScreen) {
        lockScreen.style.display = 'none';
    }
    
    if (startBtn) {
        startBtn.classList.remove('locked');
    }
}

// Unlock a specific card
function unlockCard(cardNumber) {
    const lockPage = document.getElementById(`card${cardNumber}-lock`);
    if (lockPage) {
        lockPage.style.display = 'none';
    }
    
    // If this card is currently being displayed as a lock screen, show the actual card
    if (lockPage && lockPage.classList.contains('active')) {
        showCard(cardNumber);
    }
}

// Start countdown timers
function startCountdownTimers() {
    // Landing page countdown
    startCountdown('landing', unlockTimes.landing, () => {
        unlockLanding();
    });
    
    // Card countdowns
    startCountdown('card2', unlockTimes.card2, () => {
        unlockCard(2);
    });
    
    startCountdown('card3', unlockTimes.card3, () => {
        unlockCard(3);
    });
    
    startCountdown('card4', unlockTimes.card4, () => {
        unlockCard(4);
    });
    
    startCountdown('card5', unlockTimes.card5, () => {
        unlockCard(5);
    });
    
    // Card #5 inline countdown on Card #4
    startCountdown('card5-inline', unlockTimes.card5, () => {
        enableCard5Button();
    });
}

// Start a countdown timer
function startCountdown(prefix, unlockTime, onUnlock) {
    const updateCountdown = () => {
        const now = new Date();
        const timeLeft = unlockTime - now;
        
        if (timeLeft <= 0) {
            // Time to unlock
            clearInterval(countdownIntervals[prefix]);
            onUnlock();
            return;
        }
        
        // Calculate time units
        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        // Update display
        const hoursEl = document.getElementById(`${prefix}-hours`);
        const minutesEl = document.getElementById(`${prefix}-minutes`);
        const secondsEl = document.getElementById(`${prefix}-seconds`);
        
        if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
        if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
        if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');
    };
    
    // Update immediately and then every second
    updateCountdown();
    countdownIntervals[prefix] = setInterval(updateCountdown, 1000);
}

// Show a specific card
function showCard(cardNumber) {
    // Check if card is unlocked
    const now = new Date();
    if (cardNumber === 2 && now < unlockTimes.card2) {
        showLockScreen('card2-lock');
        return;
    }
    if (cardNumber === 3 && now < unlockTimes.card3) {
        showLockScreen('card3-lock');
        return;
    }
    if (cardNumber === 4 && now < unlockTimes.card4) {
        showLockScreen('card4-lock');
        return;
    }
    if (cardNumber === 5 && now < unlockTimes.card5) {
        showLockScreen('card5-lock');
        return;
    }
    
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

// Show lock screen for a card
function showLockScreen(lockId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });

    // Show the lock screen
    const lockPage = document.getElementById(lockId);
    if (lockPage) {
        lockPage.classList.add('active');
        
        // Scroll to top smoothly for mobile
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
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
            } else if (cardNumber === 4) {
                showCard(5);
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
            <span>Try again, silly!</span>
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
    
    // Ctrl/Cmd + T to unlock all (for testing)
    if ((e.ctrlKey || e.metaKey) && e.key === 't') {
        e.preventDefault();
        unlockLanding();
        unlockCard(2);
        unlockCard(3);
        unlockCard(4);
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

function enableCard5Button() {
    const btn = document.getElementById('to-card5-btn');
    if (btn) {
        btn.classList.remove('locked');
        btn.disabled = false;
    }
    // Optionally hide the countdown when unlocked
    const countdown = document.getElementById('card5-inline-countdown');
    if (countdown) {
        countdown.style.display = 'none';
    }
} 