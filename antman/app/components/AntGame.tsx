import React, { useRef, useEffect, useState, useCallback, MouseEventHandler } from 'react';

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
//   const [isDrawing, setIsDrawing] = useState(false);
  const antPositionRef = useRef({x: 0, y: 0});
  const animationFrameRef = useRef<number>();
  const isDrawing = useRef<boolean>(false);
  const prevCoordinates = useRef<{x: number | null, y: number | null}>({x: null, y: null})

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


  const stopDrawing = () => {
    setIsDrawing(false);
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.beginPath(); // Start a new path when stopping drawing
    }
  };

  const drawLine = (
    canvasContext : CanvasRenderingContext2D | null | undefined, prevX : number | null, prevY: number | null, currentX:number, currentY: number
  ) => {

    if (!isDrawing.current) return;

    if (!canvasContext) return;

    if(!prevX || !prevY) return

    canvasContext.strokeStyle = 'white';
    canvasContext.lineWidth = 5;
    canvasContext.lineCap = 'round';

    canvasContext.beginPath();
    canvasContext.lineTo(prevX, prevY);
    canvasContext.moveTo(currentX, currentY);
    canvasContext.stroke();
  };

  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {

    if(isDrawing.current){
        const prevX = prevCoordinates.current.x
        const prevY = prevCoordinates.current.y

        const currentX = e.clientX
        const currentY = e.clientY

        const canvas = canvasRef.current;
        const canvasContext = canvas?.getContext('2d');
    
        drawLine(canvasContext, prevX, prevY, currentX, currentY)

        prevCoordinates.current.x = currentX
        prevCoordinates.current.y = currentY

    }
    prevCoordinates.current.x

  }
  // set isDrawing state to true
  const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDrawing.current = true;
    prevCoordinates.current.x = e.clientX;
    prevCoordinates.current.y = e.clientY;
  }

  // reset the srawing state on mouse up
  const onMouseUp = () => {
    if(isDrawing.current){
        isDrawing.current = false
        prevCoordinates.current.x = null;
        prevCoordinates.current.y = null;    
    }
  }
  return (
    <canvas
      ref={canvasRef}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      style={{ background: 'green' }}
    />
  );
};

export default AntGame;