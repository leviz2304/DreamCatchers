// src/pages/SpeakingReportPage.js
import React, { useEffect, useState } from "react";
import { getSpeakingFeedbacks } from "../../api/apiService/dataService";
import { toast } from "sonner";
import FeedbackItem from "../../component/FeedbackItem"; // Đảm bảo FeedbackItem cũng được style tốt.
import { FaMicrophone } from "react-icons/fa";

function SpeakingReportPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const userStr = sessionStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const userId = user ? user.id : null;

  useEffect(() => {
    if (userId) {
      fetchFeedbacks();
    }
  }, [userId]);

  const fetchFeedbacks = async () => {
    try {
      const data = await getSpeakingFeedbacks(userId);
      setFeedbacks(data);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch speaking feedbacks.");
      setLoading(false);
    }
  };

  // Hàm parse feedbackJson
  const parseFeedback = (json) => {
    try {
      return JSON.parse(json);
    } catch (err) {
      console.error("Error parsing feedbackJson:", err);
      return null;
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-600">Loading...</p>;

  return (
    <div className="min-h-screen bg-blue-50 pt-20 px-4 pb-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center mb-6 space-x-3">
          <FaMicrophone className="text-indigo-600 text-3xl" />
          <h1 className="text-3xl font-bold text-indigo-700">Speaking Report</h1>
        </div>
        <p className="text-sm text-gray-600 mb-6">
          Below are your speaking attempts and their feedback. 
          <span className="ml-1 text-gray-500">Hover over errors to see details.</span>
        </p>

        {feedbacks.length === 0 ? (
          <p className="text-gray-500 text-sm text-center mt-10">No feedback available yet.</p>
        ) : (
          <div className="space-y-4">
            {feedbacks.map((fb, index) => (
              <div 
                key={fb.id} 
                className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-semibold text-gray-800">Attempt #{index + 1}</h2>
                  {fb.submissionTime && (
                    <p className="text-xs text-gray-500">
                      Submitted: {new Date(fb.submissionTime).toLocaleString()}
                    </p>
                  )}
                </div>
                <FeedbackItem fb={fb} parseFeedback={parseFeedback} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SpeakingReportPage;
