// src/components/EditVocabularySet.js
import React, { useEffect, useState } from 'react';
import { getVocabularySetById, updateVocabularySet } from '../../../api/apiService/dataService';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

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
            navigate('/sets');
        } catch (err) {
            toast.error(err.message || 'Error updating set');
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
            <h2 className="text-2xl font-bold mb-4">Chỉnh Sửa Bộ Từ Vựng</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">Tiêu đề</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Chủ đề</label>
                    <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Mức độ</label>
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
                    <label className="block text-sm font-medium">Số lượng từ</label>
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
                    <label className="block text-sm font-medium">Từ vựng</label>
                    {vocabularies.map((vocab, index) => (
                        <div key={index} className="border p-2 mb-2 rounded-md">
                            <div className="flex justify-between items-center">
                                <h4 className="font-semibold">Từ {index + 1}</h4>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveVocabulary(index)}
                                    className="text-red-500"
                                >
                                    Xóa
                                </button>
                            </div>
                            <input
                                type="text"
                                placeholder="Từ"
                                value={vocab.word}
                                onChange={(e) => handleVocabularyChange(index, 'word', e.target.value)}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            />
                            <input
                                type="text"
                                placeholder="Định nghĩa"
                                value={vocab.definition}
                                onChange={(e) => handleVocabularyChange(index, 'definition', e.target.value)}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            />
                            <input
                                type="text"
                                placeholder="Ví dụ"
                                value={vocab.example}
                                onChange={(e) => handleVocabularyChange(index, 'example', e.target.value)}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={handleAddVocabulary}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md"
                    >
                        Thêm Từ Vựng
                    </button>
                </div>
                <button
                    type="submit"
                    className="w-full bg-green-500 text-white py-2 rounded-md"
                >
                    Cập nhật Bộ Từ Vựng
                </button>
            </form>
        </div>
    );
};

export default EditVocabularySet;
