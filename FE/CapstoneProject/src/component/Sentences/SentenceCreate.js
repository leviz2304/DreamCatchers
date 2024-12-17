// src/components/Sentences/SentenceCreate.jsx

import React, { useState, useEffect } from 'react';
import * as dataApi from '../../api/apiService/dataService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const SentenceCreate = () => {
    const [text, setText] = useState('');
    const [topicId, setTopicId] = useState('');
    const [topics, setTopics] = useState([]);
    const [audioFile, setAudioFile] = useState(null); // New state for audio file
    const navigate = useNavigate();

    const fetchTopics = async () => {
        try {
            const res = await dataApi.getPronunciationTopic();
            setTopics(res);
        } catch (error) {
            toast.error("Không thể tải danh sách chủ đề");
        }
    };

    useEffect(() => {
        fetchTopics();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text.trim() || !topicId) {
            toast.error("Vui lòng nhập đầy đủ thông tin");
            return;
        }
        try {
            // First, create the sentence
            const createdSentence = await dataApi.createSentence({ text, topicId });

            // If an audio file is selected, upload it
            if (audioFile) {
                await dataApi.uploadSentenceAudio(createdSentence.id, audioFile);
            }

            toast.success("Tạo câu thành công");
            navigate('/admin/sentences/list');
        } catch (error) {
            toast.error("Tạo câu thất bại");
        }
    };

    return (
        <div className="max-w-md mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Thêm Câu</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700">Chủ đề</label>
                    <select
                        value={topicId}
                        onChange={(e) => setTopicId(e.target.value)}
                        className="w-full mt-1 p-2 border rounded"
                    >
                        <option value="">-- Chọn Chủ đề --</option>
                        {topics.map(topic => (
                            <option key={topic.id} value={topic.id}>{topic.name}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Câu</label>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="w-full mt-1 p-2 border rounded"
                        placeholder="Nhập câu"
                        rows="4"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Tải lên Audio Phát âm</label>
                    <input
                        type="file"
                        accept="audio/*"
                        onChange={(e) => setAudioFile(e.target.files[0])}
                        className="w-full mt-1 p-2 border rounded"
                    />
                </div>
                <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                    Tạo
                </button>
            </form>
        </div>
    );
};

export default SentenceCreate;
