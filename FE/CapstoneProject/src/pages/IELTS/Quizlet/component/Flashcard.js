// src/pages/IELTS/Quizlet/component/Flashcard.js
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ReactCardFlip from 'react-card-flip';
import { FaSyncAlt } from 'react-icons/fa'; // Sử dụng react-icons cho biểu tượng

const Flashcard = ({ vocabulary }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    return (
        <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
            {/* Front Side */}
            <div
                className="w-full h-64 bg-white border border-gray-300 rounded-md p-6 flex flex-col items-center justify-center shadow-md cursor-pointer relative transition-transform duration-700 ease-in-out"
                onClick={handleFlip}
            >
                <FaSyncAlt className="absolute top-2 right-2 text-gray-400" />
                <div className="text-center">
                    <strong className="text-lg">Định nghĩa:</strong>
                    <p className="mt-4 text-gray-700">{vocabulary.definition}</p>
                    {vocabulary.example && (
                        <p className="mt-2 italic text-sm text-gray-500">Ví dụ: {vocabulary.example}</p>
                    )}
                </div>
            </div>

            {/* Back Side */}
            <div
                className="w-full h-64 bg-blue-600 text-white border border-gray-300 rounded-md p-6 flex flex-col items-center justify-center shadow-md cursor-pointer relative transition-transform duration-700 ease-in-out"
                onClick={handleFlip}
            >
                <FaSyncAlt className="absolute top-2 right-2 transform rotate-180 text-gray-400" />
                <div className="text-center">
                    <strong className="text-lg">Từ:</strong>
                    <p className="mt-4 text-2xl font-bold">{vocabulary.word}</p>
                </div>
            </div>
        </ReactCardFlip>
    );
};

Flashcard.propTypes = {
    vocabulary: PropTypes.shape({
        id: PropTypes.number.isRequired,
        word: PropTypes.string.isRequired,
        definition: PropTypes.string.isRequired,
        example: PropTypes.string,
    }).isRequired,
};

export default Flashcard;
