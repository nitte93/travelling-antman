import React, { useRef, useEffect, useState, useCallback, MouseEventHandler } from 'react';
import {usePaths} from "@/hooks/PathDrawContext";

  // Define possible movements
  const movements = [
    { x: 0, y: -1 },  // Up
    { x: 1, y: -1 },  // Up-right
    { x: 1, y: 0 },   // Right
    { x: 1, y: 1 },   // Down-right
    { x: 0, y: 1 },   // Down
    { x: -1, y: 1 },  // Down-left
    { x: -1, y: 0 },  // Left
    { x: -1, y: -1 }, // Up-left
  ];

interface Path2Dx extends Path2D {
    moveTo(x: number, y: number): void;
    lineTo(x: number, y: number): void;
}
const AntGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [isDrawing, setIsDrawing] = useState(false);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const antPositionRef = useRef({x: 0, y: 0});
  const animationFrameRef = useRef<number>();
  const isDrawing = useRef<boolean>(false);
  const prevDirectionIndex = useRef<number>(0);
  const prevCoordinates = useRef<{x: number | null, y: number | null}>({x: null, y: null})
  const {ctx: drawContext, isPointOnAnyPath} = usePaths()
  const [isCanvasReady, setIsCanvasReady] = useState(false);




  useEffect(() => {
    if (canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        setCtx(context);
        setIsCanvasReady(true)
        //     // Set canvas size
        // canvasRef.current.width = window.innerWidth
        // canvasRef.current.height = window.innerHeight
        // Initial ant position
        antPositionRef.current = { x: canvasRef.current.width / 2, y: canvasRef.current.height / 2 };

      }
        
    }
  }, []);

