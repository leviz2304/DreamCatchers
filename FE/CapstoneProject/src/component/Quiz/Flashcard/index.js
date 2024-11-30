import React, { useState } from "react";

const Flashcard = ({ word, definition, example }) => {
    const [flipped, setFlipped] = useState(false);

    return (
        <div 
            className={`w-64 h-40 border rounded-md shadow-md p-4 cursor-pointer ${flipped ? "bg-blue-100" : "bg-white"}`} 
            onClick={() => setFlipped(!flipped)}
        >
            {flipped ? (
                <div>
                    <h3 className="text-lg font-semibold">{word}</h3>
                    <p className="mt-2 text-sm text-gray-700">{definition}</p>
                    {example && <p className="mt-2 text-xs text-gray-500">Example: {example}</p>}
                </div>
            ) : (
                <h3 className="text-lg font-semibold text-center">Click to flip</h3>
            )}
        </div>
    );
};

export default Flashcard;
