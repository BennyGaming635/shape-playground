const canvas = document.getElementById("bouncingCanvas");
const ctx = canvas.getContext("2d");

let shapes = [];
let speed = 5;
let angle = 45;
let shapeType = "circle";

canvas.width = 800;
canvas.height = 600;

// Function to create a new shape
function createShape(shapeType) {
    return {
        shape: shapeType,
        x: Math.random() * (canvas.width - 50) + 25,
        y: Math.random() * (canvas.height - 50) + 25,
        size: 50,
        speed: speed,
        angle: angle,
        vx: 0, 
        vy: 0,
    };
}

// Update velocity based on the selected speed and angle
function setVelocityForAll() {
    const radian = angle * (Math.PI / 180); // Convert angle to radians
    shapes.forEach(shape => {
        shape.vx = shape.speed * Math.cos(radian);
        shape.vy = shape.speed * Math.sin(radian);
    });
}

// Draw the selected shape
function drawShape(shape) {
    ctx.beginPath();
    if (shape.shape === 'circle') {
        ctx.arc(shape.x, shape.y, shape.size, 0, Math.PI * 2);
    } else if (shape.shape === 'square') {
        ctx.rect(shape.x - shape.size / 2, shape.y - shape.size / 2, shape.size, shape.size);
    } else if (shape.shape === 'triangle') {
        ctx.moveTo(shape.x, shape.y - shape.size / 2);
        ctx.lineTo(shape.x - shape.size / 2, shape.y + shape.size / 2);
        ctx.lineTo(shape.x + shape.size / 2, shape.y + shape.size / 2);
        ctx.closePath();
    }
    ctx.fillStyle = "#3498db";
    ctx.fill();
}

// Update positions and handle bounce mechanics
function updatePositions() {
    shapes.forEach(shape => {
        shape.x += shape.vx;
        shape.y += shape.vy;

        // Wall bounce mechanics
        if (shape.x + shape.size / 2 > canvas.width || shape.x - shape.size / 2 < 0) {
            shape.vx = -shape.vx;
        }

        if (shape.y + shape.size / 2 > canvas.height || shape.y - shape.size / 2 < 0) {
            shape.vy = -shape.vy;
        }

        // Draw shape after updating position
        drawShape(shape);
    });
}

// Detect collisions between shapes and bounce them off each other
function handleCollisions() {
    shapes.forEach((shape, index) => {
        shapes.forEach((otherShape, otherIndex) => {
            if (index !== otherIndex) {
                const dx = shape.x - otherShape.x;
                const dy = shape.y - otherShape.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < shape.size + otherShape.size) {
                    // Swap velocities (simple collision response)
                    const tempVx = shape.vx;
                    const tempVy = shape.vy;
                    shape.vx = otherShape.vx;
                    shape.vy = otherShape.vy;
                    otherShape.vx = tempVx;
                    otherShape.vy = tempVy;
                }
            }
        });
    });
}

// Main animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleCollisions();
    updatePositions();
    requestAnimationFrame(animate);
}

// Event listeners for controls
document.getElementById("speed").addEventListener("input", (e) => {
    speed = parseFloat(e.target.value);
    setVelocityForAll();
});

document.getElementById("angle").addEventListener("input", (e) => {
    angle = parseFloat(e.target.value);
    setVelocityForAll();
});

document.getElementById("shape-select").addEventListener("change", (e) => {
    shapeType = e.target.value;
});

document.getElementById("add-shape").addEventListener("click", () => {
    const newShape = createShape(shapeType);
    shapes.push(newShape);
    setVelocityForAll();
});

// Initialize the first shape and start animation
shapes.push(createShape("circle"));
setVelocityForAll();
animate();
