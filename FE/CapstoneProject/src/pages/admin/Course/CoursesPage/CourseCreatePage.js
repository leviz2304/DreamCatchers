import React from "react";
import { createCourse } from "../../../../api/apiService/dataService";
import { useNavigate } from "react-router-dom";
import CourseForm from "../../../../component/Course/CourseForm";

const CourseCreatePage = () => {
  const navigate = useNavigate();

  const handleCreate = async (courseDTO) => {
    try {
      await createCourse(courseDTO);
      alert("Tạo khóa học thành công");
      navigate("/admin/courses");
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra");
    }
  };

  return (
    <div className="p-4 mt-12">
      <h1 className="text-xl font-bold mb-4">Tạo khoá học</h1>
      <CourseForm onSubmit={handleCreate} />
    </div>
  );
};

export default CourseCreatePage;
