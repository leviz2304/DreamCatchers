// src/components/VocabularySetList.js
import React, { useEffect, useState } from 'react';
import { getVocabularySets, deleteVocabularySet } from '../../../api/apiService/dataService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const VocabularySetList = () => {
    const [sets, setSets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [filteredSets, setFilteredSets] = useState([]);
    const fetchSets = async () => {
        try {
            const data = await getVocabularySets();
            setSets(data);
        } catch (err) {
            setError(err.message || 'Error fetching sets');
            toast.error(err.message || 'Error fetching sets');
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        setFilteredSets(
            sets.filter(set =>
                set.title.toLowerCase().includes(search.toLowerCase()) ||
                set.topic.toLowerCase().includes(search.toLowerCase()) ||
                set.level.toLowerCase().includes(search.toLowerCase())
            )
        );
    }, [search, sets]);
    useEffect(() => {
        fetchSets();
    }, []);

    const handleDelete = async (setId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa bộ từ vựng này?')) {
            try {
                await deleteVocabularySet(setId);
                setSets(sets.filter(set => set.id !== setId));
                toast.success('Xóa bộ từ vựng thành công');
            } catch (err) {
                toast.error(err.message || 'Failed to delete set');
            }
        }
    };

    if (loading) {
        return <div className="max-w-md mx-auto p-4">Đang tải...</div>;
    }

    if (error) {
        return <div className="max-w-md mx-auto p-4 text-red-500">{error}</div>;
    }

    return (
        <div className="max-w-2xl mx-auto p-4">
            <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Tìm kiếm bộ từ vựng..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2"
                    />
                     <button
                                    onClick={() => navigate(`/IELTS/VOCAB/create`)}
                                    className="bg-green-500 text-white px-3 py-1 rounded-md"
                                >
                                    Tạo Bộ Từ Vựng
                                </button>
                </div>
            <h2 className="text-2xl font-bold mb-4">Bộ Từ Vựng Của Bạn</h2>
            {sets.length === 0 ? (
                <p>Bạn chưa có bộ từ vựng nào. Hãy tạo một bộ mới!</p>
            ) : (
                <ul className="space-y-4">
                    {sets.map(set => (
                        <li key={set.id} className="p-4 border rounded-md flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-semibold">{set.title}</h3>
                                <p className="text-gray-600">{set.quantity} từ - {set.topic} - {set.level}</p>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => navigate(`/IELTS/VOCAB/learn/${set.id}`)}
                                    className="bg-green-500 text-white px-3 py-1 rounded-md"
                                >
                                    Luyện tập
                                </button>
                                <button
                                    onClick={() => navigate(`/sets/${set.id}/edit`)}
                                    className="bg-blue-500 text-white px-3 py-1 rounded-md"
                                >
                                    Chỉnh sửa
                                </button>
                                <button
                                    onClick={() => handleDelete(set.id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded-md"
                                >
                                    Xóa
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default VocabularySetList;
