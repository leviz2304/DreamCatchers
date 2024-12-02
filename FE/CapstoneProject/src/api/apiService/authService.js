import publicInstance, { userInstance } from "../instance";
import axios from "axios";
import instance, { privateInstance } from "../instance";
export const enrollCourse = async (enrollDTO) => {
    try {
        return await userInstance.post("/enroll/course", enrollDTO);
    } catch (error) {
        return Promise.reject(error);
    }
};
export const register = async ({
    firstName,
    lastName,
    email,
    password,
    otp,
}) => {
    try {
        const res = await instance.post(
            "/user/register",
            {
                firstName,
                lastName,
                email,
                password,
            },
            {
                "content-type": "application/json",
            }
        );
        return res;
    } catch (error) {
        return Promise.reject(error);
    }
};

export const login = async ({ email, password }) => {
    try {
        const res = await instance.post(
            "/user/login",
            {
                email,
                password,
            },
            { "content-type": "application/json" }
        );

        return res;
    } catch (error) {
        return Promise.reject(error);
    }
};
export const updateLessonProgress = async (userId, lessonId, progressPercentage) => {
    try {
      return await privateInstance.post(`/lesson/progress`, {
        userId,
        lessonId,
        progressPercentage,
      });
    } catch (error) {
      return Promise.reject(error);
    }
  };
  export const fetchInstructors = async (userId) => {
    try {
        console.log("User ID passed to fetchInstructors:", userId);
        const url = `/instructor/${userId}`;
        console.log("API Call URL:", url);
        const response = await privateInstance.get(url);
        return response; 
    } catch (error) {
        return Promise.reject(error);
    }
};

  // Get user progress for a course

export const sendMail = async (email) => {
    try {
        const res = await instance.post(
            "/user/send-verify-email",
            {
                email,
            },
            {
                "content-type": "application/json",
            }
        );
        return res;
    } catch (error) {
        return Promise.reject(error);
    }
};

export const sendResetPasswordEmail = async (email) => {
    try {
        return await instance.post(
            "/user/send-reset-password-email",
            { email },
            { "content-type": "application/json" }
        );
    } catch (error) {
        return Promise.reject(error);
    }
};

export const validateCode = async ({ email, code }) => {
    try {
        return await instance.post(
            "/user/verify-reset-password-code",
            {
                email,
                code,
            },
            { "content-type": "application/json" }
        );
    } catch (error) {}
};

