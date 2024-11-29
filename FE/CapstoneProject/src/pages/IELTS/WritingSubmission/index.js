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
            setFeedback(response.content);
        } catch (error) {
            console.error("Submission failed:", error);
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
                <div className="mt-6 p-4 border border-gray-300 rounded-md bg-gray-50">
                    <h2 className="text-lg font-semibold">AI Feedback</h2>
                    <p className="text-gray-700 mt-2">{feedback.feedback}</p>
                    <p className="text-gray-800 font-bold">Score: {feedback.score}</p>
                </div>
            )}
        </div>
    );
}
