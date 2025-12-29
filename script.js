// DOM Elements
const navbar = document.getElementById('navbar');
const heightInput = document.getElementById('height');
const weightInput = document.getElementById('weight');
const heightVal = document.getElementById('height-val');
const weightVal = document.getElementById('weight-val');
const bmiDisplay = document.getElementById('bmi-display');
const bmiCategory = document.getElementById('bmi-category');
const reveals = document.querySelectorAll('.reveal');

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Scroll Reveal Observer
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.1 });

reveals.forEach(el => revealObserver.observe(el));

// BMI Calculator Logic
function calculateBMI() {
    const h = parseInt(heightInput.value);
    const w = parseInt(weightInput.value);

    // Update labels
    heightVal.textContent = h;
    weightVal.textContent = w;

    // Calculate
    const bmi = (w / ((h / 100) * (h / 100))).toFixed(1);
    bmiDisplay.textContent = bmi;

    // Determine Category and Color
    let category = '';
    let colorClass = '';

    if (bmi < 18.5) {
        category = 'Underweight';
        colorClass = 'text-blue';
    } else if (bmi < 25) {
        category = 'Normal Weight';
        colorClass = 'text-green';
    } else if (bmi < 30) {
        category = 'Overweight';
        colorClass = 'text-yellow';
    } else {
        category = 'Obese';
        colorClass = 'text-red';
    }

    bmiCategory.textContent = category;

    // Reset classes and add new one
    bmiCategory.className = 'bmi-category ' + colorClass;

    // Optional: Animate the number
    bmiDisplay.style.transform = 'scale(1.1)';
    setTimeout(() => {
        bmiDisplay.style.transform = 'scale(1)';
    }, 150);
}

// Event Listeners for BMI
heightInput.addEventListener('input', calculateBMI);
weightInput.addEventListener('input', calculateBMI);

// Initial Calculation
calculateBMI();

// Interactive Canvas (Simple Particle Follower)
const canvasPlaceholder = document.querySelector('.canvas-placeholder');
if (canvasPlaceholder) {
    canvasPlaceholder.innerHTML = '<canvas id="particleCanvas"></canvas>';
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');

    // Resize
    const resizeCanvas = () => {
        canvas.width = canvasPlaceholder.offsetWidth;
        canvas.height = canvasPlaceholder.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mouse
    const mouse = { x: null, y: null };
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    canvas.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Particles
    const particlesArray = [];
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 2 - 1;
            this.speedY = Math.random() * 2 - 1;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
            if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;

            // Mouse interaction
            if (mouse.x != null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 60) {
                    const angle = Math.atan2(dy, dx);
                    this.x -= Math.cos(angle) * 1;
                    this.y -= Math.sin(angle) * 1;
                }
            }
        }
        draw() {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        for (let i = 0; i < 50; i++) {
            particlesArray.push(new Particle());
        }
    }
    initParticles();

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        requestAnimationFrame(animateParticles);
    }
    animateParticles();
}
