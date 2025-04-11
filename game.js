// This is a test script to verify JavaScript loading
console.log("JavaScript is running!");

// Simple game setup - direct approach with minimal code
window.onload = function() {
    console.log("Window loaded!");
    
    const canvas = document.getElementById('game-canvas');
    if (!canvas) {
        console.error("Canvas element not found!");
        return;
    }
    
    const ctx = canvas.getContext('2d');
    const gameContainer = document.querySelector('.game-container');
    
    // Create bird elements with CSS styling
    const birdElement = document.createElement('div');
    birdElement.className = 'bird';
    
    const wingElement = document.createElement('div');
    wingElement.className = 'wing';
    
    const beakElement = document.createElement('div');
    beakElement.className = 'beak';
    
    birdElement.appendChild(wingElement);
    birdElement.appendChild(beakElement);
    gameContainer.appendChild(birdElement);
    
    // Position the bird
    let birdY = canvas.height / 2 - 15;
    updateBirdPosition();
    
    // Draw background and ground
    function drawBackground() {
        // Clear canvas
        ctx.fillStyle = '#70c5ce';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw ground
        ctx.fillStyle = '#ded895';
        ctx.fillRect(0, canvas.height - 90, canvas.width, 90);
    }
    
    // Call once to draw background
    drawBackground();
    
    // Bird physics
    let velocity = 0;
    const gravity = 0.5;
    const jumpStrength = -8;
    
    function updateBirdPosition() {
        birdElement.style.left = '50px';
        birdElement.style.top = birdY + 'px';
    }
    
    // Add click event for jumping
    canvas.addEventListener('click', function() {
        console.log("Canvas clicked - bird jumps!");
        velocity = jumpStrength;
    });
    
    // Add space key for jumping
    window.addEventListener('keydown', function(e) {
        if (e.code === 'Space') {
            console.log("Space pressed - bird jumps!");
            velocity = jumpStrength;
        }
    });
    
    // Game loop
    function gameLoop() {
        // Apply gravity
        velocity += gravity;
        birdY += velocity;
        
        // Constrain bird to canvas
        if (birdY > canvas.height - 114) { // 90 for ground + 24 for bird height
            birdY = canvas.height - 114;
            velocity = 0;
        }
        
        if (birdY < 0) {
            birdY = 0;
            velocity = 0;
        }
        
        updateBirdPosition();
        drawBackground();
        
        requestAnimationFrame(gameLoop);
    }
    
    // Start game loop
    gameLoop();
};

