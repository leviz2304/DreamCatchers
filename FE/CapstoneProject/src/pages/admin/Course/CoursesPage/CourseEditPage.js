import React, { useEffect, useState } from "react";
import { getCourseById, updateCourse } from "../../../../api/apiService/dataService";
import { useParams, useNavigate } from "react-router-dom";
import CourseForm from "../../../../component/Course/CourseForm";

const CourseEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCourse = async () => {
    try {
      const res = await getCourseById(id);
      setCourseData(res);
    } catch (error) {
      console.error(error);
      alert("Không tìm thấy khóa học");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const handleUpdate = async (updatedData) => {
    try {
      await updateCourse(id, updatedData);
      alert("Cập nhật khóa học thành công");
      navigate("/admin/courses");
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra khi cập nhật");
    }
  };

  if (loading) {
    return <p>Đang tải...</p>;
  }

  return (
    <div className="p-4 mt-12">
      <h1 className="text-xl font-bold mb-4">Chỉnh sửa khoá học</h1>
      {courseData && <CourseForm initialData={courseData} onSubmit={handleUpdate} />}
    </div>
  );
};

export default CourseEditPage;
