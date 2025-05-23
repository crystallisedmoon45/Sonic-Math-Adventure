class Sonic {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.x = 50;
        this.y = canvas.height / 2;
        this.speed = 0;
        this.maxSpeed = 4;  // Keep the reduced speed
        this.size = 80;
        this.animationFrame = 0;
        this.running = false;

        // Load Sonic SVG
        this.image = new Image();
        this.image.src = '/static/assets/sonic.svg';

        // Animation properties
        this.spriteRotation = 0;
        this.bounceOffset = 0;
        this.bounceSpeed = 0.1;
    }

    update() {
        // Update position with smoother movement
        this.x += this.speed;
        if (this.x > this.canvas.width) {
            this.x = -this.size;
        }

        // Animate bounce effect
        this.bounceOffset = Math.sin(this.animationFrame * this.bounceSpeed) * 5;

        // Rotate slightly when running
        this.spriteRotation = this.speed > 0 ? Math.sin(this.animationFrame * 0.1) * 0.1 : 0;

        this.animationFrame++;
    }

    draw() {
        this.ctx.save();

        // Translate to Sonic's position
        this.ctx.translate(this.x + this.size/2, this.y + this.size/2 + this.bounceOffset);

        // Rotate based on speed
        this.ctx.rotate(this.spriteRotation);

        // Draw Sonic centered
        this.ctx.drawImage(
            this.image, 
            -this.size/2, 
            -this.size/2, 
            this.size, 
            this.size
        );

        this.ctx.restore();

        // Add trail effect when running
        if (this.speed > 1) {
            this.drawSpeedTrail();
        }
    }

    setSpeed(speed) {
        // Smooth speed transitions
        this.speed = Math.min(speed, this.maxSpeed);
    }

    drawSpeedTrail() {
        this.ctx.beginPath();
        this.ctx.strokeStyle = 'rgba(30, 144, 255, 0.2)';
        this.ctx.lineWidth = 2;
        this.ctx.moveTo(this.x - 10, this.y + this.size/2);
        this.ctx.lineTo(this.x - 20, this.y + this.size/2);
        this.ctx.stroke();
    }
}
