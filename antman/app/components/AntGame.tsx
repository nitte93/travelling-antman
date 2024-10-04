import React, { useRef, useEffect, useState, useCallback } from 'react';

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

const AntGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const antPositionRef = useRef({x: 0, y: 0});
  const animationFrameRef = useRef<number>();

  const drawAnt = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(antPositionRef.current.x, antPositionRef.current.y, 5, 0, Math.PI * 2);
    ctx.fill();
  },[]);

  const moveAnt = useCallback(() => {
    const canvas = canvasRef.current;
    if(!canvas) return;

    // Choose a random movement
    // const movement = movements[Math.floor(Math.random() * movements.length)];
    const movement = movements[0];


    antPositionRef.current = {
        x: antPositionRef.current.x + movement.x * 0.2,
        y: antPositionRef.current.y + movement.y * 0.2
    };

    antPositionRef.current.x = Math.max(5, Math.min(canvas.width - 5, antPositionRef.current.x))
    antPositionRef.current.y = Math.max(5, Math.min(canvas.height - 5, antPositionRef.current.y))

  }, []);

  const updateCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if(!ctx || !canvas) return;

    ctx.clearRect(
        antPositionRef.current.x - 6,
        antPositionRef.current.y - 6,
        12,
        12
    )

    moveAnt();
    drawAnt(ctx);

    animationFrameRef.current = requestAnimationFrame(updateCanvas)
  }, [drawAnt, moveAnt])

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Initial ant position
    antPositionRef.current = { x: canvas.width / 2, y: canvas.height / 2 };

    // Start the animation loop
    animationFrameRef.current = requestAnimationFrame(updateCanvas);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [updateCanvas]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    // draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.beginPath(); // Start a new path when stopping drawing
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    ctx.strokeStyle = 'white';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';

    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };
  return (
    <canvas
      ref={canvasRef}
      onMouseDown={startDrawing}
      onMouseUp={stopDrawing}
      onMouseMove={draw}
      style={{ background: 'green' }}
    />
  );
};

export default AntGame;