// Game constants
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    const scoreDisplay = document.getElementById('score-display');
    const finalScore = document.getElementById('final-score');
    const gameOverScreen = document.getElementById('game-over');
    const startScreen = document.getElementById('start-screen');
    const restartButton = document.getElementById('restart-button');

    // Game variables
    let score = 0;
    let isGameActive = false;
    let animationFrameId;
    let lastTime = 0;
    let pipeInterval = 1500; // milliseconds
    let timeSinceLastPipe = 0;

    // Bird properties
    const bird = {
        x: 50,
        y: canvas.height / 2 - 15,
        width: 34,
        height: 24,
        gravity: 0.5,
        velocity: 0,
        jumpStrength: -8
    };

    // Pipes array
    let pipes = [];
    const pipeGap = 130;
    const pipeWidth = 52;

    // Images
    const sprites = new Image();
    
    // Add error handling for sprite loading
    sprites.onerror = function() {
        console.error('Error loading sprite image');
        // Draw a simple bird and pipes as fallback
        drawFallbackGame();
    };

    // Create a function to draw fallback graphics if the sprite doesn't load
    function drawFallbackGame() {
        // Draw background
        ctx.fillStyle = '#70c5ce';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw a simple bird
        ctx.fillStyle = 'yellow';
        ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
        
        // Draw ground
        ctx.fillStyle = '#ded895';
        ctx.fillRect(0, canvas.height - 90, canvas.width, 90);
    }

    sprites.src = 'data:image/png;base64,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';

    // Background (day sky)
    const background = {
        draw: function() {
            ctx.fillStyle = '#70c5ce';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    };

    // Base (ground)
    const base = {
        y: canvas.height - 90,
        height: 90,
        width: canvas.width,
        draw: function() {
            try {
                ctx.drawImage(
                    sprites, 
                    0, 610, 
                    288, 110, 
                    0, this.y, 
                    this.width, this.height
                );
            } catch(e) {
                console.error('Error drawing base:', e);
                // Draw fallback ground
                ctx.fillStyle = '#ded895';
                ctx.fillRect(0, this.y, this.width, this.height);
            }
        }
    };

    // Bird
    function drawBird() {
        try {
            // Animation frames for bird flapping wings
            const birdFrames = [
                { spriteX: 0, spriteY: 0 },    // Wings up
                { spriteX: 0, spriteY: 26 },   // Wings middle
                { spriteX: 0, spriteY: 52 }    // Wings down
            ];
            
            // Determine animation frame
            const frameIndex = Math.floor(Date.now() / 100) % birdFrames.length;
            const frame = birdFrames[frameIndex];
            
            ctx.drawImage(
                sprites,
                frame.spriteX, frame.spriteY,
                34, 24,
                bird.x, bird.y,
                bird.width, bird.height
            );
        } catch(e) {
            console.error('Error drawing bird:', e);
            // Draw fallback bird
            ctx.fillStyle = 'yellow';
            ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
        }
    }

    // Create a pipe
    function createPipe() {
        const pipeTop = {
            spriteX: 112,
            spriteY: 0,
            width: pipeWidth,
            height: 320,
            x: canvas.width,
            y: 0,
            counted: false
        };
        
        // Gap between pipes
        const gapY = Math.floor(Math.random() * 140) + 70;
        pipeTop.y = gapY - pipeTop.height;
        
        const pipeBottom = {
            spriteX: 168,
            spriteY: 0,
            width: pipeWidth,
            height: 320,
            x: canvas.width,
            y: gapY + pipeGap,
            counted: false
        };
        
        pipes.push({ top: pipeTop, bottom: pipeBottom });
    }

    // Draw pipes
    function drawPipes() {
        for (let i = 0; i < pipes.length; i++) {
            const pipe = pipes[i];
            
            try {
                // Top pipe
                ctx.drawImage(
                    sprites,
                    pipe.top.spriteX, pipe.top.spriteY,
                    pipe.top.width, pipe.top.height,
                    pipe.top.x, pipe.top.y,
                    pipe.top.width, pipe.top.height
                );
                
                // Bottom pipe
                ctx.drawImage(
                    sprites,
                    pipe.bottom.spriteX, pipe.bottom.spriteY,
                    pipe.bottom.width, pipe.bottom.height,
                    pipe.bottom.x, pipe.bottom.y,
                    pipe.bottom.width, pipe.bottom.height
                );
            } catch(e) {
                console.error('Error drawing pipes:', e);
                // Draw fallback pipes
                ctx.fillStyle = 'green';
                ctx.fillRect(pipe.top.x, pipe.top.y, pipe.top.width, pipe.top.height);
                ctx.fillRect(pipe.bottom.x, pipe.bottom.y, pipe.bottom.width, pipe.bottom.height);
            }
        }
    }

    // Move pipes
    function movePipes(deltaTime) {
        const pipeSpeed = 2;
        
        for (let i = 0; i < pipes.length; i++) {
            const pipe = pipes[i];
            
            pipe.top.x -= pipeSpeed;
            pipe.bottom.x -= pipeSpeed;
            
            // Check if the bird has passed a pipe for scoring
            if (!pipe.top.counted && pipe.top.x + pipe.top.width < bird.x) {
                score++;
                scoreDisplay.textContent = score;
                pipe.top.counted = true;
            }
            
            // Remove pipes that have gone off screen
            if (pipe.top.x + pipe.top.width < 0) {
                pipes.splice(i, 1);
                i--;
            }
        }
        
        // Add new pipes
        timeSinceLastPipe += deltaTime;
        if (timeSinceLastPipe > pipeInterval) {
            createPipe();
            timeSinceLastPipe = 0;
        }
    }

    // Collision detection
    function checkCollision() {
        // Floor collision
        if (bird.y + bird.height >= base.y) {
            return true;
        }
        
        // Ceiling collision
        if (bird.y <= 0) {
            return true;
        }
        
        // Pipe collision
        for (let i = 0; i < pipes.length; i++) {
            const pipe = pipes[i];
            
            // Horizontal check
            if (bird.x + bird.width > pipe.top.x && bird.x < pipe.top.x + pipe.top.width) {
                // Vertical check (top pipe)
                if (bird.y < pipe.top.y + pipe.top.height) {
                    return true;
                }
                
                // Vertical check (bottom pipe)
                if (bird.y + bird.height > pipe.bottom.y) {
                    return true;
                }
            }
        }
        
        return false;
    }

    // Update bird position
    function updateBird(deltaTime) {
        // Apply gravity
        bird.velocity += bird.gravity;
        bird.y += bird.velocity;
    }

    // Handle bird jump
    function jump() {
        if (!isGameActive) {
            startGame();
            return;
        }
        
        bird.velocity = bird.jumpStrength;
    }

    // Draw the game elements
    function draw() {
        background.draw();
        
        if (isGameActive) {
            drawPipes();
        }
        
        drawBird();
        base.draw();
    }

    // Game loop
    function gameLoop(timestamp) {
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;
        
        draw();
        
        if (isGameActive) {
            updateBird(deltaTime);
            movePipes(deltaTime);
            
            if (checkCollision()) {
                gameOver();
            }
        }
        
        animationFrameId = requestAnimationFrame(gameLoop);
    }

    // Start the game
    function startGame() {
        bird.y = canvas.height / 2 - 15;
        bird.velocity = 0;
        pipes = [];
        score = 0;
        timeSinceLastPipe = 0;
        
        scoreDisplay.textContent = score;
        startScreen.classList.add('hidden');
        gameOverScreen.classList.add('hidden');
        
        isGameActive = true;
    }

    // Game over
    function gameOver() {
        isGameActive = false;
        finalScore.textContent = score;
        gameOverScreen.classList.remove('hidden');
    }

    // Event listeners
    canvas.addEventListener('click', jump);
    restartButton.addEventListener('click', startGame);
    window.addEventListener('keydown', function(e) {
        if (e.code === 'Space') {
            jump();
        }
    });

    // Start animation when images are loaded
    sprites.onload = function() {
        console.log('Sprite image loaded successfully');
        lastTime = performance.now();
        gameLoop(lastTime);
    };

    // Initialize game - to handle cases where the onload event might not fire properly
    setTimeout(function() {
        if (!animationFrameId) {
            console.log('Starting game manually after timeout');
            lastTime = performance.now();
            gameLoop(lastTime);
        }
    }, 1000);
});
