import React, { useState, useEffect } from "react";
import { submitEssay, getAllWritingTasks } from "../../../api/apiService/dataService";
import {
    FaSpinner,
    FaExclamationTriangle,
    FaCheckCircle,
    FaLightbulb,
    FaBookOpen,
    FaPenFancy,
    FaListAlt,
    FaPaperPlane
} from "react-icons/fa";

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
            if (response && response.content && response.content.feedbackJson) {
                const parsedFeedback = JSON.parse(response.content.feedbackJson);
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

    const wordCount = essayContent.trim() ? essayContent.trim().split(/\s+/).length : 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex flex-col items-center p-8">
            <div className="max-w-3xl w-full">
                {/* Header */}
                <h1 className="text-4xl font-extrabold text-indigo-700 mb-4 flex items-center justify-center">
                    <FaPenFancy className="mr-3 text-indigo-600" /> IELTS Writing Submission
                </h1>
                <p className="text-gray-600 text-center mb-10">
                    Follow these steps: 
                    <span className="font-semibold text-indigo-600"> 1. Select a Task</span>, 
                    <span className="font-semibold text-indigo-600"> 2. Write Your Essay</span>, 
                    <span className="font-semibold text-indigo-600"> 3. Submit</span>, 
                    <span className="font-semibold text-indigo-600"> 4. Review Feedback</span>.
                </p>

                <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
                    {/* Select Writing Task */}
                    <div className="mb-6">
                        <label className="block text-gray-800 font-semibold mb-2">Select Writing Task:</label>
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

                    {/* Prompt Display */}
                    {selectedTaskId && (
                        <div className="mb-8">
                            <label className="block text-gray-800 font-semibold mb-2">Prompt:</label>
                            <div className="p-4 bg-gray-50 border border-gray-200 rounded-md text-gray-700 flex items-start">
                                <FaListAlt className="text-indigo-400 text-2xl mr-3 mt-1" />
                                <p>{writingTasks.find((task) => task.id === selectedTaskId)?.prompt}</p>
                            </div>
                        </div>
                    )}

                    {/* Essay Input */}
                    <div className="mb-6">
                        <label className="block text-gray-800 font-semibold mb-2">Write your essay:</label>
                        <textarea
                            rows="10"
                            value={essayContent}
                            onChange={(e) => setEssayContent(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-gray-700"
                            placeholder="Start writing your essay here..."
                        ></textarea>
                        <p className="mt-2 text-sm text-gray-500 text-right">
                            Word Count: {wordCount}
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end space-x-4">
                        <button
                            onClick={() => setEssayContent("")}
                            className="px-6 py-2 bg-gray-100 text-gray-700 font-medium rounded-md hover:bg-gray-200 transition-colors"
                        >
                            Clear
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className={`px-6 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-medium rounded-md flex items-center justify-center hover:from-indigo-600 hover:to-indigo-700 transition-colors ${
                                loading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        >
                            {loading ? <FaSpinner className="animate-spin mr-2" /> : <FaPaperPlane className="mr-2" />}
                            {loading ? "Submitting..." : "Submit"}
                        </button>
                    </div>
                </div>

                {/* Feedback Section */}
                {feedback && (
                    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-md mb-8">
                        <h2 className="text-2xl font-bold text-indigo-600 mb-6 flex items-center">
                            <FaLightbulb className="mr-2 text-indigo-500" /> AI Feedback
                        </h2>

                        {/* Overall Feedback & Score */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="bg-blue-50 p-4 rounded-md shadow border-l-4 border-blue-400">
                                <h3 className="text-xl font-semibold text-blue-600 mb-2 flex items-center">
                                    <FaLightbulb className="mr-2 text-blue-500" /> Overall Feedback
                                </h3>
                                <p className="text-gray-700 text-sm">
                                    {feedback.overallFeedback}
                                </p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-md shadow border-l-4 border-green-400 flex items-center">
                                <FaCheckCircle className="text-green-600 text-2xl mr-4" />
                                <div>
                                    <h3 className="text-xl font-semibold text-green-600 mb-1">Overall Score</h3>
                                    <p className="text-lg font-bold text-gray-800">{feedback.overallScore}</p>
                                </div>
                            </div>
                        </div>

                        {/* Grammar Errors */}
                        {feedback.grammarErrors && feedback.grammarErrors.length > 0 && (
                            <div className="mb-8">
                                <div className="flex items-center mb-4">
                                    <FaExclamationTriangle className="text-red-500 text-xl mr-2" />
                                    <h3 className="text-xl font-semibold text-red-600">
                                        Grammatical Errors ({feedback.grammarErrors.length})
                                    </h3>
                                </div>
                                <div className="space-y-4">
                                    {feedback.grammarErrors.map((error, index) => (
                                        <div key={index} className="p-4 bg-white rounded-md shadow border-l-4 border-red-300">
                                            <p className="text-md font-medium text-gray-800 mb-2">
                                                <span className="font-bold text-red-700">Sentence:</span> {error.sentence}
                                            </p>
                                            <div className="text-sm text-gray-700 mb-2 flex items-start">
                                                <FaExclamationTriangle className="text-red-500 mt-1 mr-2" />
                                                <span><strong>Error:</strong> {error.error}</span>
                                            </div>
                                            <div className="text-sm text-gray-700 flex items-start">
                                                <FaLightbulb className="text-yellow-500 mt-1 mr-2" />
                                                <span><strong>Recommendation:</strong> {error.recommendation}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Vocabulary Errors */}
                        {feedback.vocabularyErrors && feedback.vocabularyErrors.length > 0 && (
                            <div className="mb-8">
                                <div className="flex items-center mb-4">
                                    <FaBookOpen className="text-yellow-500 text-xl mr-2" />
                                    <h3 className="text-xl font-semibold text-yellow-600">
                                        Vocabulary Suggestions ({feedback.vocabularyErrors.length})
                                    </h3>
                                </div>
                                <div className="space-y-4">
                                    {feedback.vocabularyErrors.map((error, index) => (
                                        <div key={index} className="p-4 bg-white rounded-md shadow border-l-4 border-yellow-300">
                                            <p className="text-md font-medium text-gray-800 mb-2">
                                                <span className="font-bold text-yellow-700">Word/Phrase:</span> {error.word}
                                            </p>
                                            <div className="text-sm text-gray-700 mb-2 flex items-start">
                                                <FaExclamationTriangle className="text-red-500 mt-1 mr-2" />
                                                <span><strong>Issue:</strong> {error.error}</span>
                                            </div>
                                            <div className="text-sm text-gray-700 flex items-start">
                                                <FaLightbulb className="text-yellow-500 mt-1 mr-2" />
                                                <span><strong>Recommendation:</strong> {error.recommendation}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
