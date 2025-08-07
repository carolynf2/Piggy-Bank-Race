// Piggy Bank Race Game - JavaScript Implementation
class PiggyBankRaceGame {
    constructor() {
        this.gameState = {
            currentGoal: null,
            targetAmount: 0,
            currentSavings: 0,
            dailyAllowance: 1,
            choreReward: 2,
            lastAllowanceDate: null,
            completedGoals: [],
            gamePhase: 'goal-selection'
        };
        
        this.availableGoals = [
            { id: 'basketball', name: '🏀 Basketball', price: 25, image: '🏀' },
            { id: 'videogame', name: '🎮 Video Game', price: 50, image: '🎮' },
            { id: 'bike', name: '🚲 Bike', price: 100, image: '🚲' },
            { id: 'toy', name: '🧸 Toy', price: 10, image: '🧸' },
            { id: 'book', name: '📚 Book', price: 15, image: '📚' },
            { id: 'headphones', name: '🎧 Headphones', price: 75, image: '🎧' }
        ];
        
        this.aiRacers = [
            { name: 'Mia', emoji: '🐭', target: 25, savings: 8, dailyProgress: 0.5 },
            { name: 'Max', emoji: '🐶', target: 50, savings: 15, dailyProgress: 1.2 },
            { name: 'Ruby', emoji: '🐰', target: 10, savings: 5, dailyProgress: 0.3 }
        ];
        
        this.spendingTemptations = [
            { item: 'candy', price: 2, emoji: '🍭' },
            { item: 'soda', price: 3, emoji: '🥤' },
            { item: 'chips', price: 2, emoji: '🍿' },
            { item: 'toy', price: 5, emoji: '🪀' },
            { item: 'comic book', price: 4, emoji: '📖' }
        ];
        
        this.miniGames = {
            coinCounting: {
                name: 'Coin Counting',
                emoji: '🪙',
                reward: 0.5,
                difficulty: 1
            },
            priceComparison: {
                name: 'Price Comparison',
                emoji: '💰',
                reward: 1,
                difficulty: 2
            }
        };
        
        this.milestoneThresholds = [25, 50, 75, 100];
        this.interestRate = 0.5; // $0.50 per week
        this.lastInterestDate = null;
        
        this.init();
    }
    
    init() {
        this.loadGameState();
        this.startGame();
    }
    
    // Game State Management
    loadGameState() {
        const savedState = localStorage.getItem('piggyBankRaceState');
        if (savedState) {
            this.gameState = { ...this.gameState, ...JSON.parse(savedState) };
        }
        
        // Initialize dates if not set
        if (!this.gameState.lastAllowanceDate) {
            this.gameState.lastAllowanceDate = new Date().toDateString();
        }
        if (!this.lastInterestDate) {
            this.lastInterestDate = new Date().toDateString();
        }
    }
    
    saveGameState() {
        localStorage.setItem('piggyBankRaceState', JSON.stringify(this.gameState));
    }
    
    // START GAME - Load Goal Selection Screen
    startGame() {
        console.log('🐷 The Piggy Bank Race - Starting Game!');
        this.loadGoalSelectionScreen();
    }
    
    // GOAL SELECTION
    loadGoalSelectionScreen() {
        console.log('📋 Goal Selection Screen');
        this.gameState.gamePhase = 'goal-selection';
        
        this.displayAvailableGoals();
        
        // Auto-proceed to main dashboard if goal already selected
        if (this.gameState.currentGoal) {
            setTimeout(() => this.proceedToMainDashboard(), 1000);
        }
    }
    
    displayAvailableGoals() {
        console.log('Available Goals:');
        this.availableGoals.forEach((goal, index) => {
            console.log(`${index + 1}. ${goal.name} - $${goal.price} ${goal.image}`);
        });
    }
    
    selectGoal(goalId) {
        const selectedGoal = this.availableGoals.find(goal => goal.id === goalId);
        if (!selectedGoal) {
            console.error('Invalid goal selection');
            return false;
        }
        
        // Initialize goal data
        this.gameState.currentGoal = selectedGoal;
        this.gameState.targetAmount = selectedGoal.price;
        this.gameState.currentSavings = 0;
        
        console.log(`🎯 Goal Selected: ${selectedGoal.name} - Target: $${selectedGoal.price}`);
        
        // Display goal image and description
        this.displayGoalDetails(selectedGoal);
        
        // Initialize savings progress bar and estimated completion
        this.initializeSavingsTracking();
        
        this.saveGameState();
        this.proceedToMainDashboard();
        
        return true;
    }
    