export const resetPassword = async ({ email, password }) => {
    try {
        return await publicInstance.post(`/user/reset-password`, {
            password,
            email,
        });
    } catch (error) {
        return Promise.reject(error);
    }
};
export const resetPasswordByEmail = async (password, email) => {
    try {
        return await privateInstance.put(
            `/user/resetPassword/${email}`,
            {
                newPassword: password,
                email: email,
            },
            {
                "content-type": "application/json",
            }
        );
    } catch (error) {
        return Promise.reject(error);
    }
};
export const getAllUser = async () => {
    try {
        return await privateInstance.get("/user/getAll?page=0&size=5");
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getAllDeletedUser = async () => {
    try {
        return await privateInstance.get("/user/getAllDeleted?page=0&size=5");
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getAllRole = async () => {
    try {
        return await privateInstance.get("/user/getAllRole");
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getUserByName = async (userName, page, size, isDelete = false) => {
    try {
        return privateInstance.get(
            `/user/search?name=${userName}&isDeleted=${isDelete}&page=${page}&size=${size}`
        );
    } catch (error) {
        Promise.reject(error);
    }
};

export const getUserByRole = async(role, page, size) => {
    try {
        const result= await privateInstance.get(
            `/user/filter?role=${role}&page=${page}&size=${size}`);
        return result.content;

    } catch (error) {
        Promise.reject(error);
    }
};
export const getAllUsers = (page, size) => {
    try {
        return privateInstance.get(
            `/user/getAll&page=${page}&size=${size}`
        );
    } catch (error) {
        Promise.reject(error);
    }
};

export const getUserByPage = async (page, size) => {
    try {
        return privateInstance.get(`/user/getAll?page=${page}&size=${size}`);
    } catch (error) {
        Promise.reject(error);
    }
};

export const softDeleteUser = async (id) => {
    try {
        const result = await privateInstance.put(`/user/delete/soft/${id}`);
        return result;
    } catch (error) {
        return Promise.reject(error);
    }
};
export const hardDeleteUser = async (id) => {
    try {
        const result = await privateInstance.delete(`/user/delete/hard/${id}`);
        return result;
    } catch (error) {
        return Promise.reject(error);
    }
};

export const restoreUserById = async (id) => {
    try {
        return privateInstance.put(`/user/restore/${id}`);
    } catch (error) {
        Promise.reject(error);
    }
};

export const getAdminDashBoard = async () => {
    try {
        return privateInstance.get("/user");
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getUserInfo = async () => {
    try {
        return userInstance.get("/username");
    } catch (error) {
        return Promise.reject(error);
    }
};

export const logout = async () => {
    try {
        return userInstance.post("/logout");
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getUserByEmail = async (email) => {
    try {
        return userInstance.get(`${email}`);
    } catch (error) {
        Promise.reject(error);
    }
};

export const updateProfile = async (formData) => {
    try {
        return await userInstance.put("/update", formData, {
            headers: {
                // No need to set Content-Type when using FormData; Axios sets it automatically
            },
        });
    } catch (error) {
        return Promise.reject(error);
    }
};


export const updatePassword = async (passwords) => {
    try {
        return await userInstance.put("/update/password", passwords);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getProgress = async (alias, courseId) => {
    try {
        return await userInstance.get(`/${alias}/progress/${courseId}`);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const updateLessonIds = async (alias, courseId, lessonIds) => {
    try {
        return await userInstance.put(
            `/${alias}/progress/${courseId}/updateLessonIds`,
            lessonIds
        );
    } catch (error) {
        return Promise.reject(error.response.data);
    }
};

export const getAllNotification = async (email) => {
    try {
        return await userInstance.get(
            `/${encodeURIComponent(email)}/notification/getAll`
        );
    } catch (error) {
        return Promise.reject(error);
    }
};

export const readNotification = async (email, id) => {
    if (email.includes("@")) {
        email = email.substring(0, email.lastIndexOf("@"));
    }
    try {
        return await userInstance.put(`${email}/notification/read/${id}`);
    } catch (error) {
        return Promise.reject(error);
    }
};
export const readAllNotifications = async (email) => {
    if (email.includes("@")) {
        email = email.substring(0, email.lastIndexOf("@"));
    }
    try {
        return await userInstance.put(`${email}/notification/readAll`);
    } catch (error) {
        return Promise.reject(error);
    }
};
export const removeAllNotifications = async (email) => {
    if (email.includes("@")) {
        email = email.substring(0, email.lastIndexOf("@"));
    }
    try {
        return await userInstance.delete(`${email}/notification/removeAll`);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getPaymentVNPAY = async ({ method, email, courseId }) => {
    try {
        return await userInstance.get(
            `create_payment/${method}/${email}/${courseId}`
        );
    } catch (error) {
        return Promise.reject(error);
    }
};
export const getUserProgressForCourse = async (userId, courseId) => {
    try {
      return await privateInstance.get(`/lesson/course/${courseId}/progress/${userId}`);
    } catch (error) {
      return Promise.reject(error);
    }
  };
  export const checkUserEnrollment = async (courseId, userId) => {
    try {
      const response = await privateInstance.get(`/course/${courseId}/is-enrolled`, {
        params: { userId },
      });
      return response;
    } catch (error) {
      return Promise.reject(error.response ? error.response.data : error);
    }
  };
export const getListCourse = async (email) => {
    try {
        return await userInstance.get(`/course/getAll/${email}`);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const removeCommentById = async (email, cmtId) => {
    try {
        return await userInstance.delete(
            `/${encodeURIComponent(email)}/comment/delete/${cmtId}`
        );
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getAllUserAndRole = async (isDelete = "false") => {
    try {
        return await privateInstance.get(
            `/user/getAllUserAndRole?isDeleted=${isDelete}`
        );
    } catch (error) {
        return Promise.reject(error);
    }
};

export const createPost = async (post) => {
    try {
        return await userInstance.post("/post/create", post);
    } catch (error) {
        return Promise.reject(error);
    }
};
