// Particle.js configuration
particlesJS('particles-js', {
    "particles": {
        "number": {
            "value": 80,
            "density": {
                "enable": true,
                "value_area": 800
            }
        },
        "color": {
            "value": "#ffffff"
        },
        "shape": {
            "type": "circle",
            "stroke": {
                "width": 0,
                "color": "#000000"
            },
            "polygon": {
                "nb_sides": 5
            }
        },
        "opacity": {
            "value": 0.5,
            "random": false,
            "anim": {
                "enable": false,
                "speed": 1,
                "opacity_min": 0.1,
                "sync": false
            }
        },
        "size": {
            "value": 3,
            "random": true,
            "anim": {
                "enable": false,
                "speed": 40,
                "size_min": 0.1,
                "sync": false
            }
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
            "attract": {
                "enable": false,
                "rotateX": 600,
                "rotateY": 1200
            }
        }
    },
    "interactivity": {
        "detect_on": "canvas",
        "events": {
            "onhover": {
                "enable": true,
                "mode": "grab"
            },
            "onclick": {
                "enable": true,
                "mode": "push"
            },
            "resize": true
        },
        "modes": {
            "grab": {
                "distance": 140,
                "line_linked": {
                    "opacity": 1
                }
            },
            "bubble": {
                "distance": 400,
                "size": 40,
                "duration": 2,
                "opacity": 8,
                "speed": 3
            },
            "repulse": {
                "distance": 200,
                "duration": 0.4
            },
            "push": {
                "particles_nb": 4
            },
            "remove": {
                "particles_nb": 2
            }
        }
    },
    "retina_detect": true
});

// Terminal functionality
document.addEventListener('DOMContentLoaded', () => {
    const terminalModal = document.getElementById('terminal-modal');
    const openTerminalBtn = document.getElementById('open-terminal');
    const closeTerminalBtn = document.getElementById('close-terminal');
    const minimizeBtn = document.getElementById('minimize-btn');
    const terminalWindow = document.getElementById('terminal-window');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const terminalContent = document.getElementById('terminal-content');
    const commandInput = document.getElementById('command-input');

    let isFullscreen = false;
    let isMinimized = false;

    openTerminalBtn.addEventListener('click', () => {
        terminalModal.style.display = 'flex';
        if (isMinimized) {
            toggleMinimize();
        }
    });

    closeTerminalBtn.addEventListener('click', () => {
        terminalModal.style.display = 'none';
        if (isMinimized) {
            toggleMinimize();
        }
    });

    minimizeBtn.addEventListener('click', toggleMinimize);

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

    terminalWindow.addEventListener('click', (e) => {
        if (isMinimized && !e.target.classList.contains('control-button')) {
            toggleMinimize();
        }
    });

    fullscreenBtn.addEventListener('click', () => {
        isFullscreen = !isFullscreen;
        if (isFullscreen) {
            terminalWindow.style.width = '100%';
            terminalWindow.style.height = '100%';
        } else {
            terminalWindow.style.width = '75%';
            terminalWindow.style.height = '75%';
        }
    });

    commandInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const command = commandInput.value;
            const outputDiv = document.createElement('div');
            outputDiv.textContent = `user@r2c:~$ ${command}`;
            terminalContent.insertBefore(outputDiv, terminalContent.lastElementChild);
            
            const responseDiv = document.createElement('div');
            responseDiv.textContent = `Command '${command}' not recognized.`;
            terminalContent.insertBefore(responseDiv, terminalContent.lastElementChild);
            
            commandInput.value = '';
            terminalContent.scrollTop = terminalContent.scrollHeight;
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (isFullscreen) {
                isFullscreen = false;
                terminalWindow.style.width = '75%';
                terminalWindow.style.height = '75%';
            } else if (!isMinimized) {
                terminalModal.style.display = 'none';
            }
        }
    });
});