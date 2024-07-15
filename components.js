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

document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loading-screen');
    const terminalModal = document.getElementById('terminal-modal');
    const openTerminalBtn = document.getElementById('open-terminal');
    const closeTerminalBtn = document.getElementById('close-terminal');
    const minimizeBtn = document.getElementById('minimize-btn');
    const terminalWindow = document.getElementById('terminal-window');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const terminalContent = document.getElementById('terminal-content');
    const commandInput = document.getElementById('command-input');

    // Simulate loading time (remove this in production)
    setTimeout(() => {
        loadingScreen.style.display = 'none';
    }, 2000);

    // Add a text-based close button for mobile
    const mobileCloseBtn = document.createElement('div');
    mobileCloseBtn.className = 'mobile-close-btn';
    mobileCloseBtn.textContent = 'Close';
    terminalWindow.querySelector('.window-frame').appendChild(mobileCloseBtn);

    let isFullscreen = false;
    let isMinimized = false;

    function openTerminal() {
        terminalModal.style.display = 'flex';
        if (isMinimized) {
            toggleMinimize();
        }
    }

    function closeTerminal() {
        terminalModal.style.display = 'none';
        if (isMinimized) {
            toggleMinimize();
        }
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
            terminalWindow.style.width = '100%';
            terminalWindow.style.height = '100%';
            terminalWindow.style.maxWidth = '100%';
            terminalWindow.style.maxHeight = '100%';
        } else {
            terminalWindow.style.width = '';
            terminalWindow.style.height = '';
            terminalWindow.style.maxWidth = '';
            terminalWindow.style.maxHeight = '';
        }
    }

    openTerminalBtn.addEventListener('click', openTerminal);
    openTerminalBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        openTerminal();
    });

    closeTerminalBtn.addEventListener('click', closeTerminal);
    closeTerminalBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        closeTerminal();
    });

    // Add event listener for the mobile close button
    mobileCloseBtn.addEventListener('click', closeTerminal);
    mobileCloseBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        closeTerminal();
    });

    minimizeBtn.addEventListener('click', toggleMinimize);
    minimizeBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        toggleMinimize();
    });

    fullscreenBtn.addEventListener('click', toggleFullscreen);
    fullscreenBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        toggleFullscreen();
    });

    terminalWindow.addEventListener('click', (e) => {
        if (isMinimized && !e.target.classList.contains('control-button')) {
            toggleMinimize();
        }
    });

    terminalWindow.addEventListener('touchend', (e) => {
        if (isMinimized && !e.target.classList.contains('control-button')) {
            e.preventDefault();
            toggleMinimize();
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
                toggleFullscreen();
            } else if (!isMinimized) {
                closeTerminal();
            }
        }
    });

    // Handle mobile keyboard issues
    window.addEventListener('resize', () => {
        if (document.activeElement.tagName === 'INPUT') {
            window.setTimeout(() => {
                document.activeElement.scrollIntoView();
            }, 0);
        }
    });
});
