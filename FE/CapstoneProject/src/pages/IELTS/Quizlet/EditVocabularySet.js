// src/components/EditVocabularySet.js
import React, { useEffect, useState } from 'react';
import { getVocabularySetById, updateVocabularySet } from '../../../api/apiService/dataService';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { FaPlus, FaTrash, FaSave, FaArrowLeft } from 'react-icons/fa';

const EditVocabularySet = () => {
    const { setId } = useParams();
    const [title, setTitle] = useState('');
    const [topic, setTopic] = useState('');
    const [level, setLevel] = useState('Beginner');
    const [quantity, setQuantity] = useState(10);
    const [vocabularies, setVocabularies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSet = async () => {
            try {
                const data = await getVocabularySetById(setId);
                setTitle(data.title);
                setTopic(data.topic);
                setLevel(data.level);
                setQuantity(data.quantity);
                setVocabularies(data.vocabularies);
            } catch (err) {
                setError(err.message || 'Error fetching set');
                toast.error(err.message || 'Error fetching set');
            } finally {
                setLoading(false);
            }
        };
        fetchSet();
    }, [setId]);

    const handleVocabularyChange = (index, field, value) => {
        const updatedVocabularies = [...vocabularies];
        updatedVocabularies[index][field] = value;
        setVocabularies(updatedVocabularies);
    };

    const handleAddVocabulary = () => {
        setVocabularies([...vocabularies, { word: '', definition: '', example: '' }]);
    };

    const handleRemoveVocabulary = (index) => {
        const updatedVocabularies = [...vocabularies];
        updatedVocabularies.splice(index, 1);
        setVocabularies(updatedVocabularies);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateVocabularySet(setId, {
                title,
                topic,
                level,
                quantity,
                vocabularies,
            });
            toast.success('Cập nhật bộ từ vựng thành công');
            navigate('/IELTS/VOCAB/sets');
        } catch (err) {
            toast.error(err.message || 'Error updating set');
        }
    };

    if (loading) {
        return <div className="max-w-md mx-auto p-4 text-center text-gray-600">Đang tải...</div>;
    }

    if (error) {
        return <div className="max-w-md mx-auto p-4 text-red-500">{error}</div>;
    }

    return (
        <div className="max-w-2xl mx-auto p-4 mt-20">
            <div className="flex items-center space-x-2 mb-4">
                <button
                    onClick={() => navigate('/IELTS/VOCAB/sets')}
                    className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition flex items-center space-x-1"
                >
                    <FaArrowLeft /><span>Quay lại</span>
                </button>
                <h2 className="text-2xl font-bold text-gray-800">Chỉnh Sửa Bộ Từ Vựng</h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded-md shadow border border-gray-200">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Tiêu đề</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                </div>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Từ vựng</label>
                    {vocabularies.map((vocab, index) => (
                        <div key={index} className="border p-2 mb-2 rounded-md bg-gray-50">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="font-semibold text-gray-700">Từ {index + 1}</h4>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveVocabulary(index)}
                                    className="text-red-500 hover:text-red-600 transition flex items-center space-x-1"
                                >
                                    <FaTrash /><span>Xóa</span>
                                </button>
                            </div>
                            <input
                                type="text"
                                placeholder="Từ"
                                value={vocab.word}
                                onChange={(e) => handleVocabularyChange(index, 'word', e.target.value)}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2 mb-2"
                            />
                            <input
                                type="text"
                                placeholder="Định nghĩa"
                                value={vocab.definition}
                                onChange={(e) => handleVocabularyChange(index, 'definition', e.target.value)}
                                required
                                className="block w-full border border-gray-300 rounded-md p-2 mb-2"
                            />
                            <input
                                type="text"
                                placeholder="Ví dụ"
                                value={vocab.example}
                                onChange={(e) => handleVocabularyChange(index, 'example', e.target.value)}
                                required
                                className="block w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={handleAddVocabulary}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition flex items-center space-x-1 mt-2"
                    >
                        <FaPlus /><span>Thêm Từ Vựng</span>
                    </button>
                </div>
                <button
                    type="submit"
                    className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition flex items-center justify-center space-x-2"
                >
                    <FaSave /><span>Cập nhật Bộ Từ Vựng</span>
                </button>
            </form>
        </div>
    );
};

export default EditVocabularySet;
