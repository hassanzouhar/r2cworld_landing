# R2C.world Landing Page

This project is a visually striking and interactive landing page for R2C.world (Restless Rebel Collective), a concept/idea factory. It features a 3D Earth model with dynamic star background, created using Three.js.

## Features

- 3D Earth model with custom textures
- Dynamic star background
- Responsive design
- Animated text with gradient effect
- Modern, space-themed aesthetic

## Prerequisites

- A modern web browser
- Python 3.x (for running a local server)

## Setup

1. Clone this repository or download the source code.
2. Ensure you have the following files in your project directory:
   - `index.html`
   - `/img/earth1.png` (texture map)
   - `/img/earth2.png` (bump map)
   - `/img/earth3.png` (specular map)

## Running the Project

1. Open a terminal or command prompt.
2. Navigate to the project directory.
3. Run the following command to start a local server:
   ```
   python -m http.server 8000
   ```
4. Open a web browser and go to `http://localhost:8000`

## Customization

- To modify the Earth's appearance, replace the texture images in the `/img` directory.
- Adjust the rotation speed, star count, or other parameters in the JavaScript code within `index.html`.

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Three.js (version r128)

## Notes

- Ensure your browser supports WebGL for the 3D effects to work properly.
