import React, { useRef, useEffect, useState, useCallback, MouseEventHandler } from 'react';
import {usePaths} from "@/hooks/PathDrawContext";

const AntGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [isDrawing, setIsDrawing] = useState(false);
  const isDrawing = useRef<boolean>(false);
  const { currentPath, paths,ctx, setCtx, isCanvasReady,  setIsCanvasReady} = usePaths()
  const prevCoordinates = useRef<{x: number | null, y: number | null}>({x: null, y: null})

  useEffect(() => {
    if (canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        setCtx(context);
        setIsCanvasReady(true)
        //     // Set canvas size
        // canvasRef.current.width = window.innerWidth
        // canvasRef.current.height = window.innerHeight
      }
    }
  }, []);


  const drawLine = (
    canvasContext : CanvasRenderingContext2D | null | undefined, prevX : number | null, prevY: number | null, currentX:number, currentY: number
  ) => {

    if (!isDrawing.current) return;

    if (!canvasContext) return;

    if(!prevX || !prevY || !currentPath.current) return

    console.log("drawline - move", canvasContext, currentPath.current, prevX, prevY)
    canvasContext.strokeStyle = 'white';
    canvasContext.lineWidth = 5;
    canvasContext.lineCap = 'round';

    canvasContext.beginPath();
    currentPath.current.moveTo(prevX, prevY);
    currentPath.current.lineTo(currentX, currentY);
    canvasContext.stroke(currentPath.current);
    canvasContext.closePath();
  };

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {

    if(!isCanvasReady) return

    if(isDrawing.current){
        const prevX = prevCoordinates.current.x
        const prevY = prevCoordinates.current.y

        const context = canvasRef.current?.getContext('2d');
        
        if(!ctx) return

        const rect = canvasRef.current?.getBoundingClientRect();
        
        const currentX = e.clientX - rect?.x;
        const currentY = e.clientY - rect?.y;
        drawLine(context, prevX, prevY, currentX, currentY)

        prevCoordinates.current.x = currentX
        prevCoordinates.current.y = currentY

    }

  }, [isCanvasReady])
  // set isDrawing state to true
  const onMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if(!isCanvasReady) return
    isDrawing.current = true;
    if(!ctx) return

    // get the bouding context of the canvas element
    const rect = canvasRef.current?.getBoundingClientRect();

    prevCoordinates.current.x = e.clientX - rect?.x;
    prevCoordinates.current.y = e.clientY - rect?.y;

    const newpath = new Path2D();
    currentPath.current = newpath
  }, [isCanvasReady])

  // reset the srawing state on mouse up
  const onMouseUp = useCallback(() => {
    if(!isCanvasReady) return
    if(isDrawing.current){
        isDrawing.current = false
        prevCoordinates.current.x = null;
        prevCoordinates.current.y = null;
        console.log('current path', currentPath.current)
        if(currentPath.current){
            const completedPath = new Path2D(currentPath.current);
            paths.current = [...paths.current, completedPath]
                  // Clear the canvas and redraw all paths
            // ctx?.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
            // paths.current.forEach(path => ctx?.stroke(path));
            currentPath.current = null
        }
    }
  }, [isCanvasReady])

  console.log({paths: paths.current})

  return (
    <canvas
      id="draw-canvas"
      width={1000}
      height={500}
      ref={canvasRef}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      style={{ background: 'transparent' }}
    />
  );
};

export default AntGame;