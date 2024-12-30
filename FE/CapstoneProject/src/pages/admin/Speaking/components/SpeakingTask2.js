// SpeakingTask.js
import React, { useEffect, useState, useRef } from "react";
import * as dataApi from "../../../../api/apiService/dataService";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { useReactMediaRecorder } from "react-media-recorder";
import { useParams } from "react-router-dom";
import { 
  FaSpinner, 
  FaExclamationTriangle, 
  FaCheckCircle, 
  FaLightbulb, 
  FaBookOpen, 
  FaPenFancy, 
  FaListAlt, 
  FaPaperPlane, 
  FaEye, 
  FaTimes, 
  FaMagic, 
  FaShoppingCart,
  FaPlayCircle,
  FaPauseCircle
} from "react-icons/fa";
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';

function SpeakingTask() {
  const userInfo = useSelector((state) => state.login.user);
  const [question, setQuestion] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { questionId } = useParams();
  const [audioBlob, setAudioBlob] = useState(null);
  const [transcript, Settranscript] = useState(null);

  // AI suggestion
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

  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioRef = useRef(null);

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

  // Extract errors
  const grammarErrors = feedback?.grammarErrors || [];
  const vocabularyErrors = feedback?.vocabularyErrors || [];
  const pronunciationErrors = feedback?.pronunciationErrors || [];

  const audioUrl = feedback?.audioUrl; 
  useEffect(() => {
    if (audioUrl) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.addEventListener('ended', () => {
        setIsAudioPlaying(false);
      });
    }
  }, [audioUrl]);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isAudioPlaying) {
      audioRef.current.pause();
      setIsAudioPlaying(false);
    } else {
      audioRef.current.play();
      setIsAudioPlaying(true);
    }
  };

  useEffect(() => {
    // Khởi tạo tippy cho tất cả các phần tử có data-tippy-content
    tippy('[data-tippy-content]', {
      allowHTML: true,
      theme: 'light-border',
      interactive: true,
      arrow: true,
    });
  }, [feedback]);

  // Hàm render dòng lỗi với tooltip
  const renderErrorLine = ({ originalText, fixedText, errorMessage }) => (
    <div 
      className="flex items-center space-x-3 p-2 bg-white rounded border border-gray-200"
    >
      <span className="text-red-500" data-tippy-content={`<strong>Lỗi:</strong> ${errorMessage}`}>
        ✘
      </span>
      <span className="text-gray-800 text-sm flex-1" 
        data-tippy-content={`<strong>Gốc:</strong> ${originalText}<br/><strong>Lỗi:</strong> ${errorMessage}`}>
        {originalText}
      </span>
      <span className="text-gray-500">→</span>
      <span className="flex items-center space-x-1 flex-1" 
        data-tippy-content={`<strong>Sửa:</strong> ${fixedText}`}>
        <span className="text-green-600">✓</span>
        <span className="text-gray-800 text-sm">{fixedText}</span>
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-white pt-10 pb-20 px-4 mt-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <FaPenFancy className="mr-3 text-indigo-600" /> Luyện Nói
      </h2>

      <div className="flex flex-col md:flex-row md:space-x-6">
        {/* Left Column: Transcript & Errors */}
        <div className="flex-1 bg-[#E3E8FF] p-4 rounded-md border border-gray-200">
          <div className="flex items-start mb-4">
            {audioUrl ? (
              <button 
                className="text-teal-600 mr-3 hover:text-teal-700 transition-colors"
                onClick={toggleAudio}
              >
                {isAudioPlaying ? <FaPauseCircle size={24}/> : <FaPlayCircle size={24} />}
              </button>
            ) : (
              <div className="text-teal-600 mr-3">
                <FaPlayCircle size={24} className="opacity-50"/>
              </div>
            )}
            <p className="text-sm text-gray-800 flex-1 leading-relaxed">
              {transcript || "No transcript available. Record and submit to get feedback."}
            </p>
          </div>

          {(grammarErrors.length > 0 || vocabularyErrors.length > 0 || pronunciationErrors.length > 0) ? (
            <div className="space-y-2">
              {grammarErrors.map((error, idx) => renderErrorLine({
                originalText: error.sentence,
                fixedText: error.recommendation,
                errorMessage: error.error || 'Lỗi ngữ pháp'
              }))}

              {vocabularyErrors.map((error, idx) => renderErrorLine({
                originalText: error.word,
                fixedText: error.recommendation,
                errorMessage: error.error || 'Lỗi từ vựng'
              }))}

              {pronunciationErrors.map((error, idx) => renderErrorLine({
                originalText: error.word,
                fixedText: error.recommendation,
                errorMessage: error.error || 'Lỗi phát âm'
              }))}
            </div>
          ) : (
            <p className="text-sm text-gray-600 mt-2">Chưa có lỗi nào hoặc chưa nộp bài.</p>
          )}

          {/* Recording controls */}
          <div className="mt-6">
            <p className="text-gray-600 mb-2 text-sm">Trạng thái ghi âm: <span className="font-medium text-gray-800">{status}</span></p>
            <div className="mb-4">
              {(status === "idle" || status === "stopped") ? (
                <button
                  onClick={startRecording}
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors text-sm"
                >
                  Bắt đầu ghi âm
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors text-sm"
                >
                  Dừng ghi âm
                </button>
              )}
            </div>

            {mediaBlobUrl && (
              <div className="mb-4">
                <p className="text-gray-600 mb-2 font-medium text-sm">Nghe lại bản ghi:</p>
                <audio controls src={mediaBlobUrl} className="w-full rounded border border-gray-300" />
              </div>
            )}

            <button
              onClick={handleSubmitAudio}
              disabled={isSubmitting}
              className={`w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors text-sm ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Đang gửi..." : "Gửi câu trả lời"}
            </button>
          </div>
        </div>

        {/* Right Column: AI trợ giúp */}
        <div className="w-full md:w-1/3 mt-6 md:mt-0">
          <p className="text-sm text-gray-600 mb-2">Nhập ý tưởng bạn có, ví dụ:</p>
          <ul className="text-sm text-gray-500 mb-4 list-disc list-inside">
            <li>Yes, I do...</li>
            <li>I love nature; go with my friends; make me feel relaxed</li>
            <li>Nói về việc tôi thích đi du lịch...</li>
          </ul>
          <textarea
            value={userIdea}
            onChange={(e) => setUserIdea(e.target.value)}
            placeholder="Nhập ý tưởng tại đây..."
            className="w-full h-24 border border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm"
          ></textarea>
          <button
            onClick={handleGenerateAnswer}
            disabled={isGenerating}
            className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors mb-4 text-sm ${
              isGenerating ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isGenerating ? "Đang sinh gợi ý..." : "Giúp mình lên gợi ý"}
          </button>

          {aiAnswer ? (
            <div className="mt-6 bg-gray-100 p-4 rounded-md flex-1 border border-gray-200">
              <h4 className="text-lg font-semibold mb-2 text-gray-800">Gợi ý từ AI:</h4>
              <p className="text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">{aiAnswer}</p>
            </div>
          ) : (
            <p className="text-gray-500 mt-4 text-sm">Chưa có câu trả lời từ AI.</p>
          )}

          <div className="mt-4 text-right">
            <p className="text-gray-600 text-sm">
              <strong>Câu hỏi:</strong> {question?.questionText}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SpeakingTask;
