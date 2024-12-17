// SpeakingTask.js
import React, { useEffect, useState } from "react";
import * as dataApi from "../../../../api/apiService/dataService";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { useReactMediaRecorder } from "react-media-recorder";
import { useParams } from "react-router-dom";

function SpeakingTask() {
  const userInfo = useSelector((state) => state.login.user);
  const [question, setQuestion] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { questionId } = useParams();
  const [audioBlob, setAudioBlob] = useState(null);
  const [transcript, Settranscript] = useState(null);

  // AI suggestion states
  const [userIdea, setUserIdea] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const {
    status,
    startRecording,
    stopRecording,
    mediaBlobUrl,
  } = useReactMediaRecorder({
    audio: true,
    onStop: (blobUrl, blob) => {
      setAudioBlob(blob);
    },
  });

  useEffect(() => {
    if (questionId) {
      fetchQuestion(questionId);
    }
  }, [questionId]);

  const fetchQuestion = async (id) => {
    try {
      const response = await dataApi.getQuestionById(id);
      setQuestion(response);
    } catch (error) {
      toast.error("Failed to fetch question data.");
    }
  };

  const handleSubmitAudio = async () => {
    if (!audioBlob) {
      toast.error("Please record your response before submitting.");
      return;
    }

    // Limit size (10MB)
    if (audioBlob.size > 10 * 1024 * 1024) {
      toast.error("Audio file is too large. Please record a shorter response.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await dataApi.submitSpeakingResponse(
        userInfo.id,
        questionId,
        audioBlob
      );
      if (response && response.feedbackJson) {
        const feedbackData = JSON.parse(response.feedbackJson);
        setFeedback(feedbackData);
        Settranscript(response.transcript);
      } else {
        setFeedback(null);
        toast.error("No feedback received from the server.");
      }

      toast.success("Submitted successfully!");
      setIsSubmitting(false);
    } catch (error) {
      toast.error("Failed to submit your response.");
      setIsSubmitting(false);
    }
  };

  const handleGenerateAnswer = async () => {
    if (!userIdea.trim()) {
      toast.error("Please enter your idea.");
      return;
    }

    setIsGenerating(true);

    try {
      const response = await dataApi.generateAnswer(userInfo.id, questionId, userIdea);
      setAiAnswer(response);
      setIsGenerating(false);
    } catch (error) {
      toast.error("Failed to generate answer.");
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 mt-10">
      {/* Navigation Bar */}
      {/* <div className="bg-white border-b border-gray-200 py-3 px-4">
        <nav className="text-sm text-gray-600 flex items-center space-x-2">
          <a href="/" className="hover:underline text-blue-500">Trang chủ</a>
          <span>›</span>
          <span>Luyện từng câu</span>
          <span>›</span>
          <span>PART 1</span>
          <span>›</span>
          <span className="font-semibold text-gray-800">{question?.questionText || "Loading..."}</span>
        </nav>
      </div> */}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">Record Your Response</h3>
            <p className="text-gray-600 mb-4">Recording Status: <span className="font-medium text-gray-800">{status}</span></p>

            {/* Record Controls */}
            <div className="mb-4">
              {(status === "idle" || status === "stopped") ? (
                <button
                  onClick={startRecording}
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
                >
                  Start Recording
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
                >
                  Stop Recording
                </button>
              )}
            </div>

            {/* Audio Preview */}
            {mediaBlobUrl && (
              <div className="mb-4">
                <p className="text-gray-600 mb-2 font-medium">Preview Your Recording:</p>
                <audio controls src={mediaBlobUrl} className="w-full rounded border border-gray-300" />
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmitAudio}
              disabled={isSubmitting}
              className={`w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Submitting..." : "Submit Response"}
            </button>

            {/* Feedback */}
            {feedback ? (
              <div className="mt-6 bg-gray-100 p-4 rounded-md border border-gray-200">
                <h4 className="text-xl font-semibold mb-4 text-gray-800">Feedback</h4>
                <p className="text-sm mb-2"><strong>Transcript:</strong> {transcript}</p>
                
                {/* Pronunciation Errors */}
                <div className="mb-4">
                  <h5 className="font-medium text-gray-800">Pronunciation Errors:</h5>
                  {feedback.pronunciationErrors && feedback.pronunciationErrors.length > 0 ? (
                    <ul className="list-disc list-inside text-sm text-gray-700 mt-2 space-y-2">
                      {feedback.pronunciationErrors.map((error, index) => (
                        <li key={index} className="pl-2">
                          <strong>Word:</strong> {error.word}<br/>
                          <strong>Error:</strong> {error.error}<br/>
                          <strong>Recommendation:</strong> {error.recommendation}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-600 text-sm">No pronunciation errors detected.</p>
                  )}
                </div>

                <hr className="my-4" />

                {/* Grammar Errors */}
                <div className="mb-4">
                  <h5 className="font-medium text-gray-800">Grammar Errors:</h5>
                  {feedback.grammarErrors && feedback.grammarErrors.length > 0 ? (
                    <ul className="list-disc list-inside text-sm text-gray-700 mt-2 space-y-2">
                      {feedback.grammarErrors.map((error, index) => (
                        <li key={index} className="pl-2">
                          <strong>Sentence:</strong> {error.sentence}<br/>
                          <strong>Error:</strong> {error.error}<br/>
                          <strong>Recommendation:</strong> {error.recommendation}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-600 text-sm">No grammar errors detected.</p>
                  )}
                </div>

                <hr className="my-4" />

                {/* Vocabulary Errors */}
                <div className="mb-4">
                  <h5 className="font-medium text-gray-800">Vocabulary Errors:</h5>
                  {feedback.vocabularyErrors && feedback.vocabularyErrors.length > 0 ? (
                    <ul className="list-disc list-inside text-sm text-gray-700 mt-2 space-y-2">
                      {feedback.vocabularyErrors.map((error, index) => (
                        <li key={index} className="pl-2">
                          <strong>Word:</strong> {error.word}<br/>
                          <strong>Error:</strong> {error.error}<br/>
                          <strong>Recommendation:</strong> {error.recommendation}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-600 text-sm">No vocabulary errors detected.</p>
                  )}
                </div>

                <hr className="my-4" />

                {/* Overall Feedback */}
                <div>
                  <h5 className="font-medium text-gray-800">Overall Feedback:</h5>
                  <p className="text-sm text-gray-700 mt-2">{feedback.overallFeedback}</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 mt-4 text-sm">No feedback available yet.</p>
            )}
          </div>

          {/* Right Column: AI Suggestion */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">AI hỗ trợ</h3>
            <p className="text-gray-600 text-sm mb-2">Nhập ý tưởng bạn có, ví dụ:</p>
            <ul className="text-sm text-gray-500 mb-4 list-disc list-inside">
              <li>Yes, I do...</li>
              <li>I love nature; go with my friends; make me feel relaxed</li>
              <li>Nói về việc tôi thích đi du lịch...</li>
            </ul>

            {/* Vùng nhập ý tưởng */}
            <textarea
              value={userIdea}
              onChange={(e) => setUserIdea(e.target.value)}
              placeholder="Nhập ý tưởng tại đây..."
              className="w-full h-24 border border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm"
            ></textarea>

            {/* Nút gửi ý tưởng */}
            <button
              onClick={handleGenerateAnswer}
              disabled={isGenerating}
              className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors mb-4 ${
                isGenerating ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isGenerating ? "Đang sinh gợi ý..." : "Giúp mình lên gợi ý"}
            </button>

            {/* Hiển thị câu trả lời từ AI */}
            {aiAnswer ? (
              <div className="mt-6 bg-gray-100 p-4 rounded-md flex-1 border border-gray-200">
                <h4 className="text-xl font-semibold mb-2 text-gray-800">AI Answer:</h4>
                <p className="text-gray-700 text-sm whitespace-pre-wrap">{aiAnswer}</p>
              </div>
            ) : (
              <p className="text-gray-500 mt-4 text-sm">Chưa có câu trả lời từ AI.</p>
            )}

            {/* Hiển thị câu hỏi */}
            <div className="mt-4 text-right">
              <p className="text-gray-600 text-sm">
                <strong>Question:</strong> {question?.questionText}
              </p>
            </div>
          </div>
        </div>

        {/* Nút ví dụ "Cải thiện câu giúp mình", "Mua xịn để được chấm điểm" (Nếu muốn) */}
        <div className="mt-8 flex space-x-4">
          <button className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 text-sm">
            Cải thiện câu giúp mình
          </button>
          <button className="text-blue-600 text-sm hover:underline">
            Mua xịn để được chấm điểm chi tiết nhé.
          </button>
        </div>
      </div>
    </div>
  );
}

export default SpeakingTask;
