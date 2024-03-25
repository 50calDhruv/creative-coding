const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ]
};

const sketch = () => {
  return ({ context, width, height }) => {
                
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;   

    context.clearRect(0, 0, width, height);
        
            // Draw the background semi-circle
            context.beginPath();
            context.arc(centerX, centerY, width / 2, -Math.PI, 0);
            context.lineWidth = width * 0.0348;
            context.strokeStyle = '#EDEDED';
            context.lineCap = 'round';
            context.stroke();

            const gradient = context.createLinearGradient(0, 0, 200, 0); // Adjust the coordinates as needed
            gradient.addColorStop(0, '#F74A58'); // Red
            gradient.addColorStop(0.25, '#FADA7C'); // Yellow
            gradient.addColorStop(0.5, '#5BE3CC'); // Green-Blue
            gradient.addColorStop(0.75, '#3BA5CF'); // Blue
            gradient.addColorStop(1, '#EE82EE'); // Violet

            // Draw the progress
            const endAngle = -Math.PI + (Math.PI * 0.4);
            context.beginPath();
            context.arc(centerX, centerY, width / 2, - Math.PI * 0.75, endAngle);
            context.lineWidth = width * 0.0348;
            context.strokeStyle = gradient; // Change this color as needed
            context.lineCap = 'round';
            context.stroke();
  };
};

canvasSketch(sketch, settings);
