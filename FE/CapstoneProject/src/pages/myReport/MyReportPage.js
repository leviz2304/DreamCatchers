// src/components/MyReportPage.jsx

import React, { useEffect, useState } from "react";
import { getAllUserEssaysWithFeedback, generateCommonIssues, getLatestCommonIssues } from "../../api/apiService/dataService";
import { toast } from "sonner";
import { FaChevronDown, FaChevronUp, FaEdit, FaLightbulb, FaExclamationTriangle, FaBookOpen, FaSyncAlt } from "react-icons/fa";

function MyReportPage() {
  const [essays, setEssays] = useState([]);
  const [commonIssues, setCommonIssues] = useState(null);
  const [loadingEssays, setLoadingEssays] = useState(true);
  const [loadingIssues, setLoadingIssues] = useState(false);

  const [showEssays, setShowEssays] = useState(true);
  const [showCommonIssues, setShowCommonIssues] = useState(true);

  const [openEssayIds, setOpenEssayIds] = useState([]);

  const userStr = sessionStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const userId = user ? user.id : null;

  useEffect(() => {
    if (userId) {
      fetchEssays();
      fetchCommonIssues();
    }
  }, [userId]);

  const fetchEssays = async () => {
    try {
      const data = await getAllUserEssaysWithFeedback(userId);
      setEssays(data.content);
      setLoadingEssays(false);
    } catch (error) {
      toast.error("Failed to fetch essays.");
      setLoadingEssays(false);
    }
  };

  const fetchCommonIssues = async () => {
    try {
      const data = await getLatestCommonIssues(userId);
      setCommonIssues(data.content);
    } catch (error) {
      // No common issues yet
    }
  };

  const handleGenerateIssues = async () => {
    setLoadingIssues(true);
    try {
      await generateCommonIssues(userId);
      toast.success("Common issues generated!");
      await fetchCommonIssues();
    } catch (error) {
      toast.error("Failed to generate common issues.");
    } finally {
      setLoadingIssues(false);
    }
  };

  const toggleEssay = (essayId) => {
    setOpenEssayIds((prevOpenEssayIds) =>
      prevOpenEssayIds.includes(essayId)
        ? prevOpenEssayIds.filter((id) => id !== essayId)
        : [...prevOpenEssayIds, essayId]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-20 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-indigo-700 mb-4 flex items-center space-x-3">
          <FaEdit className="text-indigo-600" />
          <span>My Report</span>
        </h1>
        <p className="text-gray-600 mb-8">
          Review your submitted essays and discover common issues to improve your writing.
        </p>

        {/* Essays & Feedback */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold text-gray-800">Your Essays & Feedback</h2>
            <button
              onClick={() => setShowEssays(!showEssays)}
              className="text-indigo-600 text-sm font-medium hover:underline flex items-center space-x-1"
            >
              <span>{showEssays ? "Hide" : "Show"}</span>
              {showEssays ? <FaChevronUp /> : <FaChevronDown />}
            </button>
          </div>
          {showEssays && (
            <>
              {loadingEssays ? (
                <p className="text-gray-500">Loading...</p>
              ) : (
                <div className="space-y-4">
                  {essays && essays.length > 0 ? (
                    essays.map((essay) => (
                      <div key={essay.id} className="bg-white p-4 rounded shadow border border-gray-200">
                        <div
                          className="flex items-center justify-between cursor-pointer"
                          onClick={() => toggleEssay(essay.id)}
                        >
                          <div>
                            <h3 className="text-lg font-medium text-gray-800">Essay ID: {essay.id}</h3>
                            <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">{essay.content}</p>
                            <p className="text-sm text-gray-600 mt-2">Score: <span className="font-semibold text-indigo-600">{essay.score}</span></p>
                          </div>
                          <div>
                            {openEssayIds.includes(essay.id) ? (
                              <FaChevronUp className="text-gray-500" />
                            ) : (
                              <FaChevronDown className="text-gray-500" />
                            )}
                          </div>
                        </div>

                        {openEssayIds.includes(essay.id) && (
                          <div className="border-t pt-4 mt-4 text-sm text-gray-700">
                            {essay.feedback ? (
                              <div>
                                <h4 className="font-medium text-indigo-600 mb-2 flex items-center space-x-2">
                                  <FaLightbulb className="text-indigo-500" /> <span>Feedback Details:</span>
                                </h4>

                                {/* Grammar Errors */}
                                <div className="mb-4">
                                  <h5 className="font-medium text-red-600 flex items-center space-x-2">
                                    <FaExclamationTriangle className="text-red-500" />
                                    <span>Grammar Errors</span>
                                  </h5>
                                  {essay.feedback.grammarErrors && essay.feedback.grammarErrors.length > 0 ? (
                                    <ul className="list-disc list-inside mt-2 space-y-2 pl-4 text-gray-700">
                                      {essay.feedback.grammarErrors.map((ge, i) => (
                                        <li key={i} className="border-l-4 border-red-200 pl-2">
                                          <strong>Sentence:</strong> {ge.sentence}<br/>
                                          <strong>Error:</strong> {ge.error}<br/>
                                          <strong>Recommendation:</strong> {ge.recommendation}
                                        </li>
                                      ))}
                                    </ul>
                                  ) : (
                                    <p className="text-gray-500 mt-1">No grammar errors</p>
                                  )}
                                </div>

                                {/* Vocabulary Errors */}
                                <div className="mb-4">
                                  <h5 className="font-medium text-yellow-600 flex items-center space-x-2">
                                    <FaBookOpen className="text-yellow-500" />
                                    <span>Vocabulary Errors</span>
                                  </h5>
                                  {essay.feedback.vocabularyErrors && essay.feedback.vocabularyErrors.length > 0 ? (
                                    <ul className="list-disc list-inside mt-2 space-y-2 pl-4 text-gray-700">
                                      {essay.feedback.vocabularyErrors.map((ve, i) => (
                                        <li key={i} className="border-l-4 border-yellow-200 pl-2">
                                          <strong>Word:</strong> {ve.word}<br/>
                                          <strong>Error:</strong> {ve.error}<br/>
                                          <strong>Recommendation:</strong> {ve.recommendation}
                                        </li>
                                      ))}
                                    </ul>
                                  ) : (
                                    <p className="text-gray-500 mt-1">No vocabulary errors</p>
                                  )}
                                </div>

                                {/* Overall Feedback */}
                                <div className="mb-2">
                                  <h5 className="font-medium text-blue-600 flex items-center space-x-2">
                                    <FaLightbulb className="text-blue-500" />
                                    <span>Overall Feedback</span>
                                  </h5>
                                  <p className="text-gray-700 mt-1 border-l-4 border-blue-200 pl-2">
                                    {essay.feedback.overallFeedback}
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500">No feedback available</p>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No essays available yet.</p>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Common Grammar Issues */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold text-gray-800">Common Grammar Issues</h2>
            <button
              onClick={() => setShowCommonIssues(!showCommonIssues)}
              className="text-indigo-600 text-sm font-medium hover:underline flex items-center space-x-1"
            >
              <span>{showCommonIssues ? "Hide" : "Show"}</span>
              {showCommonIssues ? <FaChevronUp /> : <FaChevronDown />}
            </button>
          </div>

          {showCommonIssues && (
            <>
              <p className="text-sm text-gray-600 mb-4">These are the top 3 common grammar issues identified from your last 5 essays.</p>

              <button
                onClick={handleGenerateIssues}
                disabled={loadingIssues}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors mb-4 flex items-center space-x-2"
              >
                {loadingIssues ? <FaSyncAlt className="animate-spin" /> : <FaSyncAlt />}
                <span>{loadingIssues ? "Generating..." : "Generate Common Issues"}</span>
              </button>

              {commonIssues ? (
                <div className="bg-white p-4 rounded shadow text-sm border border-gray-200">
                  <h3 className="font-medium text-indigo-600 mb-2 flex items-center space-x-2">
                    <FaLightbulb className="text-indigo-500" />
                    <span>Common Issues:</span>
                  </h3>
                  {commonIssues.commonErrorsJson ? (
                    (() => {
                      try {
                        const parsed = JSON.parse(commonIssues.commonErrorsJson);
                        if (parsed.issues && parsed.issues.length > 0) {
                          return (
                            <ul className="list-disc list-inside space-y-2 pl-4 text-gray-700">
                              {parsed.issues.map((issue, i) => (
                                <li key={i} className="border-l-4 border-gray-200 pl-2">
                                  <strong>Error:</strong> {issue.error}
                                </li>
                              ))}
                            </ul>
                          );
                        } else {
                          return <p className="text-gray-500">No issues identified</p>;
                        }
                      } catch (err) {
                        console.error("Error parsing common issues:", err);
                        return <p className="text-red-500">Error parsing common issues data.</p>;
                      }
                    })()
                  ) : (
                    <p className="text-gray-500">No data available</p>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">No common issues generated yet. Click "Generate Common Issues" to create one.</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyReportPage;
