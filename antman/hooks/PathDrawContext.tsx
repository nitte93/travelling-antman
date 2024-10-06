import React, {useRef, useState, createContext, useContext} from 'react'


export const PathContext = createContext<{
    currentPath: React.MutableRefObject<Path2D | null>,
    paths: React.MutableRefObject<Path2D[]>,
    ctx: CanvasRenderingContext2D | null,
    setCtx: (ctx: CanvasRenderingContext2D | null) => void,
    isCanvasReady: boolean,
    setIsCanvasReady: (isReady: boolean) => void,
    isPointOnAnyPath: (context: CanvasRenderingContext2D | null, x: number, y: number) => boolean
}>({
    currentPath: {current: null},
    paths: {current: []},
    ctx: null,
    setCtx: () => {},
    isCanvasReady: false,
    setIsCanvasReady: () => {},
    isPointOnAnyPath: (context, x, y) => false,
})

export const PathProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const currentPath = useRef<Path2D | null>(null);
    const paths = useRef<Path2D[]>([]);
    const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
    const [isCanvasReady, setIsCanvasReady] = useState(false);

    const isPointOnAnyPath = (context: CanvasRenderingContext2D | null, x: number, y: number): boolean => {
        console.log(x, y, paths.current, 'coordinates', paths.current)
        if(!ctx) return false
        return paths.current.some(path => ctx?.isPointInStroke(path, x, y));
    };

    return (
        <PathContext.Provider value={{
            currentPath,
            paths,
            ctx,
            setCtx,
            setIsCanvasReady,
            isCanvasReady,
            isPointOnAnyPath
        }}>
            {children}
        </PathContext.Provider>
    )
}


// Hook to use the pathsRef
export const usePaths = () => useContext(PathContext);

// export const PathProvider: React.FC<{children: React.ReactNode}> = ({ children}) => {
//     const currentPath = useRef<Path2D | null>(null);
//     const paths = useRef<Path2D[]>([]);
//     const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
//     const [isCanvasReady, setIsCanvasReady] = useState(false);


//     return (
//         <PathContext.Provider value={{
//             currentPath,
//             paths,
//             ctx,
//             isCanvasReady
//         }}>
//             {children}
//         </PathContext.Provider>
//     )
// }
// export const useDrawPath = () => {
//     const currentPath = useRef<Path2D | null>(null);
//     const paths = useRef<Path2D[]>([]);
//     const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
//     const [isCanvasReady, setIsCanvasReady] = useState(false);

    
//     const isPointOnAnyPath = (context: CanvasRenderingContext2D | null, x: number, y: number): boolean => {
//         console.log(x, y, paths.current, 'coordinates', paths.current)
//         if(!ctx) return false
//         return paths.current.some(path => ctx?.isPointInStroke(path, x, y));
//       };
    
//     return {
//         currentPath,
//         paths,
//         ctx,
//         setCtx,
//         isPointOnAnyPath,
//         isCanvasReady,
//         setIsCanvasReady
//     }
// }