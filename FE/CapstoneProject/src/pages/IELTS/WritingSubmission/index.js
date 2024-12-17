// src/components/WritingSubmission.jsx

import React, { useState, useEffect } from "react";
import { submitEssay, getAllWritingTasks } from "../../../api/apiService/dataService";
import { FaSpinner } from "react-icons/fa"; // Biểu tượng loading

export default function WritingSubmission() {
    const [writingTasks, setWritingTasks] = useState([]);
    const [selectedTaskId, setSelectedTaskId] = useState(null);
    const [essayContent, setEssayContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState(null);

    const userId = JSON.parse(sessionStorage.getItem("user"))?.id;

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const tasks = await getAllWritingTasks();
                setWritingTasks(tasks);

                if (tasks.length > 0) {
                    setSelectedTaskId(tasks[0].id);
                }
            } catch (error) {
                console.error("Error fetching writing tasks:", error);
            }
        };
        fetchTasks();
    }, []);

    const handleSubmit = async () => {
        if (!essayContent.trim()) {
            alert("Please write something before submitting!");
            return;
        }
        if (!selectedTaskId) {
            alert("Please select a writing task!");
            return;
        }
        setLoading(true);
        try {
            const response = await submitEssay({
                userId,
                writingTaskId: selectedTaskId,
                essayContent,
            });
            console.log("Submit Essay Response:", response); // Ghi log phản hồi từ backend
            if (response && response.content && response.content.feedbackJson) {
                const parsedFeedback = JSON.parse(response.content.feedbackJson);
                console.log(parsedFeedback);
                setFeedback(parsedFeedback);
            } else {
                throw new Error("Invalid response structure");
            }
        } catch (error) {
            console.error("Submission failed:", error);
            if (error && error.data && error.data.error && error.data.error.message) {
                alert(`Submission failed: ${error.data.error.message}`);
            } else if (error && error.message) {
                alert(`Submission failed: ${error.message}`);
            } else {
                alert("Submission failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 mt-16">
            <div className="w-full max-w-3xl bg-white shadow-md rounded-lg p-8">
                <h1 className="text-3xl font-bold text-indigo-600 mb-6 text-center">IELTS Writing Submission</h1>
                
                {/* Chọn Writing Task */}
                <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">
                        Select Writing Task:
                    </label>
                    <select
                        value={selectedTaskId || ""}
                        onChange={(e) => setSelectedTaskId(parseInt(e.target.value))}
                        className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        {writingTasks.map((task) => (
                            <option key={task.id} value={task.id}>
                                {task.title}
                            </option>
                        ))}
                    </select>
                </div>
                
                {/* Hiển thị Prompt */}
                {selectedTaskId && (
                    <div className="mb-6">
                        <label className="block text-gray-700 font-medium mb-2">
                            Prompt:
                        </label>
                        <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
                            <p className="text-gray-800">
                                {writingTasks.find((task) => task.id === selectedTaskId)?.prompt}
                            </p>
                        </div>
                    </div>
                )}
                
                {/* Ô nhập essay */}
                <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">
                        Write your essay:
                    </label>
                    <textarea
                        rows="10"
                        value={essayContent}
                        onChange={(e) => setEssayContent(e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                        placeholder="Start writing here..."
                    ></textarea>
                    <p className="mt-2 text-sm text-gray-500 text-right">
                        Word Count: {essayContent.trim() ? essayContent.trim().split(/\s+/).length : 0}
                    </p>
                </div>
                
                {/* Nút Submit và Clear */}
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={() => setEssayContent("")}
                        className="px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300 transition-colors"
                    >
                        Clear
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className={`px-6 py-2 bg-indigo-600 text-white font-medium rounded-md flex items-center justify-center hover:bg-indigo-700 transition-colors ${
                            loading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                    >
                        {loading ? <FaSpinner className="animate-spin mr-2" /> : null}
                        {loading ? "Submitting..." : "Submit"}
                    </button>
                </div>
                
                {/* Hiển thị phản hồi */}
                {feedback && (
                    <div className="mt-8 p-6 bg-gray-50 border border-gray-200 rounded-lg">
                        <h2 className="text-2xl font-bold text-indigo-600 mb-4">AI Feedback</h2>
    
                        {/* Phản hồi về Ngữ pháp */}
                        {feedback.grammarErrors && feedback.grammarErrors.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-xl font-semibold text-red-600 mb-2">Grammatical Errors</h3>
                                {feedback.grammarErrors.map((error, index) => (
                                    <div key={index} className="mb-4 pl-4 border-l-4 border-red-400">
                                        <p className="text-md font-medium text-gray-800">
                                            <span className="font-bold">Sentence:</span> {error.sentence}
                                        </p>
                                        <p className="text-sm text-gray-700">
                                            <span className="font-semibold">Error:</span> {error.error}
                                        </p>
                                        <p className="text-sm text-gray-700">
                                            <span className="font-semibold">Recommendation:</span> {error.recommendation}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
    
                        {/* Phản hồi về Từ vựng */}
                        {feedback.vocabularyErrors && feedback.vocabularyErrors.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-xl font-semibold text-yellow-600 mb-2">Vocabulary Errors</h3>
                                {feedback.vocabularyErrors.map((error, index) => (
                                    <div key={index} className="mb-4 pl-4 border-l-4 border-yellow-400">
                                        <p className="text-md font-medium text-gray-800">
                                            <span className="font-bold">Word:</span> {error.word}
                                        </p>
                                        <p className="text-sm text-gray-700">
                                            <span className="font-semibold">Error:</span> {error.error}
                                        </p>
                                        <p className="text-sm text-gray-700">
                                            <span className="font-semibold">Recommendation:</span> {error.recommendation}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
    
                        {/* Phản hồi tổng quan */}
                        <div className="mb-6">
                            <h3 className="text-xl font-semibold text-blue-600 mb-2">Overall Feedback</h3>
                            <p className="text-sm text-gray-700 pl-4 border-l-4 border-blue-400">
                                {feedback.overallFeedback}
                            </p>
                        </div>
    
                        {/* Điểm tổng quan */}
                        <div>
                            <h3 className="text-xl font-semibold text-green-600 mb-2">Overall Score</h3>
                            <p className="text-lg font-bold text-gray-800 pl-4 border-l-4 border-green-400">
                                {feedback.overallScore}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
