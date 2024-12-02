// src/pages/IELTS/Quizlet/PracticeVocabulary.js
import React, { useEffect, useState } from 'react';
import { getVocabularySetById } from '../../../api/apiService/dataService';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import Flashcard from './component/Flashcard';
import PropTypes from 'prop-types';

const PracticeVocabulary = () => {
    const { setId } = useParams();
    const navigate = useNavigate();
    const [vocabularySet, setVocabularySet] = useState(null);
    const [error, setError] = useState('');
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [completed, setCompleted] = useState(false);
    const [knownWords, setKnownWords] = useState([]);
    const [wrongWords, setWrongWords] = useState([]);

    useEffect(() => {
        const fetchVocabularySet = async () => {
            try {
                const data = await getVocabularySetById(setId);
                console.log('Vocabulary Set Data:', data);
                setVocabularySet(data);
            } catch (err) {
                console.error(err);
                setError('Không thể tải bộ từ vựng. Vui lòng thử lại.');
                toast.error('Không thể tải bộ từ vựng. Vui lòng thử lại.');
            }
        };
        fetchVocabularySet();
    }, [setId]);

    const handleMarkKnown = () => {
        const currentWord = vocabularySet.vocabularies[currentWordIndex];
        setScore(prevScore => prevScore + 1);
        setKnownWords([...knownWords, currentWord.id]);
        toast.success('Bạn đã biết từ này!');
        moveToNextCard();
    };

    const handleMarkUnknown = () => {
        const currentWord = vocabularySet.vocabularies[currentWordIndex];
        setWrongWords([...wrongWords, currentWord.id]);
        toast.error(`Bạn chưa biết từ này: ${currentWord.word}`);
        moveToNextCard();
    };

    const moveToNextCard = () => {
        if (currentWordIndex + 1 < vocabularySet.vocabularies.length) {
            setCurrentWordIndex(prevIndex => prevIndex + 1);
        } else {
            setCompleted(true);
        }
    };

    if (error) {
        return <div className="max-w-4xl mx-auto p-8 text-red-500">{error}</div>;
    }

    if (!vocabularySet) {
        return <div className="max-w-4xl mx-auto p-8 text-center">Đang tải...</div>;
    }

    if (completed) {
        return (
            <div className="max-w-4xl mx-auto p-8 text-center">
                <h2 className="text-4xl font-bold mb-6">Kết quả của bạn</h2>
                <p>Đã biết {score} trên {vocabularySet.vocabularies.length} từ.</p>
                {wrongWords.length > 0 && (
                    <div className="mt-4">
                        <p>Bạn chưa biết một số từ:</p>
                        <ul className="mt-2 list-disc list-inside">
                            {vocabularySet.vocabularies.filter(word => wrongWords.includes(word.id)).map(word => (
                                <li key={word.id}>{word.word} - {word.definition}</li>
                            ))}
                        </ul>
                    </div>
                )}
                <div className="mt-8 flex justify-center space-x-4">
                    <button
                        onClick={() => navigate('/IELTS/VOCAB/sets')}
                        className="bg-blue-500 text-white px-6 py-3 rounded-md shadow-md hover:bg-blue-600 transition"
                    >
                        Quay lại danh sách
                    </button>
                    <Link to={`/IELTS/VOCAB/sets/${vocabularySet.id}/flashcards`} className="bg-green-500 text-white px-6 py-3 rounded-md shadow-md hover:bg-green-600 transition">
                        Xem Flashcards
                    </Link>
                </div>
            </div>
        );
    }

    const currentWord = vocabularySet.vocabularies[currentWordIndex];

    return (
        <div className="max-w-4xl mx-auto p-8 flex flex-col items-center">
            <h2 className="text-4xl font-bold mb-6 text-center">Luyện Từ Vựng</h2>
            <div className="mb-6 text-center">
                <span className="font-semibold">Chủ đề:</span> {vocabularySet.topic} &nbsp;|&nbsp; 
                <span className="font-semibold">Mức độ:</span> {vocabularySet.level}
            </div>
            
            {/* Thêm thanh tiến độ ở đây */}
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${((currentWordIndex) / vocabularySet.vocabularies.length) * 100}%` }}
                ></div>
            </div>

            <div className="mb-4 text-lg">
                Câu {currentWordIndex + 1} / {vocabularySet.vocabularies.length}
            </div>
            <Flashcard vocabulary={currentWord} />
            <div className="mt-6 flex space-x-4">
                <button
                    onClick={handleMarkKnown}
                    className="bg-green-500 text-white px-6 py-2 rounded-md shadow-md hover:bg-green-600 transition"
                >
                    Tôi biết từ này
                </button>
                <button
                    onClick={handleMarkUnknown}
                    className="bg-red-500 text-white px-6 py-2 rounded-md shadow-md hover:bg-red-600 transition"
                >
                    Tôi chưa biết từ này
                </button>
            </div>
            <div className="mt-8 flex justify-center space-x-4">
                <button
                    onClick={() => navigate('/IELTS/VOCAB/sets')}
                    className="bg-blue-500 text-white px-6 py-3 rounded-md shadow-md hover:bg-blue-600 transition"
                >
                    Quay lại danh sách
                </button>
                {/* Link này có thể không cần thiết nếu bạn đã ở trang flashcards */}
                <Link to={`/IELTS/VOCAB/sets/${vocabularySet.id}/flashcards`} className="bg-green-500 text-white px-6 py-3 rounded-md shadow-md hover:bg-green-600 transition">
                    Xem Flashcards
                </Link>
            </div>
        </div>
    );
};

PracticeVocabulary.propTypes = {
    setId: PropTypes.string,
};

export default PracticeVocabulary;
