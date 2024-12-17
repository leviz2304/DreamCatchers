// src/components/PronunciationPracticePage.jsx

import React, { useEffect, useState, useRef } from 'react';
import * as dataApi from '../../api/apiService/dataService';
import { toast } from 'sonner';
import { FaMicrophone, FaStop, FaPlay, FaChevronLeft } from 'react-icons/fa';
import { motion } from 'framer-motion';

const PronunciationPracticePage = () => {
    const [topics, setTopics] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userId, setUserId] = useState(null);
    const [feedback, setFeedback] = useState(null);
    const [incorrectWords, setIncorrectWords] = useState([]);

    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const [mediaBlobUrl, setMediaBlobUrl] = useState(null);

    const [isPassed, setIsPassed] = useState(false);

    const recorderRef = useRef(null);
    const streamRef = useRef(null);

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const res = await dataApi.getPronunciationTopic();
                setTopics(res);
            } catch (error) {
                toast.error("Không thể tải danh sách chủ đề");
            }
        };
        fetchTopics();

        const storedUser = JSON.parse(sessionStorage.getItem("user"));
        if (storedUser && storedUser.id) {
            setUserId(storedUser.id);
        }
    }, []);

    useEffect(() => {
        if (selectedTopic) {
            const fetchQuestions = async () => {
                try {
                    const res = await dataApi.getSentenceByTopicId(selectedTopic.id);
                    setQuestions(res);
                    setCurrentIndex(0);
                } catch (error) {
                    toast.error("Không thể tải danh sách câu hỏi");
                }
            };
            fetchQuestions();
        }
    }, [selectedTopic]);

    const startRecording = async () => {
        try {
            const constraints = { audio: true };
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            streamRef.current = stream;

            const mediaRecorder = new MediaRecorder(stream);
            recorderRef.current = mediaRecorder;

            let chunks = [];
            mediaRecorder.ondataavailable = event => chunks.push(event.data);

            mediaRecorder.onstop = async () => {
                const blob = new Blob(chunks, { type: 'audio/webm' });
                const arrayBuffer = await blob.arrayBuffer();
                const audioContext = new AudioContext({ sampleRate: 16000 });
                const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

                const wavBlob = bufferToWav(audioBuffer);
                setAudioBlob(wavBlob);
                setMediaBlobUrl(URL.createObjectURL(wavBlob));
                toast.success("Ghi âm đã dừng");
            };

            mediaRecorder.start();
            setIsRecording(true);
            toast.success("Đang ghi âm...");
        } catch (error) {
            console.error("Không thể bắt đầu ghi âm:", error);
            toast.error("Không thể bắt đầu ghi âm");
        }
    };

    const stopRecording = () => {
        if (recorderRef.current) {
            recorderRef.current.stop();
            setIsRecording(false);
        }

        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
    };

    const handleSubmit = async () => {
        if (!audioBlob) {
            toast.error("Bạn chưa ghi âm");
            return;
        }

        const currentQuestion = questions[currentIndex];
        if (!currentQuestion) {
            toast.error("Không tìm thấy câu hỏi hiện tại");
            return;
        }

        const audioFile = new File([audioBlob], "audio.wav", { type: 'audio/wav' });

        try {
            const response = await dataApi.analyzePronunciation({
                file: audioFile,
                userId: userId,
                sentenceId: currentQuestion.id,
            });

            const { overallPronunciationScore, feedback: apiFeedback, incorrectWords: apiIncorrectWords } = response;

            // Parse the JSON string into an object
            const parsedFeedback = JSON.parse(apiFeedback);

            setFeedback(parsedFeedback);
            setIncorrectWords(apiIncorrectWords || []);

            if (overallPronunciationScore >= 80) {
                toast.success("Phát âm tốt!");
                setIsPassed(true);
                setAudioBlob(null);
                setMediaBlobUrl(null);
            } else {
                toast.error("Phát âm cần cải thiện! Hãy thử lại.");
                setIsPassed(false);
                setAudioBlob(null);
                setMediaBlobUrl(null);
            }
        } catch (error) {
            console.error("Phân tích phát âm thất bại:", error);
            toast.error("Không thể phân tích phát âm");
        }
    };

    const currentQuestion = questions[currentIndex];

    const accuracyScore = feedback?.NBest?.[0]?.PronunciationAssessment?.AccuracyScore;
    const isAccuracyLow = accuracyScore !== undefined && accuracyScore < 80;

    const handleNext = () => {
        setCurrentIndex(prev => prev + 1);
        setFeedback(null);
        setIncorrectWords([]);
        setIsPassed(false);
        setAudioBlob(null);
        setMediaBlobUrl(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-200 p-6 flex flex-col items-center mt-12">
            <h1 className="text-4xl font-bold mb-8 text-center text-green-800">Luyện Phát Âm</h1>

            {!selectedTopic ? (
                <div className="w-full max-w-4xl">
                    <h2 className="text-2xl mb-4 text-green-700">Chọn Chủ đề</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {topics.map(topic => (
                            <motion.button
                                key={topic.id}
                                onClick={() => setSelectedTopic(topic)}
                                className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center justify-center hover:bg-green-50 transition"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <div className="mb-4">
                                    <svg className="w-12 h-12 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM7 9a1 1 0 012 0v3a1 1 0 11-2 0v-3zm5 0a1 1 0 112 0v3a1 1 0 11-2 0v-3z" />
                                    </svg>
                                </div>
                                <span className="text-lg font-medium text-gray-800">{topic.name}</span>
                            </motion.button>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="w-full max-w-2xl bg-white shadow-xl rounded-lg p-8">
                    <div className="flex justify-between items-center mb-6">
                        <button
                            onClick={() => setSelectedTopic(null)}
                            className="text-red-500 hover:text-red-700 transition flex items-center"
                        >
                            <FaChevronLeft className="mr-2" /> Quay lại
                        </button>
                        <div className="text-sm text-gray-600">
                            {currentIndex + 1} / {questions.length}
                        </div>
                    </div>

                    {currentQuestion ? (
                        <>
                            <div className="mb-6">
                                <h3 className="text-xl font-semibold text-green-700">Câu: {currentQuestion.text}</h3>
                                {/* Audio Playback */}
                                {currentQuestion.audioUrl && (
                                    <div className="mt-4">
                                        <audio controls src={currentQuestion.audioUrl} className="w-full">
                                            Your browser does not support the audio element.
                                        </audio>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col items-center mb-6">
                                {!isRecording ? (
                                    <button
                                        onClick={startRecording}
                                        className="flex items-center bg-green-500 text-white px-4 py-2 rounded-full shadow-md hover:bg-green-600 transition"
                                    >
                                        <FaMicrophone className="mr-2" /> Bắt đầu Ghi âm
                                    </button>
                                ) : (
                                    <button
                                        onClick={stopRecording}
                                        className="flex items-center bg-red-500 text-white px-4 py-2 rounded-full shadow-md hover:bg-red-600 transition"
                                    >
                                        <FaStop className="mr-2" /> Dừng Ghi âm
                                    </button>
                                )}
                            </div>

                            {audioBlob && (
                                <div className="flex flex-col items-center mb-6">
                                    <audio controls src={mediaBlobUrl} className="mb-4"></audio>
                                    <button
                                        onClick={handleSubmit}
                                        className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-full shadow-md hover:bg-blue-600 transition"
                                    >
                                        <FaPlay className="mr-2" /> Gửi Phát âm
                                    </button>
                                </div>
                            )}

                            {feedback && (
                                <div className="mt-6 p-4 bg-green-100 border border-green-300 rounded-lg w-full">
                                    <h4 className="text-lg font-semibold text-green-700 mb-2">Phản hồi của bạn:</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <StatCard
                                            title="Điểm Chính xác"
                                            value={accuracyScore ?? 'N/A'}
                                            color={isAccuracyLow ? 'text-red-500' : 'text-green-700'}
                                        />
                                        <StatCard
                                            title="Điểm Trôi chảy"
                                            value={feedback?.NBest?.[0]?.PronunciationAssessment?.FluencyScore ?? 'N/A'}
                                        />
                                        <StatCard
                                            title="Điểm Đầy đủ"
                                            value={feedback?.NBest?.[0]?.PronunciationAssessment?.CompletenessScore ?? 'N/A'}
                                        />
                                        <StatCard
                                            title="Điểm Tổng thể"
                                            value={feedback?.NBest?.[0]?.PronunciationAssessment?.PronScore ?? 'N/A'}
                                        />
                                    </div>
                                    {/* Display mispronounced words */}
                                    {incorrectWords.length > 0 && (
                                        <div className="mt-4">
                                            <h5 className="text-md font-medium text-red-600">Từ cần cải thiện:</h5>
                                            <ul className="list-disc list-inside text-red-500">
                                                {incorrectWords.map((word, index) => (
                                                    <li key={index}>{word}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {/* Conditional Message for Low Accuracy */}
                                    {isAccuracyLow && (
                                        <div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">
                                            Điểm chính xác dưới 80. Vui lòng thử lại để cải thiện phát âm.
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="mt-6 flex justify-between">
                                <button
                                    onClick={() => setCurrentIndex(prev => Math.max(prev - 1, 0))}
                                    className={`text-yellow-500 hover:text-yellow-700 transition flex items-center ${
                                        currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                    disabled={currentIndex === 0}
                                >
                                    <FaChevronLeft className="mr-2" /> Quay lại
                                </button>
                                <button
                                    onClick={handleNext}
                                    className={`text-green-500 hover:text-green-700 transition flex items-center ${!isPassed ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={!isPassed}
                                >
                                    Tiếp theo <FaChevronLeft className="ml-2 transform rotate-180" />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="text-center text-gray-600">Bạn đã hoàn thành tất cả các câu trong chủ đề này!</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PronunciationPracticePage;

/** Helper function: Converts audio buffer to WAV file */
function bufferToWav(audioBuffer) {
    const numOfChannels = audioBuffer.numberOfChannels;
    const sampleRate = 16000; // Fixed sample rate
    const format = 1; // PCM
    const bitDepth = 16;

    const buffer = new ArrayBuffer(44 + audioBuffer.length * numOfChannels * 2);
    const view = new DataView(buffer);

    /* RIFF identifier */
    writeString(view, 0, 'RIFF');
    /* file length */
    view.setUint32(4, 36 + audioBuffer.length * numOfChannels * 2, true);
    /* RIFF type */
    writeString(view, 8, 'WAVE');
    /* format chunk identifier */
    writeString(view, 12, 'fmt ');
    /* format chunk length */
    view.setUint32(16, 16, true);
    /* sample format (raw) */
    view.setUint16(20, format, true);
    /* channel count */
    view.setUint16(22, numOfChannels, true);
    /* sample rate */
    view.setUint32(24, sampleRate, true);
    /* byte rate (sample rate * block align) */
    view.setUint32(28, sampleRate * numOfChannels * bitDepth / 8, true);
    /* block align (channel count * bytes per sample) */
    view.setUint16(32, numOfChannels * bitDepth / 8, true);
    /* bits per sample */
    view.setUint16(34, bitDepth, true);
    /* data chunk identifier */
    writeString(view, 36, 'data');
    /* data chunk length */
    view.setUint32(40, audioBuffer.length * numOfChannels * bitDepth / 8, true);

    // Write interleaved data
    let offset = 44;
    for (let i = 0; i < audioBuffer.length; i++) {
        for (let channel = 0; channel < numOfChannels; channel++) {
            let sample = audioBuffer.getChannelData(channel)[i];
            // Clipping
            sample = Math.max(-1, Math.min(1, sample));
            // Scale to 16-bit integer
            sample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
            view.setInt16(offset, sample, true);
            offset += 2;
        }
    }

    return new Blob([view], { type: 'audio/wav' });
}

function writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}

const StatCard = ({ title, value, color }) => (
    <div className="bg-white shadow-md rounded-lg p-4 w-full">
        <h5 className="text-sm text-gray-500">{title}</h5>
        <p className={`text-2xl font-semibold ${color || 'text-green-700'}`}>{value}</p>
    </div>
);
