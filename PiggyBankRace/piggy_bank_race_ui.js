// Piggy Bank Race UI Integration - Connects game logic with HTML interface
class PiggyBankRaceUI {
    constructor() {
        this.game = null;
        this.currentScreen = 'goal-selection';
        this.selectedGoal = null;
        this.currentMiniGame = null;
        
        this.init();
    }
    
    init() {
        // Initialize the game logic
        this.game = new PiggyBankRaceGame();
        
        // Override console.log methods from the game to use UI instead
        this.initializeUICallbacks();
        
        // Bind event listeners
        this.bindEventListeners();
        
        // Show initial screen
        this.showScreen('goal-selection-screen');
        
        // Load any saved state
        this.loadSavedState();
    }
    
    initializeUICallbacks() {
        // Override the game's console-based methods to use UI
        this.game.showScreen = (screenId) => {
            if (screenId === 'main-dashboard') {
                this.showScreen('main-dashboard-screen');
                this.updateDashboard();
            }
        };
        
        this.game.showMessage = (message) => {
            this.showToast(message);
        };
    }
    
    bindEventListeners() {
        // Goal selection
        document.querySelectorAll('.select-goal-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const goalCard = e.target.closest('.goal-card');
                const goalId = goalCard.dataset.goal;
                this.selectGoal(goalId);
            });
        });
        
        // Daily activities
        document.getElementById('collect-allowance-btn').addEventListener('click', () => {
            this.collectAllowance();
        });
        
        document.getElementById('complete-chore-btn').addEventListener('click', () => {
            this.completeChore();
        });
        
        // Smart choices
        document.getElementById('choice-save-btn').addEventListener('click', () => {
            this.handleSmartChoice('save');
        });
        
        document.getElementById('choice-spend-btn').addEventListener('click', () => {
            this.handleSmartChoice('spend');
        });
        
        // Mini games
        document.getElementById('coin-counting-btn').addEventListener('click', () => {
            this.startMiniGame('coinCounting');
        });
        
        document.getElementById('price-comparison-btn').addEventListener('click', () => {
            this.startMiniGame('priceComparison');
        });
        
        // Modal controls
        document.getElementById('close-game-modal').addEventListener('click', () => {
            this.hideModal('mini-game-modal');
        });
        
        document.getElementById('close-milestone-modal').addEventListener('click', () => {
            this.hideModal('milestone-modal');
        });
        
        document.getElementById('close-completion-modal').addEventListener('click', () => {
            this.hideModal('completion-modal');
        });
        
        document.getElementById('close-gallery-modal').addEventListener('click', () => {
            this.hideModal('gallery-modal');
        });
        
        // Action buttons
        document.getElementById('new-goal-btn').addEventListener('click', () => {
            this.showScreen('goal-selection-screen');
        });
        
        document.getElementById('new-goal-from-completion').addEventListener('click', () => {
            this.hideModal('completion-modal');
            this.showScreen('goal-selection-screen');
        });
        
        document.getElementById('view-gallery-btn').addEventListener('click', () => {
            this.showGallery();
        });
        
        // Mini game submission
        document.getElementById('submit-game-answer').addEventListener('click', () => {
            this.submitGameAnswer();
        });
        
        // Initialize daily updates
        this.startDailyTimer();
    }
    
    loadSavedState() {
        const savedState = this.game.gameState;
        if (savedState.currentGoal) {
            this.showScreen('main-dashboard-screen');
            this.updateDashboard();
        }
    }
    
    // Screen Management
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
        this.currentScreen = screenId;
    }
    
    // Goal Selection
    selectGoal(goalId) {
        const success = this.game.selectGoal(goalId);
        if (success) {
            this.selectedGoal = this.game.gameState.currentGoal;
            this.showScreen('main-dashboard-screen');
            this.updateDashboard();
            this.showToast(`Goal selected: ${this.selectedGoal.name}!`);
        } else {
            this.showToast('Failed to select goal. Please try again.', 'error');
        }
    }
    
    // Dashboard Updates
    updateDashboard() {
        const state = this.game.gameState;
        const goal = state.currentGoal;
        
        if (!goal) return;
        
        // Update goal display
        document.getElementById('current-goal-icon').textContent = goal.image;
        document.getElementById('current-goal-name').textContent = goal.name;
        document.getElementById('target-amount').textContent = state.targetAmount;
        document.getElementById('current-savings').textContent = state.currentSavings.toFixed(2);
        document.getElementById('display-savings').textContent = state.currentSavings.toFixed(2);
        
        // Update progress bar
        const progressPercentage = Math.min((state.currentSavings / state.targetAmount) * 100, 100);
        document.getElementById('progress-fill').style.width = `${progressPercentage}%`;
        document.getElementById('progress-percentage').textContent = `${Math.round(progressPercentage)}%`;
        
        // Update estimated completion
        const completionDate = this.game.calculateEstimatedCompletion();
        document.getElementById('completion-date').textContent = completionDate;
        
        // Update AI racers
        this.updateAIRacersUI();
        
        // Check for milestone celebrations
        this.checkMilestones(progressPercentage);
        
        // Check for goal completion
        if (progressPercentage >= 100) {
            this.celebrateGoalCompletion();
        }
        
        // Update button states
        this.updateButtonStates();
        
        // Show smart choice if conditions are met
        if (Math.random() > 0.7) {
            this.showSmartChoice();
        }
    }
    
    updateAIRacersUI() {
        this.game.aiRacers.forEach((racer, index) => {
            const racerId = racer.name.toLowerCase();
            const progressPercentage = Math.min((racer.savings / racer.target) * 100, 100);
            
            document.getElementById(`${racerId}-savings`).textContent = racer.savings.toFixed(2);
            document.getElementById(`${racerId}-target`).textContent = racer.target;
            document.getElementById(`${racerId}-progress-fill`).style.width = `${progressPercentage}%`;
        });
    }
    
    updateButtonStates() {
        const today = new Date().toDateString();
        const lastAllowance = this.game.gameState.lastAllowanceDate;
        
        // Disable allowance button if already collected today
        const allowanceBtn = document.getElementById('collect-allowance-btn');
        if (lastAllowance === today) {
            allowanceBtn.disabled = true;
            allowanceBtn.textContent = 'Collected';
        } else {
            allowanceBtn.disabled = false;
            allowanceBtn.textContent = '+$1';
        }
    }
    
    // Daily Activities
    collectAllowance() {
        const today = new Date().toDateString();
        if (this.game.gameState.lastAllowanceDate !== today) {
            this.game.addDailyAllowance();
            this.updateDashboard();
            this.showToast('Daily allowance collected! +$1');
            
            // Disable button
            const btn = document.getElementById('collect-allowance-btn');
            btn.disabled = true;
            btn.textContent = 'Collected';
        } else {
            this.showToast('Allowance already collected today!', 'warning');
        }
    }
    
    completeChore() {
        this.game.completeChore();
        this.updateDashboard();
        this.showToast('Chore completed! +$2');
        
        // Temporarily disable button
        const btn = document.getElementById('complete-chore-btn');
        btn.disabled = true;
        btn.textContent = 'Done!';
        
        setTimeout(() => {
            btn.disabled = false;
            btn.textContent = '+$2';
        }, 5000); // Re-enable after 5 seconds
    }
    
    // Smart Choices
    showSmartChoice() {
        const temptations = this.game.spendingTemptations;
        const temptation = temptations[Math.floor(Math.random() * temptations.length)];
        
        document.getElementById('choice-question').innerHTML = 
            `${temptation.emoji} Spend $${temptation.price} on ${temptation.item}?`;
        
        // Store current temptation for handling choice
        this.currentTemptation = temptation;
        
        document.getElementById('smart-choice-section').classList.remove('hidden');
    }
    
    handleSmartChoice(choice) {
        if (!this.currentTemptation) return;
        
        if (choice === 'save') {
            this.showToast(`Great choice! You saved $${this.currentTemptation.price}!`);
            // Bonus for good choice
            this.game.gameState.currentSavings += 0.5;
        } else {
            if (this.game.gameState.currentSavings >= this.currentTemptation.price) {
                this.game.gameState.currentSavings -= this.currentTemptation.price;
                this.showToast(`You spent $${this.currentTemptation.price} on ${this.currentTemptation.item}`, 'warning');
                this.showOpportunityCost(this.currentTemptation);
            } else {
                this.showToast('Not enough savings to spend!', 'error');
            }
        }
        
        this.updateDashboard();
        document.getElementById('smart-choice-section').classList.add('hidden');
        this.currentTemptation = null;
    }
    
    showOpportunityCost(temptation) {
        const daysDelayed = Math.ceil(temptation.price / 2); // Assuming $2/day average
        setTimeout(() => {
            this.showToast(`Opportunity cost: This delayed your goal by ${daysDelayed} days`, 'warning');
        }, 2000);
    }
    
    // Mini Games
    startMiniGame(gameType) {
        this.currentMiniGame = gameType;
        
        const modal = document.getElementById('mini-game-modal');
        const title = document.getElementById('game-modal-title');
        const body = document.getElementById('game-modal-body');
        
        if (gameType === 'coinCounting') {
            title.innerHTML = '🪙 Coin Counting';
            this.setupCoinCountingGame(body);
        } else if (gameType === 'priceComparison') {
            title.innerHTML = '💰 Price Comparison';
            this.setupPriceComparisonGame(body);
        }
        
        this.showModal('mini-game-modal');
    }
    
    setupCoinCountingGame(container) {
        const coins = [
            { type: 'penny', value: 0.01, count: Math.floor(Math.random() * 10) + 1 },
            { type: 'nickel', value: 0.05, count: Math.floor(Math.random() * 5) + 1 },
            { type: 'dime', value: 0.10, count: Math.floor(Math.random() * 8) + 1 },
            { type: 'quarter', value: 0.25, count: Math.floor(Math.random() * 4) + 1 }
        ];
        
        let totalValue = 0;
        coins.forEach(coin => {
            totalValue += coin.value * coin.count;
        });
        
        this.currentGameAnswer = Math.round(totalValue * 100) / 100;
        
        container.innerHTML = `
            <div class="game-question">
                <h4>Count these coins:</h4>
                <div class="coins-display">
                    ${coins.map(coin => `
                        <div class="coin-group">
                            <div style="font-size: 2em; margin-bottom: 10px;">
                                ${coin.type === 'penny' ? '🪙' : coin.type === 'nickel' ? '🪙' : 
                                  coin.type === 'dime' ? '🪙' : '🪙'}
                            </div>
                            <div>${coin.count} ${coin.type}${coin.count > 1 ? 's' : ''}</div>
                            <div>($${(coin.value * coin.count).toFixed(2)})</div>
                        </div>
                    `).join('')}
                </div>
                <p>What's the total value?</p>
                <input type="number" id="coin-answer" class="answer-input" placeholder="$0.00" step="0.01" min="0">
            </div>
        `;
    }
    
    setupPriceComparisonGame(container) {
        const items = [
            { name: 'Apple', priceA: 1.50, priceB: 1.25 },
            { name: 'Notebook', priceA: 3.00, priceB: 2.75 },
            { name: 'Pencil', priceA: 0.50, priceB: 0.75 },
            { name: 'Juice Box', priceA: 1.25, priceB: 1.50 },
            { name: 'Stickers', priceA: 2.00, priceB: 1.75 }
        ];
        
        const item = items[Math.floor(Math.random() * items.length)];
        this.currentGameAnswer = item.priceA < item.priceB ? 'A' : 'B';
        this.currentGameItem = item;
        
        container.innerHTML = `
            <div class="game-question">
                <h4>Which is cheaper?</h4>
                <div class="price-options">
                    <div class="price-option" data-choice="A">
                        <strong>Option A:</strong> ${item.name} for $${item.priceA.toFixed(2)}
                    </div>
                    <div class="price-option" data-choice="B">
                        <strong>Option B:</strong> ${item.name} for $${item.priceB.toFixed(2)}
                    </div>
                </div>
            </div>
        `;
        
        // Add click handlers for price options
        container.querySelectorAll('.price-option').forEach(option => {
            option.addEventListener('click', () => {
                container.querySelectorAll('.price-option').forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
            });
        });
    }
    
    submitGameAnswer() {
        let userAnswer;
        let correct = false;
        
        if (this.currentMiniGame === 'coinCounting') {
            userAnswer = parseFloat(document.getElementById('coin-answer').value);
            correct = Math.abs(userAnswer - this.currentGameAnswer) < 0.01;
        } else if (this.currentMiniGame === 'priceComparison') {
            const selected = document.querySelector('.price-option.selected');
            if (selected) {
                userAnswer = selected.dataset.choice;
                correct = userAnswer === this.currentGameAnswer;
            }
        }
        
        const gameData = this.game.miniGames[this.currentMiniGame];
        
        if (correct) {
            this.game.gameState.currentSavings += gameData.reward;
            this.showToast(`Correct! You earned $${gameData.reward}`);
        } else {
            this.showToast('Not quite right. Try again next time!', 'error');
        }
        
        this.updateDashboard();
        this.hideModal('mini-game-modal');
    }
    
    // Milestone System
    checkMilestones(progressPercentage) {
        const milestones = [25, 50, 75];
        
        milestones.forEach(milestone => {
            if (progressPercentage >= milestone && !this.hasCelebratedMilestone(milestone)) {
                this.celebrateMilestone(milestone);
            }
        });
    }
    
    hasCelebratedMilestone(milestone) {
        return this.game.gameState.milestonesReached && 
               this.game.gameState.milestonesReached.includes(milestone);
    }
    
    celebrateMilestone(milestone) {
        if (!this.game.gameState.milestonesReached) {
            this.game.gameState.milestonesReached = [];
        }
        this.game.gameState.milestonesReached.push(milestone);
        
        document.querySelector('.milestone-percentage').textContent = `${milestone}%`;
        
        const messages = {
            25: "Great start! You're a quarter of the way there!",
            50: "Halfway there! You're doing amazing!",
            75: "So close! You're three-quarters done!"
        };
        
        document.getElementById('milestone-message').textContent = messages[milestone];
        
        this.showModal('milestone-modal');
        this.game.saveGameState();
    }
    
    // Goal Completion
    celebrateGoalCompletion() {
        const goal = this.game.gameState.currentGoal;
        
        document.getElementById('purchased-item').textContent = goal.image;
        document.getElementById('completed-goal-name').textContent = goal.name;
        document.getElementById('certificate-amount').textContent = goal.price;
        document.getElementById('certificate-goal').textContent = goal.name;
        document.getElementById('certificate-date').textContent = new Date().toLocaleDateString();
        
        // Add to completed goals
        this.game.addToPhotoGallery();
        
        this.showModal('completion-modal');
    }
    
    // Gallery
    showGallery() {
        const galleryItems = document.getElementById('gallery-items');
        const emptyGallery = document.getElementById('empty-gallery');
        const completedGoals = this.game.gameState.completedGoals || [];
        
        if (completedGoals.length === 0) {
            galleryItems.style.display = 'none';
            emptyGallery.style.display = 'block';
        } else {
            galleryItems.style.display = 'grid';
            emptyGallery.style.display = 'none';
            
            galleryItems.innerHTML = completedGoals.map(goal => {
                const date = new Date(goal.completedDate).toLocaleDateString();
                return `
                    <div class="gallery-item">
                        <div class="gallery-icon">${goal.image}</div>
                        <div class="gallery-name">${goal.name}</div>
                        <div class="gallery-date">${date}</div>
                    </div>
                `;
            }).join('');
        }
        
        this.showModal('gallery-modal');
    }
    
    // Modal Management
    showModal(modalId) {
        document.getElementById(modalId).classList.remove('hidden');
    }
    
    hideModal(modalId) {
        document.getElementById(modalId).classList.add('hidden');
    }
    
    // Toast Messages
    showToast(message, type = 'success') {
        const toast = document.getElementById('message-toast');
        const content = document.getElementById('toast-content');
        
        content.textContent = message;
        toast.className = `message-toast ${type}`;
        toast.classList.remove('hidden');
        
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 3000);
    }
    
    // Daily Timer
    startDailyTimer() {
        // Update AI racers periodically
        setInterval(() => {
            this.game.updateAIRacers();
            this.updateAIRacersUI();
        }, 30000); // Every 30 seconds
        
        // Check for daily activities
        setInterval(() => {
            this.updateButtonStates();
        }, 60000); // Every minute
    }
    
    // Public API
    getGameStatus() {
        return this.game.getGameStatus();
    }
    
    resetGame() {
        this.game.startNewGame();
        this.showScreen('goal-selection-screen');
        this.showToast('Game reset! Choose a new goal to start over.');
    }
}

// Initialize the UI when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait for the main game script to load
    if (typeof PiggyBankRaceGame !== 'undefined') {
        window.piggyBankUI = new PiggyBankRaceUI();
    } else {
        // Retry after a short delay if the game class isn't ready
        setTimeout(() => {
            if (typeof PiggyBankRaceGame !== 'undefined') {
                window.piggyBankUI = new PiggyBankRaceUI();
            }
        }, 100);
    }
});

// Add some utility functions for debugging
window.debugPiggyBank = {
    addMoney: (amount) => {
        if (window.piggyBankUI && window.piggyBankUI.game) {
            window.piggyBankUI.game.gameState.currentSavings += amount;
            window.piggyBankUI.updateDashboard();
            window.piggyBankUI.showToast(`Added $${amount} for testing`);
        }
    },
    
    triggerMilestone: (percentage) => {
        if (window.piggyBankUI) {
            window.piggyBankUI.celebrateMilestone(percentage);
        }
    },
    
    completeGoal: () => {
        if (window.piggyBankUI && window.piggyBankUI.game) {
            const target = window.piggyBankUI.game.gameState.targetAmount;
            window.piggyBankUI.game.gameState.currentSavings = target;
            window.piggyBankUI.updateDashboard();
        }
    }
};