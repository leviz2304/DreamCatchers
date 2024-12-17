// src/components/Sentences/SentenceEdit.jsx

import React, { useState, useEffect } from 'react';
import * as dataApi from '../../api/apiService/dataService';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

const SentenceEdit = () => {
    const { id } = useParams();
    const [text, setText] = useState('');
    const [topicId, setTopicId] = useState('');
    const [topics, setTopics] = useState([]);
    const [audioFile, setAudioFile] = useState(null);
    const [currentAudioUrl, setCurrentAudioUrl] = useState('');
    const navigate = useNavigate();

    const fetchTopics = async () => {
        try {
            const res = await dataApi.getPronunciationTopic();
            setTopics(res);
        } catch (error) {
            toast.error("Không thể tải danh sách chủ đề");
        }
    };

    const fetchSentence = async () => {
        try {
            const res = await dataApi.getSentenceById(id);
            setText(res.text);
            setTopicId(res.topicId);
            setCurrentAudioUrl(res.audioUrl);
        } catch (error) {
            toast.error("Không thể tải câu");
        }
    };

    useEffect(() => {
        fetchTopics();
        fetchSentence();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text.trim() || !topicId) {
            toast.error("Vui lòng nhập đầy đủ thông tin");
            return;
        }
        try {
            // First, update the sentence
            await dataApi.updateSentence(id, { text, topicId });

            // If a new audio file is selected, upload it
            if (audioFile) {
                await dataApi.uploadSentenceAudio(id, audioFile);
            }

            toast.success("Cập nhật câu thành công");
            navigate('/admin/sentences/list');
        } catch (error) {
            toast.error("Cập nhật câu thất bại");
        }
    };

    return (
        <div className="max-w-md mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Chỉnh sửa Câu</h2>
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
                    {currentAudioUrl && (
                        <div className="mb-2">
                            <audio controls src={currentAudioUrl}></audio>
                        </div>
                    )}
                    <input
                        type="file"
                        accept="audio/*"
                        onChange={(e) => setAudioFile(e.target.files[0])}
                        className="w-full mt-1 p-2 border rounded"
                    />
                </div>
                <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                    Cập nhật
                </button>
            </form>
        </div>
    );
};

export default SentenceEdit;
