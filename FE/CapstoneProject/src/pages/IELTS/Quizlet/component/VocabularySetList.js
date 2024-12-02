// src/pages/IELTS/Quizlet/VocabularySetList.js
import React, { useEffect, useState } from 'react';
import { getAllVocabularySets } from '../../../api/apiService/dataService';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const VocabularySetList = () => {
    const [sets, setSets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSets = async () => {
            try {
                const data = await getAllVocabularySets();
                setSets(data);
            } catch (err) {
                console.error(err);
                setError('Không thể tải danh sách bộ từ vựng. Vui lòng thử lại.');
                toast.error('Không thể tải danh sách bộ từ vựng. Vui lòng thử lại.');
            } finally {
                setLoading(false);
            }
        };
        fetchSets();
    }, []);

    if (loading) {
        return <div className="max-w-4xl mx-auto p-8 text-center">Đang tải...</div>;
    }

    if (error) {
        return <div className="max-w-4xl mx-auto p-8 text-red-500">{error}</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-8">
            <h2 className="text-3xl font-bold mb-6 text-center">Danh Sách Bộ Từ Vựng</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sets.map(set => (
                    <div key={set.id} className="border border-gray-300 rounded-md p-6 shadow-md">
                        <h3 className="text-2xl font-semibold mb-2">{set.title}</h3>
                        <p><strong>Chủ đề:</strong> {set.topic}</p>
                        <p><strong>Mức độ:</strong> {set.level}</p>
                        <p><strong>Số lượng từ:</strong> {set.quantity}</p>
                        <div className="mt-4 flex justify-between">
                            <Link to={`/IELTS/VOCAB/sets/${set.id}/flashcards`} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition">
                                Luyện Từ Vựng
                            </Link>
                            <Link to={`/IELTS/VOCAB/sets/${set.id}`} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
                                Chi Tiết
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VocabularySetList;
