// Shooter Game functionality
document.addEventListener('DOMContentLoaded', () => {

    const shooterCanvas = document.getElementById('gameCanvas');
    const shooterCtx = shooterCanvas.getContext('2d');
    const shooterScoreElement = document.getElementById('score');
    const shooterStartButton = document.getElementById('start-button');

    // Make sure elements exist before proceeding
    if (!shooterCanvas || !shooterStartButton) {
        console.error("Game canvas or start button not found.");
        return; // Exit if elements are missing
    }

    let player = {
        x: shooterCanvas.width / 2,
        y: shooterCanvas.height - 50,
        radius: 15,
        color: 'white',
        speed: 5
    };

    let bullets = [];
    let enemies = [];
    let score = 0;
    let gameInterval;
    let enemyInterval;
    let isGameOver = false;

    function createEnemy() {
        enemies.push({
            x: Math.random() * (shooterCanvas.width - 40) + 20,
            y: -20,
            radius: 15,
            color: 'red',
            speed: Math.random() * 2 + 1
        });
    }

    function drawShooter() {
        shooterCtx.clearRect(0, 0, shooterCanvas.width, shooterCanvas.height);

        // Draw player
        shooterCtx.beginPath();
        shooterCtx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
        shooterCtx.fillStyle = player.color;
        shooterCtx.fill();
        shooterCtx.closePath();

        // Draw bullets
        bullets.forEach(bullet => {
            shooterCtx.beginPath();
            shooterCtx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
            shooterCtx.fillStyle = bullet.color;
            shooterCtx.fill();
            shooterCtx.closePath();
        });

        // Draw enemies
        enemies.forEach(enemy => {
            shooterCtx.beginPath();
            shooterCtx.arc(enemy.x, enemy.y, enemy.radius, 0, Math.PI * 2);
            shooterCtx.fillStyle = enemy.color;
            shooterCtx.fill();
            shooterCtx.closePath();
        });
    }

    function updateShooter() {
        if (isGameOver) return;
        
        // Move bullets
        bullets.forEach((bullet, index) => {
            bullet.y -= bullet.speed;
            if (bullet.y < 0) {
                bullets.splice(index, 1);
            }
        });

        // Move enemies
        enemies.forEach((enemy, index) => {
            enemy.y += enemy.speed;
            if (enemy.y > shooterCanvas.height) {
                enemies.splice(index, 1);
            }
        });

        // Collision detection
        bullets.forEach((bullet, bIndex) => {
            enemies.forEach((enemy, eIndex) => {
                const distance = Math.sqrt((bullet.x - enemy.x)**2 + (bullet.y - enemy.y)**2);
                if (distance < bullet.radius + enemy.radius) {
                    bullets.splice(bIndex, 1);
                    enemies.splice(eIndex, 1);
                    score++;
                    shooterScoreElement.innerText = score;
                }
            });
        });
        
        drawShooter();
    }

    function shootBullet(e) {
        bullets.push({
            x: player.x,
            y: player.y - player.radius,
            radius: 5,
            color: 'cyan',
            speed: 7
        });
    }

    function startGame() {
        if (gameInterval) clearInterval(gameInterval);
        if (enemyInterval) clearInterval(enemyInterval);

        isGameOver = false;
        bullets = [];
        enemies = [];
        score = 0;
        shooterScoreElement.innerText = score;
        gameInterval = setInterval(updateShooter, 1000 / 60);
        enemyInterval = setInterval(createEnemy, 2000);
    }

    shooterStartButton.addEventListener('click', startGame);

    shooterCanvas.addEventListener('mousemove', e => {
        player.x = e.clientX - shooterCanvas.getBoundingClientRect().left;
    });

    shooterCanvas.addEventListener('click', shootBullet);
});