const codeSnippets = [
    'document.querySelector(".pirate").remove();',
    'console.log("Ahoy, mundo!");',
    'let gold = 100;',
    'if (ship.hp <= 0) sink();',
    'function fireCannon() { return "BOOM!"; }'
];

let index = 0;
let health = 100;
let startTime;
let isGameRunning = false;
let currentCode = "";

const typedText = document.getElementById("typed-text");
const remainingText = document.getElementById("remaining-text");
const healthBar = document.querySelector(".health");
const enemyShip = document.querySelector(".enemy-ship");
const timer = document.getElementById("time");

function startGame() {
    startTime = Date.now();
    isGameRunning = true;
    currentCode = codeSnippets[index];
    typedText.textContent = "";
    remainingText.textContent = currentCode;
}

document.addEventListener("keydown", (event) => {
    if (!isGameRunning) return;

    const typed = typedText.textContent;
    const remaining = remainingText.textContent;
    
    if (event.key === remaining[0]) {
        typedText.textContent += event.key;
        remainingText.textContent = remaining.slice(1);

        if (remainingText.textContent === "") {
            fireCannon();
            index++;

            if (index < codeSnippets.length) {
                setTimeout(() => {
                    currentCode = codeSnippets[index];
                    typedText.textContent = "";
                    remainingText.textContent = currentCode;
                }, 300);
            } else {
                endGame();
            }
        }
    }
});

function fireCannon() {
    health -= 20;
    healthBar.style.width = health + "%";

    let bullet = document.createElement("div");
    bullet.classList.add("bullet");
    document.body.appendChild(bullet);

    gsap.to(bullet, {
        duration: 0.6,
        y: -250,
        ease: "power2.out",
        onComplete: () => {
            bullet.remove();
            hitEffect();
        }
    });

    if (health <= 0) {
        setTimeout(() => alert("🏴‍☠️ ¡Has hundido el barco!"), 100);
        endGame();
    }
}

function hitEffect() {
    gsap.to(enemyShip, { scale: 1.2, duration: 0.1, yoyo: true, repeat: 1 });

    for (let i = 0; i < 10; i++) {
        let particle = document.createElement("div");
        particle.classList.add("particle");
        document.body.appendChild(particle);

        gsap.to(particle, {
            duration: 0.5,
            x: (Math.random() - 0.5) * 100,
            y: (Math.random() - 0.5) * 100,
            opacity: 0,
            onComplete: () => particle.remove()
        });
    }
}

function endGame() {
    isGameRunning = false;
    let totalTime = ((Date.now() - startTime) / 1000).toFixed(2);
    timer.textContent = totalTime;
}

window.onload = startGame;
