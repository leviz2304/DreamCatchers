// src/components/Topics/TopicCreate.jsx
import React, { useState } from 'react';
import { createPronunciationTopic } from '../../api/apiService/dataService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const TopicCreate = () => {
    const [name, setName] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error("Tên chủ đề không được để trống");
            return;
        }
        try {
            await createPronunciationTopic({ name });
            toast.success("Tạo chủ đề thành công");
            navigate('/admin/topics/list');
        } catch (error) {
            toast.error("Tạo chủ đề thất bại");
        }
    };

    return (
        <div className="max-w-md mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Thêm Chủ đề</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700">Tên Chủ đề</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full mt-1 p-2 border rounded"
                        placeholder="Nhập tên chủ đề"
                    />
                </div>
                <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                    Tạo
                </button>
            </form>
        </div>
    );
};

export default TopicCreate;
