// src/pages/IELTS/Quizlet/DetailSet.js
import React, { useEffect, useState } from 'react';
import { getVocabularySetById } from '../../../api/apiService/dataService';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import FlashcardList from './component/FlashcardList';

const DetailSet = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [vocabularySet, setVocabularySet] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSet = async () => {
            try {
                const data = await getVocabularySetById(id);
                setVocabularySet(data);
            } catch (err) {
                console.error(err);
                setError('Không thể tải bộ từ vựng. Vui lòng thử lại.');
                toast.error('Không thể tải bộ từ vựng. Vui lòng thử lại.');
            }
        };
        fetchSet();
    }, [id]);

    if (error) {
        return <div className="max-w-4xl mx-auto p-8 text-red-500">{error}</div>;
    }

    if (!vocabularySet) {
        return <div className="max-w-4xl mx-auto p-8 text-center">Đang tải...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-8">
            <h2 className="text-3xl font-bold mb-6 text-center">{vocabularySet.title}</h2>
            <div className="mb-6 text-center">
                <span className="font-semibold">Chủ đề:</span> {vocabularySet.topic} &nbsp;|&nbsp; 
                <span className="font-semibold">Mức độ:</span> {vocabularySet.level} &nbsp;|&nbsp; 
                <span className="font-semibold">Số lượng từ:</span> {vocabularySet.quantity}
            </div>
            <FlashcardList vocabularies={vocabularySet.vocabularies} />
            <div className="mt-8 flex justify-center space-x-4">
                <button
                    onClick={() => navigate('/IELTS/VOCAB/sets')}
                    className="bg-blue-500 text-white px-6 py-3 rounded-md shadow-md hover:bg-blue-600 transition"
                >
                    Quay lại danh sách
                </button>
                <Link to={`/IELTS/VOCAB/sets/${vocabularySet.id}/flashcards`} className="bg-green-500 text-white px-6 py-3 rounded-md shadow-md hover:bg-green-600 transition">
                    Luyện Từ Vựng
                </Link>
            </div>
        </div>
    );
};

export default DetailSet;
