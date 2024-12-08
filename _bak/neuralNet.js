class NeuralNet {
    constructor(canvas) {
        console.log('Initializing NeuralNet'); // Debugging log
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;

        this.nodes = [];
        this.connections = [];
        this.mouse = { x: null, y: null };
        this.elements = [];

        // Initialize nodes and connections
        this.init();

        // Start the animation loop
        this.animate();

        // Event listener for mouse movement
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });

        // Clear mouse coordinates on mouseleave
        canvas.addEventListener('mouseleave', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }

    init() {
        console.log('Initializing nodes and connections'); // Debugging log
        const nodeCount = 100;

        // Create nodes
        for (let i = 0; i < nodeCount; i++) {
            this.nodes.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                radius: Math.random() * 2 + 1,
                vx: Math.random() * 2 - 1,
                vy: Math.random() * 2 - 1
            });
        }

        // Create random connections between nodes
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                if (Math.random() > 0.95) { // 5% chance to connect
                    this.connections.push([this.nodes[i], this.nodes[j]]);
                }
            }
        }
    }

    animate() {
        // Clear the canvas for the next frame
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Update node positions and interactions
        this.updateNodes();

        // Draw connections and nodes
        this.drawConnections();
        this.drawNodes();

        // Loop the animation
        requestAnimationFrame(() => this.animate());
    }

    updateNodes() {
        this.nodes.forEach(node => {
            // Update node positions
            node.x += node.vx;
            node.y += node.vy;

            // Bounce nodes off edges
            if (node.x < 0 || node.x > this.width) node.vx *= -1;
            if (node.y < 0 || node.y > this.height) node.vy *= -1;

            // Interaction with mouse
            if (this.mouse.x !== null && this.mouse.y !== null) {
                const dx = this.mouse.x - node.x;
                const dy = this.mouse.y - node.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) { // Interaction radius
                    node.x -= dx * 0.05;
                    node.y -= dy * 0.05;
                }
            }

            // Interaction with DOM elements
            this.elements.forEach(element => {
                const rect = element.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                const dx = centerX - node.x;
                const dy = centerY - node.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const radius = Math.max(rect.width, rect.height) / 2;

                if (distance < radius + 50) {
                    node.x -= dx * 0.02;
                    node.y -= dy * 0.02;
                }
            });
        });
    }

    drawNodes() {
        this.nodes.forEach(node => {
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            this.ctx.fill();
        });
    }

    drawConnections() {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 0.5;

        this.connections.forEach(([nodeA, nodeB]) => {
            this.ctx.beginPath();
            this.ctx.moveTo(nodeA.x, nodeA.y);
            this.ctx.lineTo(nodeB.x, nodeB.y);
            this.ctx.stroke();
        });
    }

    addElement(element) {
        console.log('Adding element to interaction:', element); // Debugging log
        this.elements.push(element);

        // Show logo if hidden
        if (element.id === 'r2c-logo') {
            element.classList.remove('hidden');
            element.classList.add('visible');
        }
    }

    resize(width, height) {
        console.log('Resizing canvas to', width, height); // Debugging log
        this.width = width;
        this.height = height;
        this.canvas.width = width;
        this.canvas.height = height;
    }
}

// Initialize the neural net when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed'); // Debugging log

    // Setup canvas
    const canvas = document.getElementById('neural-net');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Initialize NeuralNet instance
    const neuralNet = new NeuralNet(canvas);

    // Add page elements to interact with the neural net
    const elementsToInteract = document.querySelectorAll('.interact-with-net');
    elementsToInteract.forEach(element => neuralNet.addElement(element));

    // Handle terminal button click
    const terminalButton = document.getElementById('open-terminal');
    const terminalModal = document.getElementById('terminal-modal');
    terminalButton.addEventListener('click', () => {
        terminalModal.style.display = 'flex'; // Show modal
    });

    // Handle window resizing
    window.addEventListener('resize', () => {
        neuralNet.resize(window.innerWidth, window.innerHeight);
    });
});