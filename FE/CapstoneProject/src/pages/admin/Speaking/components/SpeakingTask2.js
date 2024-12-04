// src/components/SpeakingTask.js

import React, { useEffect, useState } from "react";
import * as dataApi from "../../../../api/apiService/dataService";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { useReactMediaRecorder } from "react-media-recorder";
import { useParams } from "react-router-dom";

function SpeakingTask() {
  const userInfo = useSelector((state) => state.login.user);
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { questionId } = useParams();
  const [question, setQuestion] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);

  // Chat state
  const [chatMessages, setChatMessages] = useState([
    { sender: "bot", text: "Welcome! Let me suggest some answers based on your selected question." },
  ]);

  // React Media Recorder hook
  const {
    status,
    startRecording,
    stopRecording,
    mediaBlobUrl,
    clearBlobUrl,
    error,
    previewStream,
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
    fetchTopics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionId]);

  const fetchQuestion = async (id) => {
    try {
      const response = await dataApi.getQuestionById(id); // Now defined
      setQuestion(response);
    } catch (error) {
      toast.error("Failed to fetch question data.");
    }
  };

  const fetchTopics = async () => {
    try {
      const res = await dataApi.getAllSpeakingTopics();
      setTopics(res);
    } catch (error) {
      toast.error("Failed to fetch speaking topics.");
    }
  };

  const handleTopicChange = async (e) => {
    const topicId = e.target.value;
    setSelectedTopic(topicId);
    setSelectedQuestion("");
    setFeedback(null);
    setChatMessages([
      { sender: "bot", text: "Please select a question to get answer suggestions." },
    ]);
    try {
      const res = await dataApi.getAllQuestionsByTopic(topicId);
      setQuestions(res);
    } catch (error) {
      toast.error("Failed to fetch questions for the selected topic.");
    }
  };

  const handleQuestionChange = async (e) => {
    const questionId = e.target.value;
    setSelectedQuestion(questionId);
    setFeedback(null);
    clearBlobUrl();
    setAudioBlob(null);
    try {
      const selected = await dataApi.getQuestionById(questionId);
      setQuestion(selected);
      setChatMessages([
        { sender: "bot", text: "Here are some suggested answers based on your question." },
      ]);
      generateChatSuggestions(selected);
    } catch (error) {
      toast.error("Failed to fetch the selected question.");
    }
  };

  const generateChatSuggestions = (selectedQuestion) => {
    if (!selectedQuestion) return;

    // For demonstration, using static suggestions. Integrate with AI services for dynamic suggestions.
    const suggestions = [
      "Sure, I can help you with that. Here's a possible answer...",
      "Consider starting your response with...",
      "You might want to include examples such as...",
      "Remember to emphasize...",
    ];

    suggestions.forEach((suggestion, index) => {
      setTimeout(() => {
        setChatMessages((prev) => [...prev, { sender: "bot", text: suggestion }]);
      }, index * 1000);
    });
  };

  const handleSubmit = async () => {
    if (!audioBlob) {
      toast.error("Please record your response before submitting.");
      return;
    }

    // Check file size
    if (audioBlob.size > 10 * 1024 * 1024) {
      toast.error("Audio file is too large. Please record a shorter response.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await dataApi.submitSpeakingResponse(
        userInfo.id,
        selectedQuestion,
        audioBlob // Send the blob directly
      );

      toast.success("Submitted successfully!");
      setFeedback(response.feedbackJson ? JSON.parse(response.feedbackJson) : response);
      setIsSubmitting(false);
    } catch (error) {
      toast.error("Failed to submit your response.");
      console.error("Submit error:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Topic and Question Selection */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">IELTS Speaking Task 1</h2>

          {/* Topic Selection */}
          <div className="mb-6">
            <label htmlFor="topic" className="block text-gray-700 font-medium mb-2">
              Select Topic
            </label>
            <select
              id="topic"
              value={selectedTopic}
              onChange={handleTopicChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
            >
              <option value="">-- Select a Topic --</option>
              {topics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.name}
                </option>
              ))}
            </select>
          </div>

          {/* Question Selection */}
          {selectedTopic && (
            <div className="mb-6">
              <label htmlFor="question" className="block text-gray-700 font-medium mb-2">
                Select Question
              </label>
              <select
                id="question"
                value={selectedQuestion}
                onChange={handleQuestionChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
              >
                <option value="">-- Select a Question --</option>
                {questions.map((question) => (
                  <option key={question.id} value={question.id}>
                    {question.questionText}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Loading Indicator for Question Fetching */}
          {questionId && !selectedQuestion && (
            <p className="text-gray-500">Loading question...</p>
          )}
        </div>

        {/* Main Content: Recording & Chat Interface */}
        <div className="bg-white shadow-md rounded-lg p-6">
          {selectedQuestion ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column: Recording and Feedback */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Record Your Response</h3>
                <p className="text-gray-600 mb-4">Recording Status: {status}</p>

                {/* Recording Controls */}
                <div className="mb-4">
                  {status === "idle" || status === "stopped" ? (
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
                    <p className="text-gray-600 mb-2">Preview Your Recording:</p>
                    <audio controls src={mediaBlobUrl} className="w-full" />
                  </div>
                )}

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? "Submitting..." : "Submit Response"}
                </button>

                {/* Feedback Display */}
                {feedback && (
                  <div className="mt-6 bg-gray-100 p-4 rounded-md">
                    <h4 className="text-lg font-semibold mb-2">Feedback</h4>

                    {/* Pronunciation Errors */}
                    <div className="mb-4">
                      <h5 className="font-medium">Pronunciation Errors:</h5>
                      {feedback.pronunciationErrors && feedback.pronunciationErrors.length > 0 ? (
                        <ul className="list-disc list-inside">
                          {feedback.pronunciationErrors.map((error, index) => (
                            <li key={index}>
                              <strong>Word:</strong> {error.word} <br />
                              <strong>Error:</strong> {error.error} <br />
                              <strong>Recommendation:</strong> {error.recommendation}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>No pronunciation errors detected.</p>
                      )}
                    </div>

                    <hr className="my-4" />

                    {/* Grammar Errors */}
                    <div className="mb-4">
                      <h5 className="font-medium">Grammar Errors:</h5>
                      {feedback.grammarErrors && feedback.grammarErrors.length > 0 ? (
                        <ul className="list-disc list-inside">
                          {feedback.grammarErrors.map((error, index) => (
                            <li key={index}>
                              <strong>Sentence:</strong> {error.sentence} <br />
                              <strong>Error:</strong> {error.error} <br />
                              <strong>Recommendation:</strong> {error.recommendation}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>No grammar errors detected.</p>
                      )}
                    </div>

                    <hr className="my-4" />

                    {/* Vocabulary Errors */}
                    <div className="mb-4">
                      <h5 className="font-medium">Vocabulary Errors:</h5>
                      {feedback.vocabularyErrors && feedback.vocabularyErrors.length > 0 ? (
                        <ul className="list-disc list-inside">
                          {feedback.vocabularyErrors.map((error, index) => (
                            <li key={index}>
                              <strong>Word:</strong> {error.word} <br />
                              <strong>Error:</strong> {error.error} <br />
                              <strong>Recommendation:</strong> {error.recommendation}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>No vocabulary errors detected.</p>
                      )}
                    </div>

                    <hr className="my-4" />

                    {/* Overall Feedback */}
                    <div>
                      <h5 className="font-medium">Overall Feedback:</h5>
                      <p>{feedback.overallFeedback}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Chat Interface */}
              <div className="flex flex-col h-full">
                <h3 className="text-xl font-semibold mb-4">Answer Suggestions</h3>
                <div className="flex-1 bg-gray-100 p-4 rounded-md overflow-y-auto mb-4">
                  {chatMessages.map((msg, index) => (
                    <div
                      key={index}
                      className={`mb-2 flex ${
                        msg.sender === "bot" ? "justify-start" : "justify-end"
                      }`}
                    >
                      <div
                        className={`px-4 py-2 rounded-md max-w-xs ${
                          msg.sender === "bot"
                            ? "bg-blue-500 text-white"
                            : "bg-green-500 text-white"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Display Question Name */}
                <div className="text-right">
                  <p className="text-gray-600">
                    <strong>Question:</strong> {question?.questionText}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Please select a topic and question to begin.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SpeakingTask;
