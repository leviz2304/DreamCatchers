import React, { useEffect, useState } from "react";
import { getCategoryById, updateCategory } from "../../../api/apiService/dataService";
import { useParams, useNavigate } from "react-router-dom";

const CategoryEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchCategory = async () => {
    try {
      const res = await getCategoryById(id);
      setName(res.data.name);
    } catch (error) {
      console.error(error);
      alert("Không tìm thấy category");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategory();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateCategory(id, { name });
      alert("Cập nhật category thành công");
      navigate("/admin/category/list");
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra khi cập nhật");
    }
  };

  if (loading) return <p>Đang tải...</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Chỉnh sửa Category</h1>
      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block font-semibold">Tên Category</label>
          <input
            type="text"
            className="border w-full px-2 py-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          Lưu
        </button>
      </form>
    </div>
  );
};

export default CategoryEdit;
