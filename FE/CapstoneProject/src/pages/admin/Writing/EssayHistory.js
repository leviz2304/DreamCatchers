// src/components/WritingSubmission/EssayHistory.js

import React, { useState, useEffect } from "react";
import { getEssayHistory } from "../../../api/apiService/dataService";
import { Link } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner"; // Assuming you have this component
import Alert from "./Alert"; // Assuming you have this component
import { useSelector } from "react-redux";

export default function EssayHistory() {
    const [essays, setEssays] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [size] = useState(10); // Number of essays per page
    const [hasMore, setHasMore] = useState(false);
    const userInfo = useSelector((user) => user.login.user);

    useEffect(() => {
        const fetchEssayHistory = async () => {
            setLoading(true);
            setError(null);
            try {
                const userId=userInfo.id;
                const data = await getEssayHistory(page, size,userId);
                setEssays((prevEssays) => [...prevEssays, ...data.essays]); // Adjust based on your API response
                setHasMore(data.essays.length === size);
            } catch (err) {
                console.error("Error fetching essay history:", err);
                setError(err.message || "Failed to fetch essay history.");
            } finally {
                setLoading(false);
            }
        };
        fetchEssayHistory();
    }, [page, size]);

    const loadMore = () => {
        setPage((prevPage) => prevPage + 1);
    };

    if (loading && page === 0) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <Alert type="error" message={error} />;
    }

    if (!essays || essays.length === 0) {
        return <p>No essay submissions found.</p>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md mt-20">
            <h1 className="text-2xl font-semibold mb-4">Essay Submission History</h1>
            {essays.map((essay) => (
                <div key={essay.id} className="mb-6 p-4 border border-gray-300 rounded-md">
                    <h2 className="text-xl font-bold mb-2">Task: {essay.writingTask.title}</h2>
                    <p className="mb-2"><span className="font-semibold">Prompt:</span> {essay.writingTask.prompt}</p>
                    <p className="mb-2"><span className="font-semibold">Essay Content:</span></p>
                    <p className="mb-2 whitespace-pre-wrap">{essay.content}</p>
                    <p className="mb-2"><span className="font-semibold">Submission Time:</span> {new Date(essay.submissionTime).toLocaleString()}</p>
                    
                    {/* Button to view detailed feedback */}
                    <Link to={`/history/${essay.id}`} className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                        View Feedback
                    </Link>
                </div>
            ))}
            {loading && <LoadingSpinner />}
            {hasMore && !loading && (
                <button
                    onClick={loadMore}
                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                    Load More
                </button>
            )}
            {!hasMore && essays.length > 0 && (
                <p className="mt-4 text-center text-gray-500">No more essays to load.</p>
            )}
        </div>
    );
}
