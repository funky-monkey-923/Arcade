/**
 * PlayerController handles the physics and state transitions of the player.
 * Separating this from the Scene prevents the Scene file from becoming too large.
 */
export class PlayerController {
    constructor(scene) {
        this.scene = scene;
        this.physics = scene.physics;
        
        // State Constants
        this.STATES = {
            IDLE: 'IDLE',
            RUNNING: 'RUNNING',
            JUMPING: 'JUMPING',
            DASHING: 'DASHING',
            FALLING: 'FALLING'
        };

        this.state = this.STATES.IDLE;
        
        // Settings
        this.moveSpeed = 200;
        this.jumpForce = -450;
        this.dashSpeed = 600;
        this.dashDuration = 200; // ms
        this.dashCooldown = 1000; // ms
        this.isDashAvailable = true;

        this.setupPlayer();
    }

    setupPlayer() {
        this.sprite = this.scene.physics.add.sprite(100, 450, 'player');
        this.sprite.setBounce(0.1);
        this.sprite.setCollideWorldBounds(true);
        this.sprite.setDisplaySize(32, 32);

        // Add a trailing effect for the dash (Visual Polish)
        this.dashParticles = this.scene.add.particles(0, 0, 'player', {
            speed: { min: -100, max: 100 },
            scale: { start: 0.5, end: 0 },
            alpha: { start: 0.5, end: 0 },
            lifespan: 300,
            frequency: -1,
            follow: this.sprite
        });
        this.dashParticles.stop();
    }

    handleInput(cursors, wasd) {
        const moveLeft = cursors.left.isDown || wasd.left.isDown;
        const moveRight = cursors.right.isDown || wasd.right.isDown;
        const jumpUp = cursors.up.isDown || wasd.up.isDown || cursors.space.isDown;
        const dashKey = wasd.shift?.isDown || cursors.shift?.isDown;

        if (this.state === this.STATES.DASHING) {
            if (jumpUp) this.cancelDash(); // Allow jumping out of a dash
            return;
        }

        // Wall Jump Logic
        if (jumpUp && !this.sprite.body.touching.down) {
            if (this.sprite.body.touching.left || this.sprite.body.touching.right) {
                this.executeWallJump();
                return;
            }
        }

        // Dash Logic
        if (dashKey && this.isDashAvailable) {
            this.executeDash(moveLeft, moveRight);
            return;
        }

        // Normal Movement
            if (moveLeft) {
                this.sprite.setVelocityX(-this.moveSpeed);
                this.sprite.setFlipX(true);
                this.updateState(this.sprite.body.touching.down ? this.STATES.RUNNING : this.STATES.FALLING);
            } else if (moveRight) {
                this.sprite.setVelocityX(this.moveSpeed);
                this.sprite.setFlipX(false);
                this.updateState(this.sprite.body.touching.down ? this.STATES.RUNNING : this.STATES.FALLING);
            } else {
                this.sprite.setVelocityX(0);
                this.updateState(this.sprite.body.touching.down ? this.STATES.IDLE : this.STATES.FALLING);
            }

            if (jumpUp && this.sprite.body.touching.down) {
                this.sprite.setVelocityY(this.jumpForce);
                this.updateState(this.STATES.JUMPING);
                this.scene.sound.play('jump');
            }
        }
    executeDash(moveLeft, moveRight) {
        this.updateState(this.STATES.DASHING);
        this.isDashAvailable = false;

        const direction = moveLeft ? -1 : (moveRight ? 1 : (this.sprite.flipX ? -1 : 1));
        
        this.sprite.setVelocityX(direction * this.dashSpeed);
        this.sprite.setVelocityY(0);

        // UX Polish: Start particle trail
        this.dashParticles.start();
        this.scene.sound.play('dash');
        this.scene.time.delayedCall(this.dashDuration, () => {
            this.cancelDash();
        });

        this.scene.time.delayedCall(this.dashCooldown, () => {
            this.isDashAvailable = true;
        });
    }

    cancelDash() {
        this.dashParticles.stop();
        this.updateState(this.sprite.body.touching.down ? this.STATES.IDLE : this.STATES.FALLING);
    }

    executeWallJump() {
        const direction = this.sprite.body.touching.left ? 1 : -1;
        this.sprite.setVelocityX(direction * this.moveSpeed * 1.5);
        this.sprite.setVelocityY(this.jumpForce * 0.8);
        this.updateState(this.STATES.JUMPING);
        this.scene.sound.play('jump');
    }

    updateState(newState) {
        if (this.state !== newState) {
            this.state = newState;
            // This is where we would trigger animation changes
            // this.sprite.play(newState.toLowerCase());
        }
    }
}

