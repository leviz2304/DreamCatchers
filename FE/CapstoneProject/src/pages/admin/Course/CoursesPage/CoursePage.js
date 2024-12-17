import React, { useState, useEffect } from "react";
import { getCourses, deleteCourse } from "../../../../api/apiService/dataService";
import { useNavigate } from "react-router-dom";

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await getCourses(searchTitle);
      // Giả sử BE trả về dữ liệu dạng {content: [...]}  
      // Nếu BE trả về trực tiếp mảng, bạn tùy chỉnh:
      const data = res;
      const coursesData = data.content || data;
      setCourses(coursesData);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCourses();
  }, [searchTitle]);

  const handleDelete = async (id) => {
    if (window.confirm("Bạn chắc chắn xóa khóa học này?")) {
      try {
        await deleteCourse(id);
        fetchCourses();
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="p-4 mt-12">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Danh sách khóa học</h1>
        <button
          onClick={() => navigate('/admin/courses/create')}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Thêm khoá học
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm theo tiêu đề"
          className="border border-gray-300 px-2 py-1"
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
        />
      </div>

      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border-b py-2">ID</th>
              <th className="border-b py-2">Tiêu đề</th>
              <th className="border-b py-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id}>
                <td className="border-b py-2">{course.id}</td>
                <td className="border-b py-2">{course.title}</td>
                <td className="border-b py-2">
                  <button
                    className="text-blue-500 mr-2"
                    onClick={() => navigate(`/admin/courses/${course.id}/edit`)}
                  >
                    Sửa
                  </button>
                  <button
                    className="text-red-500"
                    onClick={() => handleDelete(course.id)}
                  >
                    Xoá
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CoursesPage;
