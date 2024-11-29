import React, { useState, useEffect } from "react";
import { submitEssay, getAllWritingTasks } from "../../../api/apiService/dataService";

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
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md mt-6">
            <h1 className="text-2xl font-semibold mb-4">IELTS Writing Submission</h1>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                    Select Writing Task:
                </label>
                <select
                    value={selectedTaskId || ""}
                    onChange={(e) => setSelectedTaskId(parseInt(e.target.value))}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                    {writingTasks.map((task) => (
                        <option key={task.id} value={task.id}>
                            {task.title}
                        </option>
                    ))}
                </select>
            </div>
            {selectedTaskId && (
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                        Prompt:
                    </label>
                    <p className="mt-1 text-gray-700">
                        {writingTasks.find((task) => task.id === selectedTaskId)?.prompt}
                    </p>
                </div>
            )}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                    Write your essay:
                </label>
                <textarea
                    rows="10"
                    value={essayContent}
                    onChange={(e) => setEssayContent(e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Start writing here..."
                ></textarea>
                <p className="mt-2 text-sm text-gray-500">
                    Word Count: {essayContent.trim() ? essayContent.trim().split(/\s+/).length : 0}
                </p>
            </div>
            <div className="flex items-center space-x-4">
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`px-4 py-2 bg-indigo-600 text-white font-medium rounded-md ${
                        loading ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-700"
                    }`}
                >
                    {loading ? "Submitting..." : "Submit"}
                </button>
                <button
                    onClick={() => setEssayContent("")}
                    className="px-4 py-2 bg-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-400"
                >
                    Clear
                </button>
            </div>
            {feedback && (
                <div className="mt-6 p-6 border border-gray-300 rounded-md bg-gray-50">
                    <h2 className="text-2xl font-bold mb-4">AI Feedback</h2>

                    {/* Grammar Errors */}
                    {feedback.grammarErrors && feedback.grammarErrors.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-xl font-semibold mb-2">Grammatical Errors</h3>
                            {feedback.grammarErrors.map((error, index) => (
                                <div key={index} className="mb-4 pl-4 border-l-2 border-red-500">
                                    <p className="text-md font-medium">
                                        <span className="font-bold">Sentence:</span> {error.sentence}
                                    </p>
                                    <p className="text-sm">
                                        <span className="font-semibold">Error:</span> {error.error}
                                    </p>
                                    <p className="text-sm">
                                        <span className="font-semibold">Recommendation:</span> {error.recommendation}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Vocabulary Errors */}
                    {feedback.vocabularyErrors && feedback.vocabularyErrors.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-xl font-semibold mb-2">Vocabulary Errors</h3>
                            {feedback.vocabularyErrors.map((error, index) => (
                                <div key={index} className="mb-4 pl-4 border-l-2 border-yellow-500">
                                    <p className="text-md font-medium">
                                        <span className="font-bold">Word:</span> {error.word}
                                    </p>
                                    <p className="text-sm">
                                        <span className="font-semibold">Error:</span> {error.error}
                                    </p>
                                    <p className="text-sm">
                                        <span className="font-semibold">Recommendation:</span> {error.recommendation}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Overall Feedback */}
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-2">Overall Feedback</h3>
                        <p className="text-sm pl-4 border-l-2 border-blue-500">
                            {feedback.overallFeedback}
                        </p>
                    </div>

                    {/* Overall Score */}
                    <div>
                        <h3 className="text-xl font-semibold mb-2">Overall Score</h3>
                        <p className="text-lg font-bold pl-4 border-l-2 border-green-500">
                            {feedback.overallScore}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
