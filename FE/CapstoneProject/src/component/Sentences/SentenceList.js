// src/components/Sentences/SentenceList.jsx
import React, { useEffect, useState } from 'react';
import * as dataApi from '../../api/apiService/dataService';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const SentenceList = () => {
    const [sentences, setSentences] = useState([]);
    const [topics, setTopics] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState('');

    const fetchTopics = async () => {
        try {
            const res = await dataApi.getPronunciationTopic();
            setTopics(res);
        } catch (error) {
            toast.error("Không thể tải danh sách chủ đề");
        }
    };

    const fetchSentences = async (topicId) => {
        try {
            const res = await dataApi.getSentenceByTopicId(topicId); // Sử dụng hàm phù hợp
            setSentences(res); // Điều chỉnh theo phản hồi API
        } catch (error) {
            toast.error("Không thể tải danh sách câu");
        }
    };

    useEffect(() => {
        fetchTopics();
    }, []);

    useEffect(() => {
        if (selectedTopic) {
            fetchSentences(selectedTopic);
        }
    }, [selectedTopic]);

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa câu này?")) {
            try {
                await dataApi.deleteSentence(id);
                toast.success("Xóa câu thành công");
                fetchSentences(selectedTopic);
            } catch (error) {
                toast.error("Xóa câu thất bại");
            }
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Quản lý Câu</h2>
                <Link to="/admin/sentences/create" className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
                    Thêm Câu
                </Link>
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Chọn Chủ đề</label>
                <select
                    value={selectedTopic}
                    onChange={(e) => setSelectedTopic(e.target.value)}
                    className="w-full mt-1 p-2 border rounded"
                >
                    <option value="">-- Chọn Chủ đề --</option>
                    {topics.map(topic => (
                        <option key={topic.id} value={topic.id}>{topic.name}</option>
                    ))}
                </select>
            </div>
            {selectedTopic && (
                <table className="min-w-full bg-white">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b">ID</th>
                            <th className="py-2 px-4 border-b">Câu</th>
                            <th className="py-2 px-4 border-b">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sentences.map(sentence => (
                            <tr key={sentence.id}>
                                <td className="py-2 px-4 border-b text-center">{sentence.id}</td>
                                <td className="py-2 px-4 border-b">{sentence.text}</td>
                                <td className="py-2 px-4 border-b text-center">
                                    <Link to={`/admin/sentences/edit/${sentence.id}`} className="text-blue-500 hover:underline mr-2">
                                        Chỉnh sửa
                                    </Link>
                                    <button onClick={() => handleDelete(sentence.id)} className="text-red-500 hover:underline">
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default SentenceList;
