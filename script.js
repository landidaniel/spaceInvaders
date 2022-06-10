const yourShip = document.querySelector('.player-shooter');
const playArea = document.querySelector('#main-play-area');
const aliensImg = ['img/inimigo1.png', 'img/inimigo2.png', 
'img/inimigo3.png', 'img/inimigo4.png', 'img/inimigo5.png', 'img/inimigo6.png'];
const instructionsText = document.querySelector('.game-instructions');
const startButton = document.querySelector('.start-button');
const points = document.querySelector('.game-points');
let alienInterval;
let totalPoints = 0;

// Controles da nave
function flyShip(event) {
    if(event.key === 'ArrowUp') {
        event.preventDefault();
        moveUp();
    }

    if(event.key === 'ArrowDown') {
        event.preventDefault();
        moveDown();
    }
    
    if(event.key === " ") {
        event.preventDefault();
        fireLaser();
    }
}

// Função para nave subir
function moveUp() {
    const topPosition = getComputedStyle(yourShip).getPropertyValue('top');

    if(topPosition === "0px")
        return
    
    let position = parseInt(topPosition);
    position -= 50;
    yourShip.style.top = `${position}px`;
}

// Função para nave descer
function moveDown() {
    const topPosition = getComputedStyle(yourShip).getPropertyValue('top');

    if(topPosition >= "540px")
        return

    let position = parseInt(topPosition);
    position += 50;
    yourShip.style.top = `${position}px`;
}

// Função para atirar lasers
function fireLaser() {
    const laser = createLaserElement();
    playArea.appendChild(laser);
    moveLaser(laser);
}

function createLaserElement() {
    let xPosition = parseInt(window.getComputedStyle(yourShip).getPropertyValue('left'));
    let yPosition = parseInt(window.getComputedStyle(yourShip).getPropertyValue('top'));
    let newLaser = document.createElement('img');
    newLaser.src = 'img/shoot.png';
    newLaser.classList.add('laser');
    newLaser.style.left = `${xPosition}px`;
    newLaser.style.top = `${yPosition - 50}px`;
    return newLaser;
}

function moveLaser(laser) {
    setInterval(() => {
        const xPosition = parseInt(laser.style.left);
        const aliens = document.querySelectorAll('.alien');

        aliens.forEach((alien) => {
            if(checkLaserCollision(laser, alien)) {
                alien.src = 'img/explosion.png';
                alien.classList.remove('alien');
                alien.classList.add('dead-alien');
                totalPoints++;
                points.innerHTML = `Sua pontuação: ${totalPoints}`;
            }
        })

        if(xPosition === 340) {
            laser.remove();
        } else {
            laser.style.left = `${xPosition + 80}px`;
        }
    }, 50);
}

// Função para criar inimigos aleatórios
function createAliens() {
    const newAlien = document.createElement('img');
    const alienSprite = aliensImg[Math.floor(Math.random() * aliensImg.length)];

    newAlien.src = alienSprite;
    newAlien.classList.add('alien');
    newAlien.classList.add('alien-transition');
    newAlien.style.left = '370px';
    newAlien.style.top = `${Math.floor(Math.random() * 330) + 30}px`;

    playArea.appendChild(newAlien);
    moveAlien(newAlien);
}

// Função para movimentar os inimigos
function moveAlien(alien) {
    setInterval(() => {
        const xPosition = parseInt(window.getComputedStyle(alien).getPropertyValue('left'));

        if(xPosition <= 50) {
            Array.from(alien.classList).includes('dead-alien') ? alien.remove() : gameOver();
        } else {
            alien.style.left = `${xPosition - 4}px`;
        }
    }, 50);
}

// Função para detectar colisão entre laser e alien
function checkLaserCollision(laser, alien) {
    const laserTop = parseInt(laser.style.top);
    const laserLeft = parseInt(laser.style.left);
    
    const alienTop = parseInt(alien.style.top);
    const alienLeft = parseInt(alien.style.left);
    const alienBottom = alienTop - 50;

    if(laserLeft != 340 && laserLeft + 40 >= alienLeft) {
        if(laserTop <= alienTop + 50 && laserTop >= alienBottom)
            return true;
        return false;
    }

    return false;
}

// Evento de inicio do jogo
startButton.addEventListener('click', (event) => {
    playGame();
})

function playGame() {
    startButton.style.display = 'none';
    instructionsText.style.display = 'none';
    window.addEventListener('keydown', flyShip);
    alienInterval = setInterval(() => {
        createAliens();
    }, 2000);
    points.innerHTML = 'Sua pontuação: 0';
}

// Função de game over
function gameOver() {
    window.removeEventListener('keydown', flyShip);
    clearInterval(alienInterval);

    const aliens = document.querySelectorAll('.alien');
    aliens.forEach((alien) => alien.remove());

    const lasers = document.querySelectorAll('.laser');
    lasers.forEach((laser) => laser.remove());

    setTimeout(() => {
        alert('Game Over! Seu planeta foi invadido!');
        yourShip.style.top = "250px";
        startButton.style.display = "block";
        instructionsText.style.display = "block";
        totalPoints = 0;
    });
}