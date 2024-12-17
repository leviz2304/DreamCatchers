// src/components/MyReportPage.jsx

import React, { useEffect, useState } from "react";
import { getAllUserEssaysWithFeedback, generateCommonIssues, getLatestCommonIssues } from "../../api/apiService/dataService";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { FaChevronDown, FaChevronUp } from "react-icons/fa"; // Import các biểu tượng đóng mở

function MyReportPage() {
  const [essays, setEssays] = useState([]);
  const [commonIssues, setCommonIssues] = useState(null);
  const [loadingEssays, setLoadingEssays] = useState(true);
  const [loadingIssues, setLoadingIssues] = useState(false);

  const [showEssays, setShowEssays] = useState(true); // State để toggle Essays & Feedback
  const [showCommonIssues, setShowCommonIssues] = useState(true); // State để toggle Common Issues nếu cần

  const [openEssayIds, setOpenEssayIds] = useState([]); // State để theo dõi các essay đang mở

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
      console.log("test"+data)
      setCommonIssues(data.content);
      
    } catch (error) {
      // ignore error if no issues
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

  // Hàm để toggle mở/đóng từng essay
  const toggleEssay = (essayId) => {
    setOpenEssayIds((prevOpenEssayIds) =>
      prevOpenEssayIds.includes(essayId)
        ? prevOpenEssayIds.filter((id) => id !== essayId)
        : [...prevOpenEssayIds, essayId]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">My Report</h1>

        {/* Essays & Feedback */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold mb-2">Your Essays & Feedback</h2>
            <button
              onClick={() => setShowEssays(!showEssays)}
              className="text-blue-500 text-sm hover:underline"
            >
              {showEssays ? "Hide" : "Show"}
            </button>
          </div>
          {showEssays && (
            <>
              {loadingEssays ? (
                <p>Loading...</p>
              ) : (
                <div className="space-y-4">
                  {essays && essays.map((essay) => (
                    <div key={essay.id} className="bg-white p-4 rounded shadow">
                      <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleEssay(essay.id)}>
                        <div>
                          <h3 className="text-lg font-medium mb-2">Essay ID: {essay.id}</h3>
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">{essay.content}</p>
                          <p className="text-sm text-gray-500">Score: {essay.score}</p>
                        </div>
                        <div>
                          {openEssayIds.includes(essay.id) ? (
                            <FaChevronUp className="text-gray-500" />
                          ) : (
                            <FaChevronDown className="text-gray-500" />
                          )}
                        </div>
                      </div>

                      {/* Chi tiết phản hồi */}
                      {openEssayIds.includes(essay.id) && (
                        <div className="border-t pt-2 text-sm text-gray-700 mt-4">
                          {essay.feedback ? (
                            <div>
                              <h4 className="font-medium">Feedback:</h4>
                              <div className="mt-2">
                                <h5 className="font-medium">Grammar Errors:</h5>
                                {essay.feedback.grammarErrors && essay.feedback.grammarErrors.length > 0 ? (
                                  <ul className="list-disc list-inside">
                                    {essay.feedback.grammarErrors.map((ge, i) => (
                                      <li key={i}>
                                        <strong>Sentence:</strong> {ge.sentence}
                                        <br/> <strong>Error:</strong> {ge.error}
                                        <br/> <strong>Recommendation:</strong> {ge.recommendation}
                                      </li>
                                    ))}
                                  </ul>
                                ) : <p>No grammar errors</p>}

                                <h5 className="font-medium mt-2">Vocabulary Errors:</h5>
                                {essay.feedback.vocabularyErrors && essay.feedback.vocabularyErrors.length > 0 ? (
                                  <ul className="list-disc list-inside">
                                    {essay.feedback.vocabularyErrors.map((ve, i) => (
                                      <li key={i}>
                                        <strong>Word:</strong> {ve.word}
                                        <br/>
                                         <strong>Error:</strong> {ve.error}
                                         <br/> <strong>Recommendation:</strong> {ve.recommendation}
                                      </li>
                                    ))}
                                  </ul>
                                ) : <p>No vocabulary errors</p>}

                                <h5 className="font-medium mt-2">Overall Feedback:</h5>
                                <p>{essay.feedback.overallFeedback}</p>
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">No feedback available</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Common Grammar Issues */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold mb-2">Common Grammar Issues</h2>
            <button
              onClick={() => setShowCommonIssues(!showCommonIssues)}
              className="text-blue-500 text-sm hover:underline"
            >
              {showCommonIssues ? "Hide" : "Show"}
            </button>
          </div>

          {showCommonIssues && (
            <>
              <p className="text-sm text-gray-500 mb-4">Here are the top 3 common grammar issues identified from your last 5 essays.</p>
              <button
                onClick={handleGenerateIssues}
                disabled={loadingIssues}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors mb-4"
              >
                {loadingIssues ? "Generating..." : "Generate Common Issues"}
              </button>

              {commonIssues ? (
                <div className="bg-white p-4 rounded shadow text-sm">
                  <h3 className="font-medium mb-2">Common Issues:</h3>
                  {commonIssues.commonErrorsJson ? (
                    (() => {
                      try {
                        const parsed = JSON.parse(commonIssues.commonErrorsJson);
                        if (parsed.issues && parsed.issues.length > 0) {
                          return (
                            <ul className="list-disc list-inside">
                              {parsed.issues.map((issue, i) => (
                                <li key={i}>
                                  <strong>Error:</strong> {issue.error}<br />
                                  {/* Bạn có thể thêm ví dụ và khuyến nghị nếu cần */}
                                </li>
                              ))}
                            </ul>
                          );
                        } else {
                          return <p>No issues identified</p>;
                        }
                      } catch (err) {
                        console.error("Error parsing common issues:", err);
                        return <p>Error parsing common issues data.</p>;
                      }
                    })()
                  ) : (
                    <p>No data available</p>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">No common issues generated yet.</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyReportPage;
