// DragStateContext.tsx
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

type DragStateContextType = {
    isDragging: boolean;
    setDragging: (dragging: boolean) => void;
};

const DragStateContext = createContext<DragStateContextType | undefined>(undefined);

export const DragStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isDragging, setDragging] = useState(true);
    // useEffect(() => {
    //     let timer: ReturnType<typeof setTimeout>;

    //     if (isDragging) {
    //         console.log(isDragging)
    //         timer = setTimeout(() => {
    //             setDragging(false); // Restablece a false después de 1 segundo
    //         }, 1000); // Ajusta el tiempo según lo necesario
    //     }

    //     return () => clearTimeout(timer);
    // }, [isDragging]);
    return (
        <DragStateContext.Provider value={{ isDragging, setDragging }}>
            {children}
        </DragStateContext.Provider>
    );
};

export const useDragState = (): DragStateContextType => {
    const context = useContext(DragStateContext);
    if (!context) {
        throw new Error('useDragState must be used within a DragStateProvider');
    }
    return context;
};
