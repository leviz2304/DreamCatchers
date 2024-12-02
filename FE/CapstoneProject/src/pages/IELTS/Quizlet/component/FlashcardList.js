// src/pages/IELTS/Quizlet/component/FlashcardList.js
import React from 'react';
import Flashcard from './Flashcard';
import PropTypes from 'prop-types';

const FlashcardList = ({ vocabularies }) => {
    if (!Array.isArray(vocabularies)) {
        return <div className="max-w-4xl mx-auto p-8 text-red-500">Dữ liệu từ vựng không hợp lệ.</div>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {vocabularies.map(vocab => (
                <Flashcard key={vocab.id} vocabulary={vocab} />
            ))}
        </div>
    );
};

FlashcardList.propTypes = {
    vocabularies: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            word: PropTypes.string.isRequired,
            definition: PropTypes.string.isRequired,
            example: PropTypes.string,
        })
    ).isRequired,
};

export default FlashcardList;