    displayGoalDetails(goal) {
        console.log(`\n🎯 Your Savings Goal:`);
        console.log(`${goal.image} ${goal.name}`);
        console.log(`Target Amount: $${goal.price}`);
        console.log(`Description: Save up for your ${goal.name.toLowerCase()}!`);
    }
    
    initializeSavingsTracking() {
        const progressBar = this.calculateProgressBar();
        const estimatedCompletion = this.calculateEstimatedCompletion();
        
        console.log(`Progress: ${progressBar}`);
        console.log(`📅 Estimated Completion: ${estimatedCompletion}`);
    }
    
    calculateProgressBar() {
        const progress = Math.min((this.gameState.currentSavings / this.gameState.targetAmount) * 100, 100);
        const filledBlocks = Math.floor(progress / 2); // 50 blocks total
        const emptyBlocks = 50 - filledBlocks;
        
        return `[${'█'.repeat(filledBlocks)}${'░'.repeat(emptyBlocks)}] ${Math.round(progress)}%`;
    }
    
    calculateEstimatedCompletion() {
        const remaining = this.gameState.targetAmount - this.gameState.currentSavings;
        const dailyAverage = this.gameState.dailyAllowance + (this.gameState.choreReward / 2); // Assume 50% chore completion
        const daysRemaining = Math.ceil(remaining / dailyAverage);
        
        const completionDate = new Date();
        completionDate.setDate(completionDate.getDate() + daysRemaining);
        
        return completionDate.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
        });
    }
    
    // MAIN DASHBOARD
    proceedToMainDashboard() {
        console.log('\n🏠 Main Dashboard');
        this.gameState.gamePhase = 'main-dashboard';
        
        this.showPiggyBankAnimation();
        this.displayDashboard();
        this.updateAIRacers();
        
        // Check for daily activities
        this.checkDailyEarnings();
    }
    
    showPiggyBankAnimation() {
        console.log('🐷💰 [Piggy Bank Animation Playing...]');
        
        // Simulate animation frames
        const animations = ['🐷', '🐷💰', '🐷💎', '🐷✨'];
        let frame = 0;
        
        const animate = () => {
            console.log(`Animation Frame: ${animations[frame % animations.length]}`);
            frame++;
            if (frame < 8) {
                setTimeout(animate, 500);
            }
        };
        
        animate();
    }
    
    displayDashboard() {
        const goal = this.gameState.currentGoal;
        const progressBar = this.calculateProgressBar();
        const estimatedCompletion = this.calculateEstimatedCompletion();
        
        console.log('\n+-------------------------------------------------------------+');
        console.log(`|                    🐷 The Piggy Bank Race                   |`);
        console.log('+-------------------------------------------------------------+');
        console.log(`| Goal: ${goal.image} ${goal.name}  Target: $${goal.price}   Saved: $${this.gameState.currentSavings}             |`);
        console.log(`| Progress: ${progressBar}  |`);
        console.log(`| Estimated Completion: 📅 ${estimatedCompletion}                             |`);
        console.log('+-------------------------------------------------------------+');
        console.log('|                                                             |');
        console.log('|  [ Piggy Bank Animation 🐷💰 ]                                |');
        console.log('|                                                             |');
        
        this.displayAIRacers();
        
        console.log('|                                                             |');
        console.log('+-------------------------------------------------------------+');
    }
    
    displayAIRacers() {
        console.log('|  [ AI Racers ]                                              |');
        this.aiRacers.forEach(racer => {
            const progress = Math.round((racer.savings / racer.target) * 100);
            console.log(`|  ${racer.emoji} ${racer.name}: $${racer.savings}/$${racer.target}   Progress: ${progress}%`);
        });
    }
    
    updateAIRacers() {
        this.aiRacers.forEach(racer => {
            // Simulate AI progress
            racer.savings += racer.dailyProgress * (Math.random() * 0.5 + 0.75); // 75-125% of daily progress
            racer.savings = Math.min(racer.savings, racer.target);
            racer.savings = Math.round(racer.savings * 100) / 100; // Round to 2 decimal places
        });
    }
    
    // DAILY EARNINGS
    checkDailyEarnings() {
        const today = new Date().toDateString();
        
        if (this.gameState.lastAllowanceDate !== today) {
            this.addDailyAllowance();
            this.gameState.lastAllowanceDate = today;
        }
        
        // Check for weekly interest
        this.checkWeeklyInterest();
        
        // Present chore opportunity
        this.presentChoreOpportunity();
        
        this.saveGameState();
    }
    
    addDailyAllowance() {
        this.gameState.currentSavings += this.gameState.dailyAllowance;
        console.log(`\n💵 Daily Allowance: +$${this.gameState.dailyAllowance}`);
        console.log(`Total Savings: $${this.gameState.currentSavings}`);
        
        this.updateProgress();
    }
    
    presentChoreOpportunity() {
        console.log(`\n🧹 Chore Available: "Clean your room for $${this.gameState.choreReward}?"`);
        console.log('Would you like to complete the chore? [Y/N]');
        
        // Simulate user choice (in real implementation, this would be user input)
        const userChoice = Math.random() > 0.3 ? 'Y' : 'N';
        this.handleChoreChoice(userChoice);
    }
    
    handleChoreChoice(choice) {
        if (choice.toLowerCase() === 'y') {
            this.completeChore();
        } else {
            console.log('Chore skipped. No additional earnings.');
        }
    }
    
    completeChore() {
        this.gameState.currentSavings += this.gameState.choreReward;
        console.log(`🧹 Chore Completed: +$${this.gameState.choreReward}`);
        console.log(`Total Savings: $${this.gameState.currentSavings}`);
        
        this.updateProgress();
    }
    
    // SMART CHOICE PROMPT
    presentSmartChoicePrompt() {
        const temptation = this.spendingTemptations[
            Math.floor(Math.random() * this.spendingTemptations.length)
        ];
        
        console.log(`\n💡 Smart Choice: "${temptation.emoji} Spend $${temptation.price} on ${temptation.item}?"`);
        console.log('    → [Save] [Spend]');
        
        // Simulate user choice
        const userChoice = Math.random() > 0.4 ? 'Save' : 'Spend';
        this.handleSmartChoice(userChoice, temptation);
    }
    
    handleSmartChoice(choice, temptation) {
        if (choice === 'Save') {
            console.log(`✅ Great choice! You saved $${temptation.price}!`);
            console.log(`💪 You're ${temptation.price} closer to your ${this.gameState.currentGoal.name}!`);
        } else {
            if (this.gameState.currentSavings >= temptation.price) {
                this.gameState.currentSavings -= temptation.price;
                console.log(`💸 You spent $${temptation.price} on ${temptation.item}`);
                this.showOpportunityCostMessage(temptation);
                this.updateProgress();
            } else {
                console.log(`❌ Not enough savings to spend $${temptation.price}`);
            }
        }
    }
    
    showOpportunityCostMessage(temptation) {
        const daysDelayed = Math.ceil(temptation.price / (this.gameState.dailyAllowance + this.gameState.choreReward/2));
        console.log(`\n⚠️ Opportunity Cost: This purchase delayed your goal by ${daysDelayed} days`);
        console.log(`💭 Remember: Every dollar saved gets you closer to your ${this.gameState.currentGoal.name}!`);
    }
    
    // MINI-GAMES
    playMiniGame(gameType) {
        console.log(`\n🎮 Starting Mini-Game: ${this.miniGames[gameType].name} ${this.miniGames[gameType].emoji}`);
        
        if (gameType === 'coinCounting') {
            this.playCoinCounting();
        } else if (gameType === 'priceComparison') {
            this.playPriceComparison();
        }
    }
    
    playCoinCounting() {
        const coins = [
            { type: 'penny', value: 0.01, count: Math.floor(Math.random() * 10) + 1 },
            { type: 'nickel', value: 0.05, count: Math.floor(Math.random() * 5) + 1 },
            { type: 'dime', value: 0.10, count: Math.floor(Math.random() * 8) + 1 },
            { type: 'quarter', value: 0.25, count: Math.floor(Math.random() * 4) + 1 }
        ];
        
        let totalValue = 0;
        console.log('Count these coins:');
        coins.forEach(coin => {
            console.log(`${coin.count} ${coin.type}${coin.count > 1 ? 's' : ''}`);
            totalValue += coin.value * coin.count;
        });
        
        const correctAnswer = Math.round(totalValue * 100) / 100;
        console.log(`What's the total value? $${correctAnswer}`);
        
        // Simulate correct answer (in real implementation, this would be user input)
        const userAnswered = Math.random() > 0.2; // 80% success rate
        this.handleMiniGameResult('coinCounting', userAnswered, correctAnswer);
    }
    
    playPriceComparison() {
        const items = [
            { name: 'Apple', priceA: 1.50, priceB: 1.25 },
            { name: 'Notebook', priceA: 3.00, priceB: 2.75 },
            { name: 'Pencil', priceA: 0.50, priceB: 0.75 }
        ];
        
        const item = items[Math.floor(Math.random() * items.length)];
        console.log(`Which is cheaper?`);
        console.log(`A) ${item.name} for $${item.priceA}`);
        console.log(`B) ${item.name} for $${item.priceB}`);
        
        const correctAnswer = item.priceA < item.priceB ? 'A' : 'B';
        console.log(`Correct answer: ${correctAnswer}`);
        
        // Simulate correct answer
        const userAnswered = Math.random() > 0.15; // 85% success rate
        this.handleMiniGameResult('priceComparison', userAnswered, correctAnswer);
    }
    
    handleMiniGameResult(gameType, correct, answer) {
        if (correct) {
            const reward = this.miniGames[gameType].reward;
            this.gameState.currentSavings += reward;
            console.log(`🎉 Correct! You earned $${reward}`);
            console.log(`Total Savings: $${this.gameState.currentSavings}`);
            this.updateProgress();
        } else {
            console.log('❌ Not quite right. Try again next time!');
        }
    }
    
    // MILESTONE CELEBRATIONS
    updateProgress() {
        const progressPercentage = (this.gameState.currentSavings / this.gameState.targetAmount) * 100;
        
        this.milestoneThresholds.forEach(milestone => {
            if (progressPercentage >= milestone && !this.hasReachedMilestone(milestone)) {
                this.celebrateMilestone(milestone);
            }
        });
        
        // Check for goal completion
        if (progressPercentage >= 100) {
            this.completeGoal();
        }
        
        this.saveGameState();
    }
    
    hasReachedMilestone(milestone) {
        return this.gameState.milestonesReached && 
               this.gameState.milestonesReached.includes(milestone);
    }
    
    celebrateMilestone(milestone) {
        if (!this.gameState.milestonesReached) {
            this.gameState.milestonesReached = [];
        }
        
        this.gameState.milestonesReached.push(milestone);
        
        console.log(`\n🎉 MILESTONE REACHED: ${milestone}%! 🎉`);
        console.log('✨ Amazing progress! Keep going! ✨');
        
        // Trigger animations and motivational messages
        this.triggerMilestoneAnimation(milestone);
        this.showMotivationalMessage(milestone);
    }
    
    triggerMilestoneAnimation(milestone) {
        const animations = ['🎉', '✨', '🌟', '🎊'];
        console.log(`[Milestone Animation: ${animations.join(' ')} ${milestone}% Complete! ${animations.join(' ')}]`);
    }
    
    showMotivationalMessage(milestone) {
        const messages = {
            25: "Great start! You're a quarter of the way there!",
            50: "Halfway there! You're doing amazing!",
            75: "So close! You're three-quarters done!",
            100: "Congratulations! You've reached your goal!"
        };
        
        console.log(`💬 ${messages[milestone]}`);
    }
    
    // INTEREST SIMULATION
    checkWeeklyInterest() {
        const today = new Date();
        const lastInterest = new Date(this.lastInterestDate);
        const daysDifference = Math.floor((today - lastInterest) / (1000 * 60 * 60 * 24));
        
        if (daysDifference >= 7) {
            this.addInterest();
            this.lastInterestDate = today.toDateString();
        }
    }
    
    addInterest() {
        this.gameState.currentSavings += this.interestRate;
        console.log(`\n📈 Weekly Interest: +$${this.interestRate}`);
        console.log(`💡 Your money is growing! Total: $${this.gameState.currentSavings}`);
        
        this.updateProgress();
    }
    
    // GOAL COMPLETION
    completeGoal() {
        if (this.gameState.currentSavings >= this.gameState.targetAmount) {
            console.log('\n🏆 GOAL COMPLETED! 🏆');
            
            this.triggerVirtualPurchaseCeremony();
            this.displayAchievementCertificate();
            this.addToPhotoGallery();
            
            setTimeout(() => {
                this.presentRepeatOrExitOptions();
            }, 3000);
        }
    }
    
    triggerVirtualPurchaseCeremony() {
        console.log('\n🎊 VIRTUAL PURCHASE CEREMONY 🎊');
        console.log('🎉✨🎊✨🎉✨🎊✨🎉');
        console.log(`🛍️ Congratulations! You can now buy your ${this.gameState.currentGoal.name}!`);
        console.log(`${this.gameState.currentGoal.image} Here's your virtual ${this.gameState.currentGoal.name}! ${this.gameState.currentGoal.image}`);
        console.log('🎉✨🎊✨🎉✨🎊✨🎉');
    }
    
    displayAchievementCertificate() {
        const completionDate = new Date().toLocaleDateString();
        
        console.log('\n📜 CERTIFICATE OF ACHIEVEMENT 📜');
        console.log('╔══════════════════════════════════════╗');
        console.log('║        🏆 SAVINGS CHAMPION 🏆        ║');
        console.log('║                                      ║');
        console.log(`║     Successfully saved $${this.gameState.targetAmount}     ║`);
        console.log(`║       for ${this.gameState.currentGoal.name}       ║`);
        console.log('║                                      ║');
        console.log(`║     Completed: ${completionDate}     ║`);
        console.log('║                                      ║');
        console.log('║        🌟 WELL DONE! 🌟             ║');
        console.log('╚══════════════════════════════════════╝');
    }
    
    addToPhotoGallery() {
        if (!this.gameState.completedGoals) {
            this.gameState.completedGoals = [];
        }
        
        const completedGoal = {
            ...this.gameState.currentGoal,
            completedDate: new Date().toISOString(),
            finalAmount: this.gameState.currentSavings
        };
        
        this.gameState.completedGoals.push(completedGoal);
        
        console.log('\n📸 Added to Photo Gallery!');
        console.log('Gallery Items:');
        this.gameState.completedGoals.forEach((goal, index) => {
            const date = new Date(goal.completedDate).toLocaleDateString();
            console.log(`${index + 1}. ${goal.image} ${goal.name} - Completed: ${date}`);
        });
        
        this.saveGameState();
    }
    
    // REPEAT OR EXIT
    presentRepeatOrExitOptions() {
        console.log('\n🔄 What would you like to do next?');
        console.log('1. Set a new savings goal');
        console.log('2. Exit the game');
        console.log('Choose your option: [1] [2]');
        
        // Simulate user choice
        const userChoice = Math.random() > 0.3 ? '1' : '2';
        this.handleRepeatOrExit(userChoice);
    }
    
    handleRepeatOrExit(choice) {
        if (choice === '1') {
            this.resetForNewGoal();
            this.loadGoalSelectionScreen();
        } else {
            this.exitGame();
        }
    }
    
    resetForNewGoal() {
        // Reset current goal data but keep completed goals and AI racers
        this.gameState.currentGoal = null;
        this.gameState.targetAmount = 0;
        this.gameState.currentSavings = 0;
        this.gameState.milestonesReached = [];
        this.gameState.gamePhase = 'goal-selection';
        
        console.log('🔄 Ready for a new savings adventure!');
    }
    
    exitGame() {
        console.log('\n👋 Thanks for playing The Piggy Bank Race!');
        console.log('💰 Remember: Every penny saved is a step toward your dreams!');
        console.log('🐷 Come back anytime to continue your savings journey!');
        
        this.saveGameState();
    }
    
    // Game Simulation Methods
    simulateDay() {
        console.log('\n--- NEW DAY ---');
        this.checkDailyEarnings();
        
        // Random events
        if (Math.random() > 0.7) {
            this.presentSmartChoicePrompt();
        }
        
        if (Math.random() > 0.8) {
            const games = Object.keys(this.miniGames);
            const randomGame = games[Math.floor(Math.random() * games.length)];
            this.playMiniGame(randomGame);
        }
        
        this.updateAIRacers();
        this.displayDashboard();
    }
    
    // Public API Methods
    startNewGame() {
        this.gameState = {
            currentGoal: null,
            targetAmount: 0,
            currentSavings: 0,
            dailyAllowance: 1,
            choreReward: 2,
            lastAllowanceDate: new Date().toDateString(),
            completedGoals: [],
            gamePhase: 'goal-selection'
        };
        this.startGame();
    }
    
    getGameStatus() {
        return {
            phase: this.gameState.gamePhase,
            currentGoal: this.gameState.currentGoal,
            savings: this.gameState.currentSavings,
            target: this.gameState.targetAmount,
            progress: this.gameState.targetAmount > 0 ? 
                Math.round((this.gameState.currentSavings / this.gameState.targetAmount) * 100) : 0,
            completedGoals: this.gameState.completedGoals?.length || 0
        };
    }
}

// Initialize and run the game
const piggyBankGame = new PiggyBankRaceGame();

// Example usage and game simulation
console.log('\n🎮 GAME SIMULATION STARTING...\n');

// Simulate goal selection
piggyBankGame.selectGoal('basketball');

// Simulate a few days of gameplay
setTimeout(() => {
    piggyBankGame.simulateDay();
}, 2000);

setTimeout(() => {
    piggyBankGame.simulateDay();
}, 4000);

setTimeout(() => {
    piggyBankGame.simulateDay();
}, 6000);

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PiggyBankRaceGame;
}