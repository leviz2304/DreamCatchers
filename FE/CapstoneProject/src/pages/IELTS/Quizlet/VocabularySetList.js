// src/components/VocabularySetList.js
import React, { useEffect, useState } from 'react';
import { getVocabularySets, deleteVocabularySet } from '../../../api/apiService/dataService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { FaPlus, FaBook, FaTrash, FaEdit, FaPlay } from 'react-icons/fa';

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
        return <div className="max-w-md mx-auto p-4 text-center text-gray-600">Đang tải...</div>;
    }

    if (error) {
        return <div className="max-w-md mx-auto p-4 text-red-500">{error}</div>;
    }

    return (
        <div className="max-w-5xl mx-auto p-4 mt-20">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6 space-y-2 sm:space-y-0 sm:space-x-4">
                <input
                    type="text"
                    placeholder="Tìm kiếm bộ từ vựng..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full sm:w-auto flex-1 border border-gray-300 rounded-md p-2"
                />
                <button
                    onClick={() => navigate(`/IELTS/VOCAB/create`)}
                    className="bg-green-500 flex items-center space-x-2 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
                >
                    <FaPlus />
                    <span>Tạo Bộ Từ Vựng</span>
                </button>
            </div>

            <h2 className="text-3xl font-bold mb-4 text-gray-800">Bộ Từ Vựng Của Bạn</h2>
            {filteredSets.length === 0 ? (
                <p className="text-gray-500">Bạn chưa có bộ từ vựng nào. Hãy tạo một bộ mới!</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSets.map(set => (
                        <div key={set.id} className="p-4 border rounded-md shadow hover:shadow-lg transition-shadow bg-white">
                            <h3 className="text-xl font-semibold text-indigo-700">{set.title}</h3>
                            <p className="text-gray-600 mt-1">{set.quantity} từ - {set.topic} - {set.level}</p>
                            <div className="flex space-x-2 mt-4">
                                <button
                                    onClick={() => navigate(`/IELTS/VOCAB/learn/${set.id}`)}
                                    className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition flex items-center space-x-1"
                                >
                                    <FaPlay /><span>Luyện tập</span>
                                </button>
                                <button
                                    onClick={() => navigate(`/sets/${set.id}/edit`)}
                                    className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition flex items-center space-x-1"
                                >
                                    <FaEdit /><span>Chỉnh sửa</span>
                                </button>
                                <button
                                    onClick={() => handleDelete(set.id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition flex items-center space-x-1"
                                >
                                    <FaTrash /><span>Xóa</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default VocabularySetList;
