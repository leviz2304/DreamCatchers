// src/components/SpeakingDashboard.js

import React, { useEffect, useState } from "react";
import * as dataApi from "../../../../api/apiService/dataService";
import { toast } from "sonner";
import {
    TextField,
    Button,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Paper,
    Typography,
    Grid,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon, Add as AddIcon } from "@mui/icons-material";

function SpeakingDashboard() {
    const [topics, setTopics] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
    const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
    const [currentTopic, setCurrentTopic] = useState({ id: null, name: "" });
    const [currentQuestion, setCurrentQuestion] = useState({ id: null, questionText: "" });

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

    const handleOpenTopicModal = (topic = { id: null, name: "" }) => {
        setCurrentTopic(topic);
        setIsTopicModalOpen(true);
    };

    const handleCloseTopicModal = () => {
        setIsTopicModalOpen(false);
        setCurrentTopic({ id: null, name: "" });
    };

    const handleSaveTopic = async () => {
        if (currentTopic.id) {
            // Update topic
            try {
                await dataApi.updateSpeakingTopic(currentTopic.id, currentTopic);
                toast.success("Speaking topic updated successfully.");
                fetchTopics();
            } catch (error) {
                toast.error("Failed to update speaking topic.");
            }
        } else {
            // Create topic
            try {
                await dataApi.createSpeakingTopic(currentTopic);
                toast.success("Speaking topic created successfully.");
                fetchTopics();
            } catch (error) {
                toast.error("Failed to create speaking topic.");
            }
        }
        handleCloseTopicModal();
    };

    const handleDeleteTopic = async (id) => {
        if (window.confirm("Are you sure you want to delete this topic?")) {
            try {
                await dataApi.deleteSpeakingTopic(id);
                toast.success("Speaking topic deleted successfully.");
                fetchTopics();
                if (selectedTopic && selectedTopic.id === id) {
                    setSelectedTopic(null);
                    setQuestions([]);
                }
            } catch (error) {
                toast.error("Failed to delete speaking topic.");
            }
        }
    };

    const handleSelectTopic = async (topic) => {
        setSelectedTopic(topic);
        fetchQuestions(topic.id);
    };

    const fetchQuestions = async (topicId) => {
        try {
            const res = await dataApi.getAllQuestionsByTopic(topicId);
            setQuestions(res.content);
        } catch (error) {
            toast.error("Failed to fetch questions for the selected topic.");
        }
    };

    const handleOpenQuestionModal = (question = { id: null, questionText: "" }) => {
        setCurrentQuestion(question);
        setIsQuestionModalOpen(true);
    };

    const handleCloseQuestionModal = () => {
        setIsQuestionModalOpen(false);
        setCurrentQuestion({ id: null, questionText: "" });
    };

    const handleSaveQuestion = async () => {
        if (currentQuestion.id) {
            // Update question
            try {
                await dataApi.updateSpeakingQuestion(currentQuestion.id, currentQuestion);
                toast.success("Speaking question updated successfully.");
                fetchQuestions(selectedTopic.id);
            } catch (error) {
                toast.error("Failed to update speaking question.");
            }
        } else {
            // Create question
            try {
                await dataApi.createSpeakingQuestion(selectedTopic.id, currentQuestion);
                toast.success("Speaking question created successfully.");
                fetchQuestions(selectedTopic.id);
            } catch (error) {
                toast.error("Failed to create speaking question.");
            }
        }
        handleCloseQuestionModal();
    };

    const handleDeleteQuestion = async (id) => {
        if (window.confirm("Are you sure you want to delete this question?")) {
            try {
                await dataApi.deleteSpeakingQuestion(id);
                toast.success("Speaking question deleted successfully.");
                fetchQuestions(selectedTopic.id);
            } catch (error) {
                toast.error("Failed to delete speaking question.");
            }
        }
    };

    return (
        <Grid container spacing={4} padding={4}>
            {/* Topics Section */}
            <Grid item xs={12} md={6}>
                <Paper elevation={3} style={{ padding: "20px" }}>
                    <Typography variant="h5" gutterBottom>
                        Speaking Topics
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenTopicModal()}
                        style={{ marginBottom: "20px" }}
                    >
                        Add Topic
                    </Button>
                    {topics.map((topic) => (
                        <Grid container alignItems="center" key={topic.id} style={{ marginBottom: "10px" }}>
                            <Grid item xs={8}>
                                <Typography variant="subtitle1">{topic.name}</Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <IconButton onClick={() => handleOpenTopicModal(topic)}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton onClick={() => handleDeleteTopic(topic.id)}>
                                    <DeleteIcon />
                                </IconButton>
                                <Button onClick={() => handleSelectTopic(topic)} color="secondary">
                                    Select
                                </Button>
                            </Grid>
                        </Grid>
                    ))}
                </Paper>
            </Grid>

            {/* Questions Section */}
            <Grid item xs={12} md={6}>
                {selectedTopic ? (
                    <Paper elevation={3} style={{ padding: "20px" }}>
                        <Typography variant="h5" gutterBottom>
                            Questions for "{selectedTopic.name}"
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={() => handleOpenQuestionModal()}
                            style={{ marginBottom: "20px" }}
                        >
                            Add Question
                        </Button>
                        {questions.map((question) => (
                            <Grid container alignItems="center" key={question.id} style={{ marginBottom: "10px" }}>
                                <Grid item xs={8}>
                                    <Typography variant="subtitle1">{question.questionText}</Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <IconButton onClick={() => handleOpenQuestionModal(question)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDeleteQuestion(question.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        ))}
                    </Paper>
                ) : (
                    <Paper elevation={3} style={{ padding: "20px", textAlign: "center" }}>
                        <Typography variant="h6">Select a topic to view questions.</Typography>
                    </Paper>
                )}
            </Grid>

            {/* Modals */}
            {/* Topic Modal */}
            <Dialog open={isTopicModalOpen} onClose={handleCloseTopicModal}>
                <DialogTitle>{currentTopic.id ? "Edit Topic" : "Add Topic"}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Topic Name"
                        type="text"
                        fullWidth
                        value={currentTopic.name}
                        onChange={(e) => setCurrentTopic({ ...currentTopic, name: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseTopicModal} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleSaveTopic} color="primary">
                        {currentTopic.id ? "Update" : "Create"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Question Modal */}
            <Dialog open={isQuestionModalOpen} onClose={handleCloseQuestionModal}>
                <DialogTitle>{currentQuestion.id ? "Edit Question" : "Add Question"}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Question Text"
                        type="text"
                        fullWidth
                        multiline
                        rows={4}
                        value={currentQuestion.questionText}
                        onChange={(e) => setCurrentQuestion({ ...currentQuestion, questionText: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseQuestionModal} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleSaveQuestion} color="primary">
                        {currentQuestion.id ? "Update" : "Create"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid>
    )
    }

    export default SpeakingDashboard;
