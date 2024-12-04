// src/components/SpeakingTask.js

import React, { useEffect, useState } from "react";
import * as dataApi from "../../../../api/apiService/dataService";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { useReactMediaRecorder } from "react-media-recorder";
import {
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Paper,
  Grid,
} from "@mui/material";

function SpeakingTask() {
  const userInfo = useSelector((state) => state.login.user);
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const [audioBlob, setAudioBlob] = useState(null);

  useEffect(() => {
    fetchTopics();
  }, []);

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
    try {
      const res = await dataApi.getAllQuestionsByTopic(topicId);
      setQuestions(res);
    } catch (error) {
      toast.error("Failed to fetch questions for the selected topic.");
    }
  };

  const handleQuestionChange = (e) => {
    setSelectedQuestion(e.target.value);
    setFeedback(null);
    clearBlobUrl();
    setAudioBlob(null);
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

    try {
        const response = await dataApi.submitSpeakingResponse(
            userInfo.id,
            selectedQuestion,
            audioBlob // Send the blob directly
        );

        toast.success("Submitted successfully!");
        setFeedback(response.feedbackJson ? JSON.parse(response.feedbackJson) : response);
    } catch (error) {
        toast.error("Failed to submit your response.");
        console.error("Submit error:", error);
    }
};

  

  return (
    <Grid container spacing={4} padding={4} justifyContent="center">
      <Grid item xs={12} md={8}>
        <Paper elevation={3} style={{ padding: "20px" }}>
          <Typography variant="h5" gutterBottom>
            IELTS Speaking Task 1
          </Typography>
          <FormControl fullWidth style={{ marginBottom: "20px" }}>
            <InputLabel id="topic-label">Select Topic</InputLabel>
            <Select
              labelId="topic-label"
              value={selectedTopic}
              label="Select Topic"
              onChange={handleTopicChange}
            >
              {topics.map((topic) => (
                <MenuItem key={topic.id} value={topic.id}>
                  {topic.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {selectedTopic && (
            <FormControl fullWidth style={{ marginBottom: "20px" }}>
              <InputLabel id="question-label">Select Question</InputLabel>
              <Select
                labelId="question-label"
                value={selectedQuestion}
                label="Select Question"
                onChange={handleQuestionChange}
              >
                {questions.map((question) => (
                  <MenuItem key={question.id} value={question.id}>
                    {question.questionText}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {selectedQuestion && (
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <Typography variant="subtitle1">
                Recording Status: {status}
              </Typography>
              <div style={{ marginTop: "10px" }}>
                {status === "idle" || status === "stopped" ? (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={startRecording}
                  >
                    Start Recording
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={stopRecording}
                  >
                    Stop Recording
                  </Button>
                )}
              </div>
            </div>
          )}

          {mediaBlobUrl && (
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <Typography variant="subtitle1">Preview Your Recording:</Typography>
              <audio controls src={mediaBlobUrl} />
            </div>
          )}

          {selectedQuestion && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={isSubmitting}
              fullWidth
            >
              {isSubmitting ? "Submitting..." : "Submit Response"}
            </Button>
          )}

          {feedback && (
            <Paper elevation={2} style={{ padding: "20px", marginTop: "20px" }}>
              <Typography variant="h6" gutterBottom>
                Feedback
              </Typography>
              <Typography variant="subtitle1">Pronunciation Errors:</Typography>
              {feedback.pronunciationErrors &&
              feedback.pronunciationErrors.length > 0 ? (
                <ul>
                  {feedback.pronunciationErrors.map((error, index) => (
                    <li key={index}>
                      <strong>Word:</strong> {error.word} <br />
                      <strong>Error:</strong> {error.error} <br />
                      <strong>Recommendation:</strong> {error.recommendation}
                    </li>
                  ))}
                </ul>
              ) : (
                <Typography>No pronunciation errors detected.</Typography>
              )}

              <Typography variant="subtitle1">Grammar Errors:</Typography>
              {feedback.grammarErrors && feedback.grammarErrors.length > 0 ? (
                <ul>
                  {feedback.grammarErrors.map((error, index) => (
                    <li key={index}>
                      <strong>Sentence:</strong> {error.sentence} <br />
                      <strong>Error:</strong> {error.error} <br />
                      <strong>Recommendation:</strong> {error.recommendation}
                    </li>
                  ))}
                </ul>
              ) : (
                <Typography>No grammar errors detected.</Typography>
              )}

              <Typography variant="subtitle1">Vocabulary Errors:</Typography>
              {feedback.vocabularyErrors &&
              feedback.vocabularyErrors.length > 0 ? (
                <ul>
                  {feedback.vocabularyErrors.map((error, index) => (
                    <li key={index}>
                      <strong>Word:</strong> {error.word} <br />
                      <strong>Error:</strong> {error.error} <br />
                      <strong>Recommendation:</strong> {error.recommendation}
                    </li>
                  ))}
                </ul>
              ) : (
                <Typography>No vocabulary errors detected.</Typography>
              )}

              <Typography variant="subtitle1">Overall Feedback:</Typography>
              <Typography>{feedback.overallFeedback}</Typography>
            </Paper>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
}

export default SpeakingTask;
