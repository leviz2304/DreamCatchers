// src/components/Topics/TopicEdit.jsx
import React, { useEffect, useState } from 'react';
import { getPronunciationTopicById, updatePronunciationTopic } from '../../api/apiService/dataService';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const TopicEdit = () => {
    const { id } = useParams();
    const [name, setName] = useState('');
    const navigate = useNavigate();

    const fetchTopic = async () => {
        try {
            const res = await getPronunciationTopicById(id); // Sử dụng hàm phù hợp từ apiService
            setName(res.name);
        } catch (error) {
            toast.error("Không thể tải thông tin chủ đề");
        }
    };

    useEffect(() => {
        fetchTopic();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error("Tên chủ đề không được để trống");
            return;
        }
        try {
            await updatePronunciationTopic(id, { name });
            toast.success("Cập nhật chủ đề thành công");
            navigate('/admin/category/list');
        } catch (error) {
            toast.error("Cập nhật chủ đề thất bại");
        }
    };

    return (
        <div className="max-w-md mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Chỉnh sửa Chủ đề</h2>
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
                    Cập nhật
                </button>
            </form>
        </div>
    );
};

export default TopicEdit;
