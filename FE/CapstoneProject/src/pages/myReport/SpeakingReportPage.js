// src/pages/SpeakingReportPage.js
import React, { useEffect, useState } from "react";
import { getSpeakingFeedbacks } from "../../api/apiService/dataService";
import { toast } from "sonner";
import FeedbackItem from "../../component/FeedbackItem"; // Adjust the path as necessary

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

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50 pt-20 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Speaking Report</h1>
        <p className="text-sm text-gray-500 mb-6">Here are your speaking attempts and feedback.</p>

        {feedbacks.length === 0 ? (
          <p className="text-gray-500">No feedback available yet.</p>
        ) : (
          <div className="space-y-4">
            {feedbacks.map((fb) => (
              <FeedbackItem key={fb.id} fb={fb} parseFeedback={parseFeedback} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SpeakingReportPage;
