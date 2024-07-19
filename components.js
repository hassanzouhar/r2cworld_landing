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
    const audioElement = document.getElementById('background-audio');
    const canvasElement = document.getElementById('audio-visualizer');
    const playAudioBtn = document.getElementById('play-audio');

    // State variables
    let isFullscreen = false;
    let isMinimized = false;
    let isAudioPlaying = false;

    // Initialize Wave.js
    const wave = new Wave(audioElement, canvasElement);

    // Add Wave.js animation
    wave.addAnimation(new wave.animations.Cubes({
        count: 20,
        top: {
            color: 'rgba(255, 255, 255, 0.3)',
            highlight: 'rgba(255, 255, 255, 0.8)'
        },
        right: {
            color: 'rgba(255, 255, 255, 0.2)',
            highlight: 'rgba(255, 255, 255, 0.6)'
        },
        left: {
            color: 'rgba(255, 255, 255, 0.1)',
            highlight: 'rgba(255, 255, 255, 0.4)'
        },
        removeCubes: true,
        radius: 10,
        rotationCount: 0
    }));

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
                    playAudioBtn.style.display = 'block'; // Show play button after animations
                    
                    // Add elements to neural net after animations
                    if (window.neuralNet) {
                        document.querySelectorAll('.interact-with-net').forEach(element => {
                            window.neuralNet.addElement(element);
                        });
                    }
                }, 50);
            }, 5000); // Wait for 5 seconds before transforming to logo
        }, 500);
    }, 2000);


    // Audio play/pause functionality
    function toggleAudio() {
        if (isAudioPlaying) {
            audioElement.pause();
            playAudioBtn.textContent = '▶ Play Audio';
            canvasElement.style.opacity = '0';
        } else {
            audioElement.play();
            playAudioBtn.textContent = '⏸ Pause Audio';
            canvasElement.style.opacity = '1';
        }
        isAudioPlaying = !isAudioPlaying;
    }

    playAudioBtn.addEventListener('click', toggleAudio);

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
    const mobileCloseBtn = document.querySelector('.mobile-close-btn');

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

    // Function to add new elements to the neural net interaction
    function addElementToNeuralNet(element) {
        if (window.neuralNet) {
            window.neuralNet.addElement(element);
        }
    }

    // Example of how to use addElementToNeuralNet:
    // If you dynamically create new elements that should interact with the neural net:
    // const newElement = document.createElement('div');
    // document.body.appendChild(newElement);
    // addElementToNeuralNet(newElement);

    // Initialize neural net interaction for existing elements
    document.querySelectorAll('.interact-with-net').forEach(element => {
        addElementToNeuralNet(element);
    });
});
