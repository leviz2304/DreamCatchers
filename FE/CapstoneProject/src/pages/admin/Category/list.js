import React, { useEffect, useState } from "react";
import { getCategories, hardDeleteCategory } from "../../../api/apiService/dataService";
import { useNavigate } from "react-router-dom";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await getCategories(searchName);
      // Giả sử res.data = { content: [...]} nếu backend trả về dạng page
      const data = res.content;
      setCategories(data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, [searchName]);

  const handleDelete = async (id) => {
    if (window.confirm("Bạn chắc chắn muốn xóa category này?")) {
      try {
        await hardDeleteCategory(id);
        fetchCategories();
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="p-4 mt-12">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Danh sách Category</h1>
        <button
          onClick={() => navigate('/admin/category/create')}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Thêm Category
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên"
          className="border border-gray-300 px-2 py-1"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
      </div>

      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border-b py-2">ID</th>
              <th className="border-b py-2">Tên</th>
              <th className="border-b py-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id}>
                <td className="border-b py-2">{cat.id}</td>
                <td className="border-b py-2">{cat.name}</td>
                <td className="border-b py-2">
                  <button
                    className="text-blue-500 mr-2"
                    onClick={() => navigate(`/admin/category/edit/${cat.id}`)}
                  >
                    Sửa
                  </button>
                  <button
                    className="text-red-500"
                    onClick={() => handleDelete(cat.id)}
                  >
                    Xóa
                  </button>
                  {/* Nếu có nút xem chi tiết: 
                  <button className="text-green-500 ml-2"
                    onClick={() => navigate(`/admin/category/detail/${cat.id}`)}>
                    Chi tiết
                  </button>
                  */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CategoryList;
