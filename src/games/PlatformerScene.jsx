import Phaser from 'phaser';
import { PlayerController } from './PlayerController';

class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
    }

    preload() {
        // Load Industrial Platforms
        this.load.image('platform', 'assets/images/platform_industrial_1.png');

        // Load Character (Picking a generic thief-like character from the pack)
        this.load.image('player', 'assets/images/character_Robot_idle.png');

        // Load Data Core (Coin)
        this.load.image('coin', 'assets/images/coin_gold.png');
        this.load.image('portal', 'assets/images/portal_industrial_1.png'); // Added portal asset
        this.load.image('drone', 'assets/images/drone_industrial_1.png'); // Added drone asset

        // Load Audio
        this.load.audio('collect', 'assets/audio/powerUp1.ogg');
        this.load.audio('jump', 'assets/audio/phaseJump1.ogg');
        this.load.audio('dash', 'assets/audio/zap1.ogg'); // Added dash sound
        this.load.audio('alarm', 'assets/audio/laser1.ogg'); // Added alarm sound
    }
    create() {
        // 1. Setup Game State
        const upgrades = this.data.get('upgrades') || {};
        this.score = 0;
        this.syncRate = 100;
        this.requiredCores = 5;
        this.isLevelComplete = false;

        // Apply Upgrades from the Black Market
        const dashBonus = (upgrades['dash_dist'] || 0) * 50;
        const jumpBonus = (upgrades['jump_boost'] || 0) * 20;

        // 2. Setup UI
        this.uiText = this.add.text(16, 16, '', {
            fontSize: '24px',
            fill: '#00ffcc', 
            fontFamily: 'Courier New' 
        });
        this.vignette = this.add.graphics();
        this.updateUI();

        // 3. Setup Platforms
        this.platforms = this.physics.add.staticGroup();
        const floor = this.platforms.create(400, 580, 'platform');
        floor.setScale(8, 1).refreshBody();
        this.platforms.create(200, 450, 'platform');
        this.platforms.create(500, 350, 'platform');
        this.platforms.create(300, 250, 'platform');
        this.platforms.create(600, 150, 'platform');

        // Unstable Platforms (Dynamic Group)
        this.unstablePlatforms = this.physics.add.group({ allowGravity: false, immovable: true });
        this.createUnstablePlatform(400, 450);
        this.createUnstablePlatform(100, 300);

        // 4. Initialize Player Controller (The Engineering Upgrade)
        this.playerController = new PlayerController(this);
        this.playerController.dashSpeed = 600 + dashBonus;
        this.playerController.jumpForce = -450 - jumpBonus;

        // 5. Setup Data Cores (Coins)
        this.coins = this.physics.add.group({
            key: 'coin',
            repeat: 5,
            setXY: { x: 150, y: 0, stepX: 120 }
        });

        this.coins.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
            child.setDisplaySize(20, 20);
        });

        // 6. Setup Exit Portal
        this.portal = this.physics.add.staticImage(750, 100, 'portal');
        this.portal.setDisplaySize(60, 80);
        this.portal.setAlpha(0.3); // Start dimmed/inactive

        // 7. Setup Security Drones
        this.drones = this.physics.add.group();
        this.createDrone(400, 350, 100);
        this.createDrone(200, 200, 150);

        // 8. Physics Interactions
        this.physics.add.collider(this.playerController.sprite, this.platforms);
        this.physics.add.collider(this.playerController.sprite, this.unstablePlatforms);
        this.physics.add.collider(this.coins, this.platforms);
        this.physics.add.collider(this.coins, this.unstablePlatforms);
        this.physics.add.overlap(this.playerController.sprite, this.coins, this.collectCoin, null, this);
        this.physics.add.overlap(this.playerController.sprite, this.portal, this.reachPortal, null, this);
        this.physics.add.overlap(this.playerController.sprite, this.drones, this.hitDrone, null, this);

        // 9. Setup Inputs
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            shift: Phaser.Input.Keyboard.KeyCodes.SHIFT
        });

        // 10. Sync Rate Decay Timer
        const decayRate = 1 - ((upgrades['sync_cap'] || 0) * 0.1); // 10% slower per level
        this.time.addEvent({
            delay: 1000,
            callback: this.decaySync,
            callbackScope: this,
            loop: true
        });
    }

    createUnstablePlatform(x, y) {
        const plat = this.unstablePlatforms.create(x, y, 'platform');
        plat.setDisplaySize(100, 20);
        plat.setImmovable(true);
        plat.body.allowGravity = false;

        // UX Specialist: Visual cue for decay
        this.time.addEvent({
            delay: 2000,
            callback: () => {
        this.tweens.add({
                    targets: plat,
                    alpha: 0,
                    duration: 1000,
                    onComplete: () => {
                        plat.disableBody(true, true);
                        this.time.delayedCall(3000, () => {
                            plat.setActive(true).setVisible(true).enableBody(true, x, y, true, true);
                            plat.setAlpha(1);
        });
    }
                });
            },
            callbackScope: this,
            loop: true
        });
    }

    createDrone(x, y, range) {
        const drone = this.drones.create(x, y, 'drone');
        drone.setDisplaySize(40, 40);
        drone.setCollideWorldBounds(true);

        // Movement logic
        this.tweens.add({
            targets: drone,
            x: x + range,
            duration: 2000,
            yoyo: true,
            repeat: -1
        });

        // Audio Engineer: Add a humming sound loop here if we had one
    }

    hitDrone() {
        this.syncRate -= 20; // Heavy penalty
        this.sound.play('alarm');

        // Knockback effect
        const direction = this.playerController.sprite.x < this.drones.getChildren()[0].x ? -200 : 200;
        this.playerController.sprite.setVelocityX(direction);

        // Flash player red
        this.playerController.sprite.setTint(0xff0000);
        this.time.delayedCall(200, () => this.playerController.sprite.clearTint());
    }

    update() {
        this.playerController.handleInput(this.cursors, this.wasd);
        this.updateUI();

        if (this.syncRate <= 0) {
            this.gameOver();
        }
    }

    decaySync() {
        // Use the calculated decay rate
        const upgrades = this.data.get('upgrades') || {};
        const decayAmount = 1 - ((upgrades['sync_cap'] || 0) * 0.1);
        this.syncRate -= decayAmount;
        if (this.syncRate < 0) this.syncRate = 0;
    }

    updateUI() {
        this.uiText.setText(`Cores: ${this.score}/${this.requiredCores} | Sync Rate: ${Math.floor(this.syncRate)}%`);

        // UX Specialist: Vignette logic
        this.vignette.clear();
        if (this.syncRate < 30) {
            this.uiText.setFill('#ff0055'); // Turn red when critical
            const intensity = (30 - this.syncRate) / 30;
            this.vignette.fillStyle(0xff0055, intensity * 0.3);
            this.vignette.fillRect(0, 0, 800, 600);
        } else {
            this.uiText.setFill('#00ffcc');
        }
    }
    collectCoin(player, coin) {
        coin.disableBody(true, true);
        this.score += 1;
        this.syncRate = Math.min(100, this.syncRate + 10); // Collecting restores Sync
        this.sound.play('collect');

        if (this.score >= this.requiredCores) {
            this.activatePortal();
        }
    }

    activatePortal() {
        this.portal.setAlpha(1);
        this.portal.setTint(0x00ffcc);
        // Add a simple pulse animation
        this.tweens.add({
            targets: this.portal,
            alpha: { from: 0.6, to: 1 },
            duration: 500,
            yoyo: true,
            repeat: -1
        });
    }

    reachPortal() {
        if (this.score >= this.requiredCores) {
            this.isLevelComplete = true;
            this.physics.pause();
            this.playerController.sprite.setVelocity(0, 0);
            this.add.text(400, 300, 'HEIST SUCCESSFUL\nMemory Recovered', {
            fontSize: '48px',
                fill: '#00ffcc',
            align: 'center',
            fontFamily: 'Courier New'
        }).setOrigin(0.5);

            // Call the React callback to return to lobby with rewards
            const onComplete = this.data.get('onComplete');
            if (onComplete) {
                onComplete(this.score * 10); // Reward: 10 credits per core
            }

        this.time.delayedCall(3000, () => this.scene.restart());
    }

    gameOver() {
        this.physics.pause();
        this.playerController.sprite.setTint(0xff0000);
        this.add.text(400, 300, 'CONNECTION LOST\nDE-REZZED', {
            fontSize: '48px',
            fill: '#ff0055',
            align: 'center',
            fontFamily: 'Courier New'
        }).setOrigin(0.5);

        this.time.delayedCall(3000, () => this.scene.restart());
}
}

export default MainScene;

