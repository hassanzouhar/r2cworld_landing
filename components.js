// Particle.js configuration
const particleConfig = {
    "particles": {
        "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
        "color": { "value": "#ffffff" },
        "shape": {
            "type": "circle",
            "stroke": { "width": 0, "color": "#000000" },
            "polygon": { "nb_sides": 5 }
        },
        "opacity": {
            "value": 0.5,
            "random": false,
            "anim": { "enable": false, "speed": 1, "opacity_min": 0.1, "sync": false }
        },
        "size": {
            "value": 3,
            "random": true,
            "anim": { "enable": false, "speed": 40, "size_min": 0.1, "sync": false }
        },
        "line_linked": {
            "enable": true,
            "distance": 150,
            "color": "#ffffff",
            "opacity": 0.4,
            "width": 1
        },
        "move": {
            "enable": true,
            "speed": 1,
            "direction": "none",
            "random": false,
            "straight": false,
            "out_mode": "out",
            "bounce": false,
            "attract": { "enable": false, "rotateX": 600, "rotateY": 1200 }
        }
    },
    "interactivity": {
        "detect_on": "canvas",
        "events": {
            "onhover": { "enable": true, "mode": "grab" },
            "onclick": { "enable": true, "mode": "push" },
            "resize": true
        },
        "modes": {
            "grab": { "distance": 140, "line_linked": { "opacity": 1 } },
            "bubble": { "distance": 400, "size": 40, "duration": 2, "opacity": 8, "speed": 3 },
            "repulse": { "distance": 200, "duration": 0.4 },
            "push": { "particles_nb": 4 },
            "remove": { "particles_nb": 2 }
        }
    },
    "retina_detect": true
};

// Initialize particles
particlesJS('particles-js', particleConfig);

// Main application logic
document.addEventListener('DOMContentLoaded', () => {
    // DOM element references
    const loadingScreen = document.getElementById('loading-screen');
    const r2cTitle = document.getElementById('r2c-title');
    const r2cLogo = document.getElementById('r2c-logo');
    const terminalModal = document.getElementById('terminal-modal');
    const openTerminalBtn = document.getElementById('open-terminal');
    const closeTerminalBtn = document.getElementById('close-terminal');
    const minimizeBtn = document.getElementById('minimize-btn');
    const terminalWindow = document.getElementById('terminal-window');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const terminalContent = document.getElementById('terminal-content');
    const commandInput = document.getElementById('command-input');

    // State variables
    let isFullscreen = false;
    let isMinimized = false;

    // Loading screen and title animation
    setTimeout(() => {
        loadingScreen.style.display = 'none';
        setTimeout(() => {
            r2cTitle.classList.add('visible');
            setTimeout(() => {
                r2cTitle.classList.remove('visible');
                r2cTitle.style.display = 'none';
                r2cLogo.classList.remove('hidden');
                setTimeout(() => {
                    r2cLogo.classList.add('visible');
                }, 50);
            }, 5000); // Wait for 5 seconds before transforming to logo
        }, 500);
    }, 2000);

    // Terminal functionality
    function openTerminal() {
        terminalModal.style.display = 'flex';
        if (isMinimized) toggleMinimize();
    }

    function closeTerminal() {
        terminalModal.style.display = 'none';
        if (isMinimized) toggleMinimize();
    }

    function toggleMinimize() {
        isMinimized = !isMinimized;
        if (isMinimized) {
            terminalWindow.classList.add('minimized');
            terminalContent.style.display = 'none';
            terminalModal.style.backgroundColor = 'transparent';
            terminalModal.style.backdropFilter = 'none';
        } else {
            terminalWindow.classList.remove('minimized');
            terminalContent.style.display = 'block';
            terminalModal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            terminalModal.style.backdropFilter = 'blur(5px)';
        }
    }

    function toggleFullscreen() {
        isFullscreen = !isFullscreen;
        if (isFullscreen) {
            terminalWindow.style.width = terminalWindow.style.height = '100%';
            terminalWindow.style.maxWidth = terminalWindow.style.maxHeight = '100%';
        } else {
            terminalWindow.style.width = terminalWindow.style.height = '';
            terminalWindow.style.maxWidth = terminalWindow.style.maxHeight = '';
        }
    }

    // Command processing
    function processCommand(command) {
        const outputDiv = document.createElement('div');
        outputDiv.textContent = `user@r2c:~$ ${command}`;
        terminalContent.insertBefore(outputDiv, terminalContent.lastElementChild);
        
        const responseDiv = document.createElement('div');
        responseDiv.textContent = `Command '${command}' not recognized.`;
        terminalContent.insertBefore(responseDiv, terminalContent.lastElementChild);
        
        commandInput.value = '';
        terminalContent.scrollTop = terminalContent.scrollHeight;
    }

    // Event listeners
    openTerminalBtn.addEventListener('click', openTerminal);
    closeTerminalBtn.addEventListener('click', closeTerminal);
    minimizeBtn.addEventListener('click', toggleMinimize);
    fullscreenBtn.addEventListener('click', toggleFullscreen);

    terminalWindow.addEventListener('click', (e) => {
        if (isMinimized && !e.target.classList.contains('control-button')) {
            toggleMinimize();
        }
    });

    commandInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            processCommand(commandInput.value);
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (isFullscreen) toggleFullscreen();
            else if (!isMinimized) closeTerminal();
        }
    });

    // Mobile-specific functionality
    const mobileCloseBtn = document.createElement('div');
    mobileCloseBtn.className = 'mobile-close-btn';
    mobileCloseBtn.textContent = 'Close';
    terminalWindow.querySelector('.window-frame').appendChild(mobileCloseBtn);

    function addTouchListener(element, handler) {
        element.addEventListener('touchend', (e) => {
            e.preventDefault();
            handler();
        });
    }

    addTouchListener(openTerminalBtn, openTerminal);
    addTouchListener(closeTerminalBtn, closeTerminal);
    addTouchListener(mobileCloseBtn, closeTerminal);
    addTouchListener(minimizeBtn, toggleMinimize);
    addTouchListener(fullscreenBtn, toggleFullscreen);

    terminalWindow.addEventListener('touchend', (e) => {
        if (isMinimized && !e.target.classList.contains('control-button')) {
            e.preventDefault();
            toggleMinimize();
        }
    });

    // Handle mobile keyboard issues
    window.addEventListener('resize', () => {
        if (document.activeElement.tagName === 'INPUT') {
            window.setTimeout(() => document.activeElement.scrollIntoView(), 0);
        }
    });
});