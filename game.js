class SonicMathGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.sonic = new Sonic(this.canvas);

        this.score = 0;
        this.correctAnswers = 0;
        this.wrongAnswers = 0;
        this.gameTime = 120; // 2 minutes in seconds
        this.answerTime = 5000; // 5 seconds in milliseconds
        this.lastAnswerTime = Date.now();
        this.selectedOperation = null;

        // Speed settings
        this.baseSpeed = 2;
        this.maxSpeed = 8;  // Increased max speed
        this.speedMultiplier = 1;  // Tracks speed increase based on correct answers

        this.setupCanvas();
        this.setupAudio();
        this.setupEventListeners();
        this.startGame();
    }

    setupCanvas() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;

        window.addEventListener('resize', () => {
            this.canvas.width = this.canvas.offsetWidth;
            this.canvas.height = this.canvas.offsetHeight;
        });
    }

    setupAudio() {
        this.synth = new Tone.Synth().toDestination();
    }

    setupEventListeners() {
        document.querySelectorAll('.operation-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.selectedOperation = btn.dataset.operation;
                this.generateQuestion();
            });
        });

        document.getElementById('answer').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.checkAnswer();
            }
        });
    }

    generateQuestion() {
        let num1, num2, question;

        switch (this.selectedOperation) {
            case 'add':
                num1 = Math.floor(Math.random() * 100);
                num2 = Math.floor(Math.random() * 100);
                question = `${num1} + ${num2}`;
                this.currentAnswer = num1 + num2;
                break;
            case 'subtract':
                num1 = Math.floor(Math.random() * 100);
                num2 = Math.floor(Math.random() * num1);
                question = `${num1} - ${num2}`;
                this.currentAnswer = num1 - num2;
                break;
            case 'multiply':
                num1 = Math.floor(Math.random() * 12);
                num2 = Math.floor(Math.random() * 12);
                question = `${num1} × ${num2}`;
                this.currentAnswer = num1 * num2;
                break;
            case 'divide':
                num2 = Math.floor(Math.random() * 11) + 1;
                num1 = num2 * (Math.floor(Math.random() * 10) + 1);
                question = `${num1} ÷ ${num2}`;
                this.currentAnswer = num1 / num2;
                break;
        }

        document.getElementById('question').textContent = question;
        document.getElementById('answer').value = '';
        this.lastAnswerTime = Date.now();
    }

    checkAnswer() {
        const userAnswer = parseFloat(document.getElementById('answer').value);
        const timeTaken = (Date.now() - this.lastAnswerTime) / 1000;

        if (userAnswer === this.currentAnswer) {
            this.score += Math.max(1, 5 - Math.floor(timeTaken));
            this.correctAnswers++;
            this.synth.triggerAttackRelease("C4", "8n");

            // Progressive speed increase
            this.speedMultiplier = Math.min(4, 1 + (this.correctAnswers * 0.1));
            this.sonic.setSpeed(this.baseSpeed * this.speedMultiplier);

        } else {
            this.wrongAnswers++;
            this.synth.triggerAttackRelease("G3", "8n");
            // Reduced penalty for wrong answers
            this.speedMultiplier = Math.max(1, this.speedMultiplier * 0.9);
            this.sonic.setSpeed(this.baseSpeed * this.speedMultiplier);
        }

        document.getElementById('score').textContent = this.score;
        this.generateQuestion();
    }

    updateTimer() {
        const minutes = Math.floor(this.gameTime / 60);
        const seconds = this.gameTime % 60;
        document.getElementById('timer').textContent =
            `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    showResults() {
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('correctAnswers').textContent = this.correctAnswers;
        document.getElementById('wrongAnswers').textContent = this.wrongAnswers;
        new bootstrap.Modal(document.getElementById('resultsModal')).show();
    }

    gameLoop() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update Sonic's speed based on answer time
        const currentTime = Date.now();
        const timeSinceLastAnswer = (currentTime - this.lastAnswerTime) / 1000;

        // Gradual slowdown if taking too long to answer
        if (timeSinceLastAnswer > 3) {
            const slowdownFactor = Math.max(0.5, 1 - (timeSinceLastAnswer - 3) / 4);
            this.sonic.setSpeed(this.baseSpeed * this.speedMultiplier * slowdownFactor);
        }

        this.sonic.update();
        this.sonic.draw();

        if (this.gameTime > 0) {
            requestAnimationFrame(() => this.gameLoop());
        } else {
            this.showResults();
        }
    }

    startGame() {
        this.generateQuestion();

        // Start timer
        const timerInterval = setInterval(() => {
            this.gameTime--;
            this.updateTimer();
            if (this.gameTime <= 0) {
                clearInterval(timerInterval);
            }
        }, 1000);

        this.gameLoop();
    }
}

// Start the game when the page loads
window.addEventListener('load', () => {
    new SonicMathGame();
});
