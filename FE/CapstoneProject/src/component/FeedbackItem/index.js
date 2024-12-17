// src/components/FeedbackItem.js
import React, { useState } from "react";

function FeedbackItem({ fb, parseFeedback }) {
  const [isOpen, setIsOpen] = useState(false);
  const fbData = parseFeedback(fb.feedbackJson);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="bg-white p-4 rounded shadow text-sm text-gray-700">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={toggleOpen}
      >
        <div>
          <h3 className="font-medium">Feedback ID: {fb.id}</h3>
          <p className="text-sm text-gray-500">
            {new Date(fb.submissionTime).toLocaleString()}
          </p>
        </div>
        <div className="ml-4">
          {isOpen ? (
            // Icon for collapse (e.g., minus)
            <svg
              className="w-6 h-6 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 12H4"
              />
            </svg>
          ) : (
            // Icon for expand (e.g., plus)
            <svg
              className="w-6 h-6 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          )}
        </div>
      </div>

      {isOpen && (
        <div className="mt-4">
          <p className="mb-2">
            <strong>Transcript:</strong> {fb.transcript}
          </p>
          {fb.audioUrl && (
            <div className="mb-2">
              <p className="font-medium mb-1">Audio:</p>
              <audio controls src={fb.audioUrl} className="w-full" />
            </div>
          )}

          {fbData ? (
            <div className="mt-2">
              {/* Pronunciation Errors */}
              <h3 className="font-medium">Pronunciation Errors:</h3>
              {fbData.pronunciationErrors && fbData.pronunciationErrors.length > 0 ? (
                <ul className="list-disc list-inside">
                  {fbData.pronunciationErrors.map((pe, i) => (
                    <li key={i}>
                      <strong>Word:</strong> {pe.word}
                      <br/>
                      <strong>Error:</strong> {pe.error},{" "}
                      <br/>

                      <strong>Recommendation:</strong> {pe.recommendation}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No pronunciation errors</p>
              )}

              {/* Grammar Errors */}
              <h3 className="font-medium mt-2">Grammar Errors:</h3>
              {fbData.grammarErrors && fbData.grammarErrors.length > 0 ? (
                <ul className="list-disc list-inside">
                  {fbData.grammarErrors.map((ge, i) => (
                    <li key={i}>
                      <strong>Sentence:</strong> {ge.sentence}
                      <br/>
                      <strong>Error:</strong> {ge.error}
                      <br/>

                      <strong>Recommendation:</strong> {ge.recommendation}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No grammar errors</p>
              )}

              {/* Vocabulary Errors */}
              <h3 className="font-medium mt-2">Vocabulary Errors:</h3>
              {fbData.vocabularyErrors && fbData.vocabularyErrors.length > 0 ? (
                <ul className="list-disc list-inside">
                  {fbData.vocabularyErrors.map((ve, i) => (
                    <li key={i}>
                      <strong>Word:</strong> {ve.word}
                      <br/>
                      <strong>Error:</strong> {ve.error}
                      <br/>

                      <strong>Recommendation:</strong> {ve.recommendation}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No vocabulary errors</p>
              )}

              {/* Overall Feedback */}
              <h4 className="font-medium mt-2">Overall Feedback:</h4>
              <p>{fbData.overallFeedback}</p>
            </div>
          ) : (
            <p className="text-gray-500">No detailed feedback data</p>
          )}
        </div>
      )}
    </div>
  );
}

export default FeedbackItem;
