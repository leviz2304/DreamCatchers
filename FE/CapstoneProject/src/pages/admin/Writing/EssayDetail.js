// src/components/WritingSubmission/EssayDetail.js

import React, { useState, useEffect } from "react";
import { getEssayById } from "../../../api/apiService/dataService";
import FeedbackDisplay from "./FeedbackDisplay";
import { useParams, Link } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";
import Alert from "./Alert";

export default function EssayDetail() {
    const { essayId } = useParams();
    const [essay, setEssay] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEssay = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getEssayById(essayId);
                setEssay(data);
            } catch (err) {
                console.error("Error fetching essay:", err);
                setError(err.message || "Failed to fetch essay.");
            } finally {
                setLoading(false);
            }
        };
        fetchEssay();
    }, [essayId]);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <Alert type="error" message={error} />;
    }

    if (!essay) {
        return <p>No essay found.</p>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md mt-6">
            <Link to="/history" className="text-blue-500 hover:underline">← Back to Essay History</Link>
            <h1 className="text-2xl font-semibold mb-4">Essay Details</h1>
            <h2 className="text-xl font-bold mb-2">Task: {essay.writingTask.title}</h2>
            <p className="mb-2"><span className="font-semibold">Prompt:</span> {essay.writingTask.prompt}</p>
            <p className="mb-2"><span className="font-semibold">Essay Content:</span></p>
            <p className="mb-2 whitespace-pre-wrap">{essay.content}</p>
            <p className="mb-2"><span className="font-semibold">Submission Time:</span> {new Date(essay.submissionTime).toLocaleString()}</p>
            <p className="mb-2"><span className="font-semibold">Overall Score:</span> {essay.score}</p>
            
            {/* Feedback */}
            {essay.feedbackJson && (
                <div className="mt-4">
                    <h3 className="text-lg font-semibold">AI Feedback:</h3>
                    <FeedbackDisplay feedbackJson={essay.feedbackJson} />
                </div>
            )}
        </div>
    );
}
