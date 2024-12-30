import publicInstance, { privateInstance } from "../instance";
import { userInstance } from "../instance";

export const getAllCategories = async (page = 0, size = 9999999) => {
    try {
        const res = await publicInstance.get(
            `/category/getAll?page=${page}&size=${size}`
        );
        return res;
    } catch (error) {
        return Promise.reject(error);
    }
};
export const getAllWritingTasks = async () => {
    try {
        const res= await privateInstance.get(`/writing/tasks`);
        return res;
    } catch (error) {
        return Promise.reject(error);
    }
};
;

export const getWritingTaskById = async (id) => {
    try {
        return await privateInstance.get(`/writing/${id}`);
    } catch (error) {
        return Promise.reject(error);
    }
};
export const submitEssay = async ({ userId, writingTaskId, essayContent }) => {
    try {
        const response = await privateInstance.post("/writing/submit", {
            userId,
            writingTaskId,
            essayContent,
        });
        console.log("api"+response)
        return response;
    } catch (error) {
        console.error("Error submitting essay:", error);
        throw error;
    }
};
export const getSubmissionHistory = async (userId) => {
    try {
        const response = await privateInstance.get(`/writing/essays/${userId}`);
        return response.data.map(essay => ({
            ...essay,
            feedback: JSON.parse(essay.feedbackJson)
        }));
    } catch (error) {
        console.error("Error fetching submission history:", error);
        throw error;
    }
};
export const createWritingTask = async (task) => {
    try {
        return await privateInstance.post(`/writing/tasks`, task);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const updateWritingTask = async (id, task) => {
    try {
        return await privateInstance.put(`/writing/update/${id}`, task);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const deleteWritingTask = async (id) => {
    try {
        return await privateInstance.delete(`/writing/delete/${id}`);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getAllCategoryDeleted = async (page, size) => {
    try {
        const res = await privateInstance.get(
            `/category/getAllDeleted?page=${page}&size=${size}`
        );
        return res;
    } catch (error) {
        return Promise.reject(error);
    }
};

export const fetchInstructors = async (userId) => {
    return await privateInstance.get(`chat/instructors/${userId}`);
};

export const fetchStudents = async (tutorId) => {
    return await privateInstance.get(`chat/students/${tutorId}`);
};

// Lấy conversation giữa userId và contactId cho 1 khóa học (courseId)
export const getConversation = async (userId, contactId, courseId) => {
    return await privateInstance.get(`/messages/${userId}/${contactId}?courseId=${courseId}`);
};

export const getRecentComments = async (limit = 2) => {
    const response = await privateInstance.get(`/dashboard/comments?limit=${limit}`);
    return response;
};
export const getAdminStatistics = async () => {
    return await privateInstance.get("/dashboard/stats");
};
export const getAdminEssayStatistics = async () => {
    const response = await privateInstance.get(`/dashboard/essays/statistics`);
    return response;
};

export const getAllEssays = async () => {
    const response = await privateInstance.get(`/dashboard/essays`);
    return response;
};
// src/api/apiService.js
export const generateVocabularySet = async (topic, quantity, level) => {
    try {
        const response = await privateInstance.post('/vocabulary-generation/generate', null, {
            params: { topic, quantity, level },
        });
        return response;
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getVocabularySets = async () => {
    try {
        const response = await privateInstance.get('/vocabulary-generation/sets');
        return response;
    } catch (error) {
        return Promise.reject(error);
    }
};
// src/api/apiService.js
export const updateVocabularySet = async (setId, setData) => {
    try {
        const response = await privateInstance.put(`/vocabulary-generation/sets/${setId}`, setData);
        return response;
    } catch (error) {
        return Promise.reject(error);
    }
};
export const createSpeakingTopic = async (topic) => {
    try {
        const response = await privateInstance.post("/speaking/topics", topic);
        return response;
    } catch (error) {
        return Promise.reject(error.response.data);
    }
};

export const updateSpeakingTopic = async (id, topic) => {
    try {
        const response = await privateInstance.put(`/speaking/topics/${id}`, topic);
        return response;
    } catch (error) {
        return Promise.reject(error.response.data);
    }
};

export const deleteSpeakingTopic = async (id) => {
    try {
        await privateInstance.delete(`/speaking/topics/${id}`);
    } catch (error) {
        return Promise.reject(error.response.data);
    }
};

export const getAllSpeakingTopics = async () => {
    try {
        const response = await privateInstance.get("/speaking/topics");
        return response.content;
    } catch (error) {
        return Promise.reject(error.response.data);
    }
};
// Trong apiService.js (File DataService.js bạn đang dùng)
export const getInstructorByCourseId = async (courseId) => {
    try {
        // Vì endpoint ở BE là /api/v1/public/course/{courseId}/instructor (public endpoint)
        const response = await publicInstance.get(`/course/${courseId}/instructor`);
        return response; // response đã được interceptors xử lý, trả về dữ liệu JSON
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getEssayHistory = async (page = 0, size = 10,userId) => {
    try {
        const response = await privateInstance.get(`/writing/essays/history?${userId}&page=${page}&size=${size}`);
        return response.content; // Assuming the backend returns a paginated response
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

export const getEssayById = async (essayId) => {
    try {
        const response = await privateInstance.get(`/writing/essays/${essayId}`);
        return response.content; // Assuming the backend returns the essay in 'content'
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

// CRUD for Speaking Questions
export const createSpeakingQuestion = async (topicId, question) => {
    try {
        const response = await privateInstance.post(`/speaking/topics/${topicId}/questions`, question);
        return response;
    } catch (error) {
        return Promise.reject(error.response.data);
    }
};

export const updateSpeakingQuestion = async (id, question) => {
    try {
        const response = await privateInstance.put(`/speaking/questions/${id}`, question);
        return response;
    } catch (error) {
        return Promise.reject(error.response.data);
    }
};

export const deleteSpeakingQuestion = async (id) => {
    try {
        await privateInstance.delete(`/speaking/questions/${id}`);
    } catch (error) {
        return Promise.reject(error.response.data);
    }
};
// Get question by ID

// Submit idea and get AI answer
export const getQuestionById = async (id) => {
    try {
        const response = await privateInstance.get(`/speaking/questions/${id}`);
        return response.content;
    } catch (error) {
        return Promise.reject(error);
    }
};
// pronunciation check:
export const uploadSentenceAudio = async (sentenceId, audioFile) => {
    try {
        const formData = new FormData();
        formData.append("audioFile", audioFile);

        const response = await privateInstance.post(`/pronunciation/sentences/${sentenceId}/upload-audio`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response; // Should return the updated SentenceDTO with audioUrl
    } catch (error) {
        console.error("Error uploading sentence audio:", error);
        return Promise.reject(error.response.data);
    }
};
export const getSentenceAudio = async (sentenceId) => {
    try {
        const response = await privateInstance.get(`/pronunciation/sentences/${sentenceId}/audio`);
        return response.audioUrl;
    } catch (error) {
        console.error("Error fetching sentence audio:", error);
        return Promise.reject(error.response.data);
    }
};
// src/api/apiService/dataService.js
export const getCommentsByCourseId = async (courseId) => {
    try {
        return await privateInstance.get(`/comments/course/${courseId}`);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const addComment = async (courseId, commentData) => {
    try {
        return await privateInstance.post(`/comments/course/${courseId}`, commentData);
    } catch (error) {
        return Promise.reject(error);
    }
};

// Nếu bạn muốn tách biệt API cho lesson comments, bạn có thể thêm thêm hàm tương tự
export const getCommentsByLessonId = async (lessonId) => {
    try {
        return await publicInstance.get(`/lesson/${lessonId}/comments`);
    } catch (error) {
        return Promise.reject(error);
    }
};
// ... Các import hiện tại
export const getSpeakingFeedbacks = async (userId) => {
    const res = await privateInstance.get(`/speaking/feedbacks/${userId}`);
    // res là mảng SpeakingFeedback
    return res; 
  };
export const analyzePronunciation = async ({ file, userId, sentenceId }) => {
    try {
        const formData = new FormData();
        formData.append("audioFile", file);
        formData.append("userId", userId);
        formData.append("sentenceId", sentenceId);

        const response = await privateInstance.post("/pronunciation/assess", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response;
    } catch (error) {
        console.error("Error analyzing pronunciation:", error);
        // Extract and return a meaningful error message if available
        if (error.response && error.response.data) {
            return Promise.reject(error.response.data);
        }
        return Promise.reject(error);
    }
};


export const createSentence = async (sentence) => {
    try {
        const response = await privateInstance.post("/pronunciation/sentences", sentence);
        return response;
    } catch (error) {
        return Promise.reject(error);
    }
};
export const getSentenceByTopicId = async (id) => {
    try {
        const response = await privateInstance.get(`/pronunciation/sentences?topicId=${id}`);
        return response;
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getSentenceById = async (id) => {
    try {
        const response = await privateInstance.get(`/pronunciation/sentences/${id}`);
        return response;
    } catch (error) {
        return Promise.reject(error);
    }
};

export const updateSentence = async (id, sentence) => {
    try {
        const response = await privateInstance.put(`/pronunciation/sentences/${id}`, sentence);
        return response;
    } catch (error) {
        return Promise.reject(error);
    }
};

export const deleteSentence = async (id) => {
    try {
        await privateInstance.delete(`/pronunciation/sentences/${id}`);
    } catch (error) {
        return Promise.reject(error);
    }
};
export const getPronunciationTopic = async () => {
    try {
        const response = await privateInstance.get("/pronunciation/topics");
        return response;
    } catch (error) {
        return Promise.reject(error);
    }
};
export const createPronunciationTopic = async (topic) => {
    try {
        const response = await privateInstance.post("/pronunciation/topics", topic);
        return response;
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getPronunciationTopicById = async (id) => {
    try {
        const response = await privateInstance.get(`/pronunciation/topics/${id}`);
        return response;
    } catch (error) {
        return Promise.reject(error);
    }
};

export const updatePronunciationTopic = async (id, topic) => {
    try {
        const response = await privateInstance.put(`/pronunciation/topics/${id}`, topic);
        return response;
    } catch (error) {
        return Promise.reject(error);
    }
};

export const deleteTopic = async (id) => {
    try {
        await privateInstance.delete(`/pronunciation/topics/${id}`);
    } catch (error) {
        return Promise.reject(error);
    }
};
// Gửi ý tưởng và nhận câu trả lời từ AI
export const generateAnswer = async (userId, questionId, userInput) => {
    try {
      const payload = {
        userId,
        questionId,
        userInput,
      };
      const response = await privateInstance.post(
        `/speaking/generate-answer`,
        payload
      );
      return response.content; // Trả về chuỗi văn bản
    } catch (error) {
      return Promise.reject(error);
    }
  };
export const getAllQuestionsByTopic = async (topicId) => {
    try {
        const response = await privateInstance.get(`/speaking/topics/${topicId}/questions`);
        return response;
    } catch (error) {
        return Promise.reject(error.response.data);
    }
};
////IELTS
export const getAllUserEssaysWithFeedback = async (userId) => {
    const res = await privateInstance.get(`/report/my-report?userId=${userId}`);
    return res; // Giả sử backend trả về ResponseObject {content: [...]}
  };
  
  // Generate common issues
  export const generateCommonIssues = async (userId) => {
    const res = await privateInstance.post(`/report/generate-common-issues?userId=${userId}`);
    return res; // Trả về CommonGrammarIssue object
  };
  
  // Lấy common issues mới nhất
  export const getLatestCommonIssues = async (userId) => {
    const res = await privateInstance.get(`/report/common-issues/latest?userId=${userId}`);
    return res; // JSON chứa "issues":[...]
  };

// Hàm upload video
export const uploadVideoFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await privateInstance.post("/media/upload-video", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  // Backend trả về ResponseObject {status, mess, content: {url, fileName}} 
  return res.content.url; // res đã được interceptors xử lý hay chưa?
  // Nếu interceptors đã xử lý, bạn có thể cần sửa:
  // Kiểm tra kết quả: Có thể res là:
  // {
  //   status: "OK",
  //   mess: "Video uploaded successfully",
  //   content: { url: "...", fileName: "..." }
  // }
  // Trong trường hợp này:
  return res.content.url;
};

// Hàm upload thumbnail
export const uploadImageFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await privateInstance.post("/media/upload-thumbnail", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  // Tương tự như trên:
  return res.content.url;
};

export const createCourse = (courseDTO) => {
    return privateInstance.post("/courses", courseDTO);
  };
  
  export const getCourseById = (id) => {
    return privateInstance.get(`/courses/${id}`);
  };
  
  export const updateCourse = (id, courseDTO) => {
    return privateInstance.put(`/courses/${id}`, courseDTO);
  };
  
  export const deleteCourse = (id) => {
    return privateInstance.delete(`/courses/${id}`);
  };
  
  export const getCourses = () => {
    return privateInstance.get(`/courses`);
  };
  
// Submit Speaking Response
export const submitSpeakingResponse = async (userId, questionId, audioBlob) => {
    try {
        const formData = new FormData();
        formData.append("audioFile", new File([audioBlob], "response.wav", { type: "audio/wav" }));
        formData.append("userId", userId);
        formData.append("questionId", questionId);

        const response = await privateInstance.post("/speaking/submit", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response;
    } catch (error) {
        return Promise.reject(error.response.data);
    }
};
export const getLessonsStatus = async (courseId, userId) => {
    const response = await privateInstance.get(`/course/${courseId}/lessons-status?userId=${userId}`);
    return response; // response.data = [{lessonId, lessonName, unlocked}, ...]
  };
  
  // Gọi API update progress
  export const updateLessonProgress = async (userId, lessonId, progress, courseId) => {
    const response = await privateInstance.post(
      `/course/${courseId}/lesson/${lessonId}/progress`,
      null,
      {
        params: {
          userId,
          progress
        }
      }
    );
    return response;
  };
export const enrollInCourse = async (courseId, userId) => {
    try {
        console.log("test"+userId)
        const response = await privateInstance.post(`/courses/${courseId}/enroll/${userId}`);
        return response;
    } catch (error) {
        throw error;
    }
};
export const checkEnrollment = async (courseId, userId) => {
    try {
        const response = await privateInstance.get(`/courses/${courseId}/enrollment-status?userId=${userId}`);
        return response; // { enrolled: true/false }
    } catch (error) {
        throw error;
    }
};
// Retrieve User Feedbacks
export const getUserSpeakingFeedbacks = async (userId) => {
    try {
        const response = await privateInstance.get(`/speaking/feedbacks/${userId}`);
        return response;
    } catch (error) {
        return Promise.reject(error.response.data);
    }
};
export const getVocabularySetById = async (setId) => {
    try {
        const response = await privateInstance.get(`/vocabulary-generation/sets/${setId}`);
        return response;
    } catch (error) {
        return Promise.reject(error);
    }
};

export const deleteVocabularySet = async (setId) => {
    try {
        await privateInstance.delete(`/vocabulary-generation/sets/${setId}`);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getUserIdByEmail = async (email) => {
    try {
        const response = await privateInstance.get(`/user/findIdByEmail?email=${encodeURIComponent(email)}`);
        console.log("api:+ "+response)
        return response;
    } catch (error) {
        return Promise.reject(error);
    }
};

  // Get user progress for a course
  

export const softDeleteCourse = async (id) => {
    try {
        const result = await privateInstance.put(`/course/delete/soft/${id}`);
        return result;
    } catch (error) {
        return Promise.reject(error);
    }
};
export const hardDeleteCourse = async (id) => {
    try {
        const result = await privateInstance.delete(
            `/course/delete/hard/${id}`
        );
        return result;
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getCoursesDeletedByCategory = (id, page, size) => {
    try {
        return privateInstance.get(
            `/course/deleted/category?id=${id}&page=${page}&size=${size}`
        );
    } catch (error) {
        Promise.reject(error);
    }
};
export const getCoursesByCategory = async (id, page, size) => {
    try {
        return await publicInstance.get(
            `/course/category?id=${id}&page=${page}&size=${size}`
        );
    } catch (error) {
        console.log(error.mess);
        Promise.reject(error);
    }
};

export const getCourseByName = async (
    title,
    page = 0,
    selected = 5,
    isDeleted = "false"
) => {
    try {
        return await privateInstance.get(
            `/course?title=${encodeURIComponent(
                title
            )}&isDeleted=${isDeleted}&page=${page}&selected=${selected}`
        );
    } catch (error) {
        Promise.reject(error.mess);
    }
};

export const getCategories = async () => {
    return privateInstance.get(`/categories`);
  };
  
  // Tạo mới category
  export const createCategory = async (categoryDTO) => {
    return privateInstance.post("/categories", categoryDTO);
  };
  
  // Lấy chi tiết 1 category
  export const getCategoryById = async (id) => {
    return publicInstance.get(`/categories/${id}`);
  };
  
  // Cập nhật category
  export const updateCategory = async (id, categoryDTO) => {
    return privateInstance.put(`/categories/${id}`, categoryDTO);
  };
  
  // Xóa category
  export const hardDeleteCategory = async (id) => {
    return privateInstance.delete(`/categories/delete/hard/${id}`);
  };

export const restoreCourseById = (id) => {
    try {
        return privateInstance.put(`/course/restore/${id}`);
    } catch (error) {
        Promise.reject(error);
    }
};

export const getComments = async (lessonId) => {
    try {
        return await publicInstance.get(`/lesson/${lessonId}/comments`);
    } catch (error) {
        console.log(error.status);
        return Promise.reject(error);
    }
};

export const getAllInvoice = async (page = 0, size = 5) => {
    try {
        return await privateInstance.get(
            `/invoice/getAll?page=${page}&size=${size}`
        );
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getInvoicesByDate = async (startDate, endDate, page, size) => {
    try {
        return await privateInstance.get(
            `/invoice/getByDate?start=${encodeURIComponent(
                startDate
            )}&end=${encodeURIComponent(endDate)}&page=${page}&size=${size}`
        );
    } catch (error) {
        return Promise.reject(error);
    }
};

export const softDeleteInvoice = async (id) => {
    try {
        return await privateInstance.put(`/invoice/delete/soft/${id}`);
    } catch (error) {
        return Promise.reject(error);
    }
};
export const getAllInvoiceByPage = async (page, size) => {
    try {
        return await privateInstance.get(
            `/invoice/getAll?page=${page}&size=${size}`
        );
    } catch (error) {
        return Promise.reject(error);
    }
};

export const searchInvoice = async (search, page, size) => {
    try {
        return await privateInstance.get(
            `/invoice/search?name=${search}&page=${page}&size=${size}`
        );
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getAllInvoiceDelete = async (page = 0, size = 5) => {
    try {
        return await privateInstance.get(`/invoice/getAllDeleted`);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const restoreInvoieById = async (id) => {
    try {
        return await privateInstance.put(`/invoice/restore/${id}`);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getMonthlyStatistic = async (month, year, page = 0, size = 5) => {
    try {
        return await privateInstance.get(
            `/statistic?month=${month}&year=${year}&page=${page}&size=${size}`
        );
    } catch (error) {
        return Promise.reject(error);
    }
};

export const uploadImg = async (img) => {
    try {
        const formData = new FormData();
        formData.append("file", img);
        return await publicInstance.postForm("/upload/img", formData);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getPosts = async (page = "0", size = "5") => {
    try {
        return await publicInstance.get(`/post?page=${page}&size=${size}`);
    } catch (error) {
        return Promise.reject(error);
    }
};
