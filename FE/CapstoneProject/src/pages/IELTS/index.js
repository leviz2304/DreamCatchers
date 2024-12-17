import React, { useEffect, useState, useRef, useCallback } from "react";
import * as dataApi from "../../api/apiService/dataService";
import banner from "../../assets/images/teach-screen-student.avif";
import { toast } from "sonner";
import { ChatBubbleOutline, QuestionMark } from "@mui/icons-material"; // Alternatively, consider using another icon library like Heroicons for better Tailwind integration
import { useNavigate } from "react-router-dom";

function SpeakingTopics() {
    const [topics, setTopics] = useState([]);
    const [questionsByTopic, setQuestionsByTopic] = useState({});
    const [originalQuestions, setOriginalQuestions] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const topicRefs = useRef({});
    const searchTimeout = useRef(null);
    const navigate = useNavigate();

    const handleQuestionClick = (questionId) => {
        navigate(`/speaking-task/${questionId}`);
    };
    
    // Fetch topics and their questions on component mount
    useEffect(() => {
        fetchTopics();
    }, []);

    // Function to fetch all speaking topics
    const fetchTopics = async () => {
        try {
            const res = await dataApi.getAllSpeakingTopics();
            setTopics(res);
            const refs = {};
            res.forEach((topic) => {
                refs[topic.id] = React.createRef();
            });
            topicRefs.current = refs;
            // Fetch questions for all topics in parallel to improve performance
            const questionsPromises = res.map((topic) => fetchQuestions(topic.id));
            const questionsResults = await Promise.all(questionsPromises);

            const questions = {};
            const original = {};
            res.forEach((topic, index) => {
                questions[topic.id] = questionsResults[index];
                original[topic.id] = questionsResults[index];
            });
            setQuestionsByTopic(questions);
            setOriginalQuestions(original);
        } catch (error) {
            toast.error("Không thể tải các chủ đề nói.");
        }
    };

    // Function to fetch questions for a specific topic
    const fetchQuestions = async (topicId) => {
        try {
            const res = await dataApi.getAllQuestionsByTopic(topicId);
            console.log(res)
            return res.content;
        } catch (error) {
            toast.error(`Không thể tải các câu hỏi cho chủ đề này.`);
            return [];
        }
    };

    // Handle search input with debounce to optimize performance
    const handleSearch = (search) => {
        setSearchTerm(search);

        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
        }

        searchTimeout.current = setTimeout(() => {
            if (search.trim() === "") {
                // If search is empty, reset to original questions
                setQuestionsByTopic(originalQuestions);
                return;
            }

            // Filter questions based on search term
            const filteredQuestions = {};
            Object.keys(originalQuestions).forEach((topicId) => {
                filteredQuestions[topicId] = originalQuestions[topicId].filter((question) =>
                    question.questionText.toLowerCase().includes(search.toLowerCase())
                );
            });
            setQuestionsByTopic(filteredQuestions);
        }, 300); // Debounce delay of 300ms
    };

    // Handle smooth scrolling to a specific topic section
    const handleScrollToTopic = useCallback((topicId) => {
        topicRefs.current[topicId]?.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    }, []);

    return (
        <div className="bg-white shadow-md rounded-md p-5">
            {/* Header Section */}
            <div className="w-full h-72 flex items-center justify-center">
                <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8">
                    <div className="space-y-4">
                        <h2 className="font-semibold text-2xl">Luyện theo câu - Part 1</h2>
                        <p className="text-gray-600 text-lg">
                            Luyện trả lời câu hỏi bất kỳ, nhận phản hồi, điểm số và hướng dẫn cải thiện tức thì.
                        </p>
                    </div>
                    <div className="flex justify-center md:justify-end">
                        <img
                            src={banner}
                            alt="Luyện theo câu"
                            className="w-72 h-72 object-cover"
                        />
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="my-4">
                <input
                    type="text"
                    placeholder="Tìm câu hỏi"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
            </div>

            {/* Topics Scrollable Bar */}
            <div className="w-full overflow-x-auto whitespace-nowrap border-b pb-2 mb-6">
                <div className="flex space-x-6 px-4">
                    {topics.map((topic) => (
                        <button
                            key={topic.id}
                            className="text-sm font-medium text-gray-700 hover:text-blue-600 focus:outline-none"
                            onClick={() => handleScrollToTopic(topic.id)}
                        >
                            {topic.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Topics and Questions */}
            {topics.map((topic) => (
                <div
                    key={topic.id}
                    ref={topicRefs.current[topic.id]}
                    className="mb-10"
                >
                    {/* Topic Header */}
                    <div className="flex items-center pb-4">
                        <ChatBubbleOutline className="mr-2 text-gray-500" />
                        <h5 className="text-xl font-semibold">{topic.name}</h5>
                    </div>

                    {/* Questions Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {questionsByTopic[topic.id]?.length > 0 ? (
                            questionsByTopic[topic.id].map((question) => (
                                <div
                                    key={question.id}
                                    onClick={() => handleQuestionClick(question.id)}
                                    className="relative group p-6 flex flex-col justify-between border border-gray-300 rounded-lg hover:bg-gray-100 transition duration-300"
                                >
                                    <div className="flex items-center mb-4">
                                        <QuestionMark className="text-blue-500 mr-2" />
                                        <h6 className="font-semibold text-lg break-words">
                                            {question.questionText}
                                        </h6>
                                    </div>
                                    <p className="mt-2 text-gray-600 break-words">
                                        {question.translation}
                                    </p>

                                    {/* Hover Button */}
                                    <div className="absolute bottom-4 left-0 right-0 opacity-0 group-hover:opacity-100 transition duration-300 flex justify-center">
                                        <button
                                            className="bg-purple-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-purple-700 transition duration-300"
                                        >
                                            Nhấn để nói và nhận phản hồi
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">Không tìm thấy câu hỏi phù hợp.</p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default SpeakingTopics;
