class NeuralNet {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        this.nodes = [];
        this.connections = [];
        this.mouse = { x: null, y: null };
        this.elements = [];

        this.init();
        this.animate();

        canvas.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }

    init() {
        const nodeCount = 100;
        for (let i = 0; i < nodeCount; i++) {
            this.nodes.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                radius: Math.random() * 2 + 1,
                vx: Math.random() * 2 - 1,
                vy: Math.random() * 2 - 1
            });
        }

        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                if (Math.random() > 0.95) {
                    this.connections.push([this.nodes[i], this.nodes[j]]);
                }
            }
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.updateNodes();
        this.drawConnections();
        this.drawNodes();
        requestAnimationFrame(() => this.animate());
    }

    updateNodes() {
        this.nodes.forEach(node => {
            node.x += node.vx;
            node.y += node.vy;

            if (node.x < 0 || node.x > this.width) node.vx *= -1;
            if (node.y < 0 || node.y > this.height) node.vy *= -1;

            // Mouse interaction
            if (this.mouse.x && this.mouse.y) {
                let dx = this.mouse.x - node.x;
                let dy = this.mouse.y - node.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 100) {
                    node.x -= dx * 0.05;
                    node.y -= dy * 0.05;
                }
            }

            // Element interaction
            this.elements.forEach(element => {
                let rect = element.getBoundingClientRect();
                let centerX = rect.left + rect.width / 2;
                let centerY = rect.top + rect.height / 2;
                let dx = centerX - node.x;
                let dy = centerY - node.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                let radius = Math.max(rect.width, rect.height) / 2;
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
        this.elements.push(element);
    }

    resize(width, height) {
        this.width = width;
        this.height = height;
        this.canvas.width = width;
        this.canvas.height = height;
    }
}

// Initialize the neural net when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('neural-net');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    window.neuralNet = new NeuralNet(canvas);

    // Add page elements to interact with the neural net
    const elementsToInteract = document.querySelectorAll('.interact-with-net');
    elementsToInteract.forEach(element => window.neuralNet.addElement(element));

    // Resize handler
    window.addEventListener('resize', () => {
        window.neuralNet.resize(window.innerWidth, window.innerHeight);
    });
});