//   const drawAnt = useCallback((ctx: CanvasRenderingContext2D) => {
//     if(!isCanvasReady) return
//     ctx.fillStyle = 'black';
//     ctx.beginPath();
//     const img = new Image();
//     img.src = "./image.png";
//     img.onload = () => {
//         ctx.drawImage(img, antPositionRef.current.x, antPositionRef.current.y, 10, 10);
//     };
//     // ctx.arc(antPositionRef.current.x, antPositionRef.current.y, 5, 0, Math.PI * 2);
//     // ctx.fill();
//   },[isCanvasReady]);
const drawHighResAnt = useCallback((x: number, y: number, size: number = 7, legAngle: number = 0, rotationAngle: number = 0) => {
    // const { ctx } = stateRef.current;
    if (!ctx || !isCanvasReady) return;
  
    // Save the current context state
    ctx.save();
  
    // Move to the ant's position
    ctx.translate(x, y);

    ctx.rotate(rotationAngle);  // Rotate the ant based on its movement direction
  
    // Create a shiny black gradient for the ant body
    const gradient = ctx.createLinearGradient(-size, -size, size, size);
    gradient.addColorStop(0, '#050505');  // Dark black for shadow
    gradient.addColorStop(0.5, '#1d1d1d');  // Mid-tone for shine
    gradient.addColorStop(1, '#4b4b4b');  // Light for reflection
  
    ctx.fillStyle = gradient;
    ctx.strokeStyle = '#000000'; // Black outline
    ctx.lineWidth = size * 0.03;
  
    // Draw abdomen (back part)
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.8, size * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  
    // Draw thorax (middle part)
    ctx.beginPath();
    ctx.ellipse(-size * 1.2, 0, size * 0.5, size * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  
    // Draw head (front part)
    ctx.beginPath();
    ctx.ellipse(-size * 1.8, 0, size * 0.4, size * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  
    // Draw realistic antennae
    ctx.lineWidth = size * 0.02;
    ctx.beginPath();
    ctx.moveTo(-size * 2.1, -size * 0.1);
    ctx.quadraticCurveTo(-size * 2.5, -size * 0.6, -size * 2.2, -size * 0.8);
    ctx.stroke();
  
    ctx.beginPath();
    ctx.moveTo(-size * 2.1, size * 0.1);
    ctx.quadraticCurveTo(-size * 2.5, size * 0.6, -size * 2.2, size * 0.8);
    ctx.stroke();
  
    // Draw segmented legs with realistic joints and leg traces
    const legPositions = [-0.6, 0, 0.6];  // Leg starting positions
    const legSwing = Math.sin(legAngle) * size * 0.2;  // Leg movement based on a sine wave for realistic swing
  
    legPositions.forEach((pos, i) => {
      const legOffset = (i % 2 === 0 ? legSwing : -legSwing); // Alternate leg swing
  
      // Draw leg trace (faint stroke for the legs as traces)
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';  // Faint trace color
      ctx.lineWidth = size * 0.01;
      ctx.beginPath();
      ctx.moveTo(pos * size * 2.8, size * 0.5 - legOffset);
      ctx.lineTo(pos * size, size * 0.1);
      ctx.stroke();
  
      // Upper leg (first segment)
      ctx.strokeStyle = '#000000';  // Reset to solid black for the legs
      ctx.lineWidth = size * 0.03;
      ctx.beginPath();
      ctx.moveTo(pos * size, -size * 0.1);
      ctx.quadraticCurveTo(pos * size * 1.5, -size * 0.5 + legOffset, pos * size * 2.0, -size * 0.4 + legOffset);
      ctx.stroke();
  
      // Lower leg (second segment)
      ctx.beginPath();
      ctx.moveTo(pos * size * 2.0, -size * 0.4 + legOffset);
      ctx.quadraticCurveTo(pos * size * 2.5, -size * 0.6 + legOffset, pos * size * 2.8, -size * 0.5 + legOffset);
      ctx.stroke();
  
      // Repeat for lower legs
      ctx.beginPath();
      ctx.moveTo(pos * size, size * 0.1);
      ctx.quadraticCurveTo(pos * size * 1.5, size * 0.5 - legOffset, pos * size * 2.0, size * 0.4 - legOffset);
      ctx.stroke();
  
      ctx.beginPath();
      ctx.moveTo(pos * size * 2.0, size * 0.4 - legOffset);
      ctx.quadraticCurveTo(pos * size * 2.5, size * 0.6 - legOffset, pos * size * 2.8, size * 0.5 - legOffset);
      ctx.stroke();
    });
  
    // Add slight body shadow for depth effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.beginPath();
    ctx.ellipse(-size * 0.1, size * 0.1, size * 0.6, size * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();
  
    // Restore context state
    ctx.restore();
  }, [isCanvasReady]);
  // Handle direction change upon collision
const changeDirectionAfterCollision = (currentDirectionIndex, x, y) => {
  let newDirectionIndex;
  const canvas = canvasRef.current;

  if (!canvas) return movements[currentDirectionIndex];

  // Check if the ant is at the canvas border
  const isAtBorder = x <= 0 || x >= canvas.width || y <= 0 || y >= canvas.height;

  if (isAtBorder) {
    // Choose a direction that moves away from the border
    if (x <= 0) newDirectionIndex = movements.findIndex(m => m.x > 0);
    else if (x >= canvas.width) newDirectionIndex = movements.findIndex(m => m.x < 0);
    else if (y <= 0) newDirectionIndex = movements.findIndex(m => m.y > 0);
    else if (y >= canvas.height) newDirectionIndex = movements.findIndex(m => m.y < 0);
  } else {
    // If not at border, choose a random new direction
    do {
      newDirectionIndex = Math.floor(Math.random() * movements.length);
    } while (newDirectionIndex === currentDirectionIndex);
  }

  prevDirectionIndex.current = newDirectionIndex;
  
  return movements[newDirectionIndex];  // Return the new direction
};

// Adjust position and direction upon collision
const updateAntDirectionOnCollision = (x, y) => {
  let antVelocity = { x: 0, y: 0 };  // Initialize ant's movement velocity

  const canvas = canvasRef.current;

  if (!canvas) return antVelocity;
  const isAtBorder = x <= 0 || x >= canvas.width || y <= 0 || y >= canvas.height;

  if (isPointOnAnyPath(drawContext, x, y)|| isAtBorder) {
      // If collision detected, reverse direction or change it
      const newDirection = changeDirectionAfterCollision(prevDirectionIndex.current, x, y);

      // Update ant's velocity based on the new direction
      antVelocity = { x: newDirection.x * 0.7, y: newDirection.y * 0.7 };  // Adjust speed if necessary
  } else {
      // Continue moving in the current direction
      const currentDirection = movements[prevDirectionIndex.current];
      antVelocity = { x: currentDirection.x * 0.7, y: currentDirection.y * 0.7 };
  }

  // // Update the ant's position with the new velocity
  // antPositionRef.current.x += antVelocity.x;
  // antPositionRef.current.y += antVelocity.y;
  // Update the ant's position with the new velocity
  antPositionRef.current.x = Math.max(0, Math.min(canvas.width, antPositionRef.current.x + antVelocity.x));
  antPositionRef.current.y = Math.max(0, Math.min(canvas.height, antPositionRef.current.y + antVelocity.y));

  return antVelocity;
};
  // Animation loop for smaller, realistic moving ant with leg traces
  const animateMovingHighResAnt = () => {
    let legAngle = 0;
    // let x = 0;
    // let y = 200;  // Position the ant lower for better visibility
    // Get current ant position
    let speed = 0.7;  // Realistic, slightly slower movement
    
    const animate = () => {
      legAngle += 0.1;  // Leg movement speed
      if (legAngle > Math.PI * 2) legAngle = 0;
      
      let { x, y } = antPositionRef.current;
      // Update the ant's position
      // x += speed;
      // if (x > canvasRef.current.width) {
      //   x = -30;  // Reset position if the ant reaches the end of the canvas
      // }
          // Check for collision and update direction if needed
      const antVelocity = updateAntDirectionOnCollision(x, y); 

      // Clear the canvas before redrawing
    //   const { ctx, canvas } = stateRef.current;
      if (ctx) {
        // ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            ctx.clearRect(
                0,
                0,
                canvasRef.current.width,
                canvasRef.current?.height
            )
      }
      
      console.log(isPointOnAnyPath(drawContext, x, y), 'is point on path')
      // Draw the ant at its new position with leg traces
      // drawHighResAnt(x, y, 7, legAngle);  // Reduced size for realism with leg traces
      // Draw the ant at its new position and apply the rotation
      const angle = Math.atan2(antVelocity.y, antVelocity.x);  // Calculate the rotation angle
      drawHighResAnt(antPositionRef.current.x, antPositionRef.current.y, 7, legAngle, angle);  // Pass angle to rotate the body
      
  
      // Request the next frame
      requestAnimationFrame(animate);
    };
  
    animate();
  };
  
// Trigger the ant animation once the canvas is ready
  useEffect(() => {
    if (isCanvasReady) {
        // animateMovingHighResAnt();
          // Start the animation loop
        animationFrameRef.current = requestAnimationFrame(animateMovingHighResAnt);
    }
    return () => {
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
    };
  }, [isCanvasReady, animateMovingHighResAnt]);
  

//   const moveAnt = useCallback((ignoreDirection?: null | number) => {
//     if(!isCanvasReady) return

//     if(!ctx) return;

//     // Choose a random movement
//     let availableDirection = movements;
//     let directionIndex = prevDirectionIndex.current
//     if(ignoreDirection !== undefined){
//         availableDirection = movements.filter((item, index) => index !== ignoreDirection)
//         directionIndex = Math.floor(Math.random() * availableDirection.length);
//     }
//     console.log(availableDirection, directionIndex, ignoreDirection)
//     const movementDirection = availableDirection[directionIndex];

//     const antNexCoordinates = {
//         x: antPositionRef.current.x + movementDirection.x * 0.2,
//         y: antPositionRef.current.y + movementDirection.y * 0.2
//     }

//     // antPositionRef.current = {
//     //     x: antPositionRef.current.x + movementDirection.x * 0.2,
//     //     y: antPositionRef.current.y + movementDirection.y * 0.2
//     // };

//     // antPositionRef.current.x = Math.max(5, Math.min(canvas.width - 5, antPositionRef.current.x))
//     // antPositionRef.current.y = Math.max(5, Math.min(canvas.height - 5, antPositionRef.current.y))
//     if(isPointOnAnyPath(antNexCoordinates.x, antNexCoordinates.y)){
//         console.log("is Point on path wow")
//         moveAnt(directionIndex)
//         if (animationFrameRef.current) {
//             cancelAnimationFrame(animationFrameRef.current);
//         }
    
//     }else{
//         prevDirectionIndex.current = directionIndex
//         antPositionRef.current = {
//             x: antNexCoordinates.x,
//             y: antNexCoordinates.y
//         };
//     }

//   }, [isCanvasReady]);

//   const updateCanvas = useCallback(() => {
//     if(!isCanvasReady) return

//     if(!ctx) return;

//     // and clearing the path
//     ctx.clearRect(
//         antPositionRef.current.x - 50,
//         antPositionRef.current.y - 30,
//         100,
//         100
//     )

//     moveAnt();
//     drawAnt(ctx);
//     if(animationFrameRef.current){
//         cancelAnimationFrame(animationFrameRef.current);
//     }
//     animationFrameRef.current = requestAnimationFrame(updateCanvas)
//   }, [drawAnt, moveAnt, isCanvasReady])

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     if (!ctx) return;

//     // Set canvas size
//     canvas.width = window.innerWidth
//     canvas.height = window.innerHeight

//     // Initial ant position
//     antPositionRef.current = { x: canvas.width / 2, y: canvas.height / 2 };

//     // Start the animation loop
//     // animationFrameRef.current = requestAnimationFrame(updateCanvas);

//     return () => {
//       if (animationFrameRef.current) {
//         cancelAnimationFrame(animationFrameRef.current);
//       }
//     };
//   }, [updateCanvas, isCanvasReady]);



  return (
    <canvas
      id="ant-canvas"
      width={1000}
      height={500}
      ref={canvasRef}
      style={{ background: 'green',pointerEvents: 'none' }}
    />
  );
};

export default AntGame;