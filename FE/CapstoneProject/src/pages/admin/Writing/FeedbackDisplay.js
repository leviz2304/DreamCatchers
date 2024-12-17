// src/components/WritingSubmission/FeedbackDisplay.js

import React, { useState, useEffect } from "react";

export default function FeedbackDisplay({ feedbackJson }) {
    const [feedback, setFeedback] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        try {
            const parsedFeedback = JSON.parse(feedbackJson);
            setFeedback(parsedFeedback);
        } catch (err) {
            console.error("Error parsing feedback JSON:", err);
            setError("Invalid feedback data.");
        }
    }, [feedbackJson]);

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    if (!feedback) {
        return <p>Loading feedback...</p>;
    }

    return (
        <div className="mt-2 p-4 bg-gray-50 border border-gray-200 rounded-md">
            {/* Grammar Errors */}
            {feedback.grammarErrors && feedback.grammarErrors.length > 0 && (
                <div className="mb-4">
                    <h4 className="text-md font-semibold">Grammatical Errors:</h4>
                    {feedback.grammarErrors.map((error, index) => (
                        <div key={index} className="ml-4 mt-2">
                            <p><span className="font-semibold">Sentence:</span> {error.sentence}</p>
                            <p><span className="font-semibold">Error:</span> {error.error}</p>
                            <p><span className="font-semibold">Recommendation:</span> {error.recommendation}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Vocabulary Errors */}
            {feedback.vocabularyErrors && feedback.vocabularyErrors.length > 0 && (
                <div className="mb-4">
                    <h4 className="text-md font-semibold">Vocabulary Errors:</h4>
                    {feedback.vocabularyErrors.map((error, index) => (
                        <div key={index} className="ml-4 mt-2">
                            <p><span className="font-semibold">Word:</span> {error.word}</p>
                            <p><span className="font-semibold">Error:</span> {error.error}</p>
                            <p><span className="font-semibold">Recommendation:</span> {error.recommendation}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Overall Feedback */}
            {feedback.overallFeedback && (
                <div className="mb-4">
                    <h4 className="text-md font-semibold">Overall Feedback:</h4>
                    <p className="ml-4">{feedback.overallFeedback}</p>
                </div>
            )}

            {/* Overall Score */}
            {feedback.overallScore !== undefined && (
                <div>
                    <h4 className="text-md font-semibold">Overall Score:</h4>
                    <p className="ml-4">{feedback.overallScore}</p>
                </div>
            )}
        </div>
    );
}
