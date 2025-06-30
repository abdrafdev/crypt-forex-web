import React from 'react'

export const CornerDecorations: React.FC = () => {
    return (
        <>
            <img
                src="/corner-decoration.svg"
                alt="Corner decoration"
                className="absolute top-0 left-0 w-[150px] h-[150px] opacity-70"
            />
            <img
                src="/corner-decoration.svg"
                alt="Corner decoration"
                className="absolute top-0 right-0 w-[150px] h-[150px] opacity-70 rotate-90"
            />
            <img
                src="/corner-decoration.svg"
                alt="Corner decoration"
                className="absolute bottom-0 left-0 w-[150px] h-[150px] opacity-70 -rotate-90"
            />
            <img
                src="/corner-decoration.svg"
                alt="Corner decoration"
                className="absolute bottom-0 right-0 w-[150px] h-[150px] opacity-70 rotate-180"
            />
        </>
    )
}