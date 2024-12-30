// src/pages/IELTS/Quizlet/CreateVocabularySet.js
import React, { useState } from 'react';
import { generateVocabularySet } from '../../../api/apiService/dataService';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaSpinner } from 'react-icons/fa';

const CreateVocabularySet = () => {
    const [topic, setTopic] = useState('');
    const [quantity, setQuantity] = useState(10);
    const [level, setLevel] = useState('Beginner');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await generateVocabularySet(topic, quantity, level);
            toast.success('Tạo bộ từ vựng thành công');
            navigate(`/IELTS/VOCAB/sets`);
        } catch (err) {
            setError(err.message || 'Đã xảy ra lỗi');
            toast.error(err.message || 'Đã xảy ra lỗi');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-4 mt-20 bg-white border border-gray-200 rounded-md shadow">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Tạo Bộ Từ Vựng Mới</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Chủ đề</label>
                    <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Số lượng từ</label>
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        min="1"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Mức độ</label>
                    <select
                        value={level}
                        onChange={(e) => setLevel(e.target.value)}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                    </select>
                </div>
                {error && <div className="text-red-500 text-sm">{error}</div>}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition flex items-center justify-center space-x-2"
                >
                    {loading ? <FaSpinner className="animate-spin"/> : <FaPlus />}
                    <span>{loading ? 'Đang tạo...' : 'Tạo Bộ Từ Vựng'}</span>
                </button>
            </form>
        </div>
    );
};

export default CreateVocabularySet;
