import React, { useState } from "react";
import { createCategory } from "../../../api/apiService/dataService";
import { useNavigate } from "react-router-dom";

const CategoryCreate = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createCategory({ name });
      alert("Tạo category thành công");
      navigate("/admin/category/list");
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra khi tạo category");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Tạo Category</h1>
      <form onSubmit={handleCreate} className="space-y-4">
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

export default CategoryCreate;
