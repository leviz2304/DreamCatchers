// src/components/Topics/TopicList.jsx
import React, { useEffect, useState } from 'react';
import { getPronunciationTopic, deleteTopic } from '../../api/apiService/dataService';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const TopicList = () => {
    const [topics, setTopics] = useState([]);

    const fetchTopics = async () => {
        try {
            const res = await getPronunciationTopic(); // Sử dụng hàm phù hợp từ apiService
            setTopics(res);
        } catch (error) {
            toast.error("Không thể tải danh sách chủ đề");
        }
    };

    useEffect(() => {
        fetchTopics();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa chủ đề này?")) {
            try {
                await deleteTopic(id);
                toast.success("Xóa chủ đề thành công");
                fetchTopics();
            } catch (error) {
                toast.error("Xóa chủ đề thất bại");
            }
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Quản lý Chủ đề</h2>
                <Link to="/admin/topics/create" className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
                    Thêm Chủ đề
                </Link>
            </div>
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">ID</th>
                        <th className="py-2 px-4 border-b">Tên Chủ đề</th>
                        <th className="py-2 px-4 border-b">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {topics.map(topic => (
                        <tr key={topic.id}>
                            <td className="py-2 px-4 border-b text-center">{topic.id}</td>
                            <td className="py-2 px-4 border-b">{topic.name}</td>
                            <td className="py-2 px-4 border-b text-center">
                                <Link to={`/admin/topics/edit/${topic.id}`} className="text-blue-500 hover:underline mr-2">
                                    Chỉnh sửa
                                </Link>
                                <button onClick={() => handleDelete(topic.id)} className="text-red-500 hover:underline">
                                    Xóa
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TopicList;
