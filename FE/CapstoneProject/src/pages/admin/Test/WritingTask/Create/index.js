import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createWritingTask, getWritingTaskById, updateWritingTask } from "../../../../../api/apiService/dataService";

export default function WritingTaskForm({ isEdit }) {
    const [form, setForm] = useState({ title: "", prompt: "", taskType: "TASK1" });
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (isEdit && id) {
            fetchTask();
        }
    }, [isEdit, id]);

    const fetchTask = async () => {
        try {
            const response = await getWritingTaskById(id);
            setForm(response.content);
        } catch (error) {
            console.error("Error fetching task:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEdit) {
                await updateWritingTask(id, form);
            } else {
                await createWritingTask(form);
            }
            navigate("/admin/writing-task/list");
        } catch (error) {
            console.error("Error submitting task:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-semibold mb-6">{isEdit ? "Edit" : "Create"} Writing Task</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prompt</label>
                    <textarea
                        name="prompt"
                        value={form.prompt}
                        onChange={handleChange}
                        required
                        rows="5"
                        className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                    ></textarea>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Task Type</label>
                    <select
                        name="taskType"
                        value={form.taskType}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                    >
                        <option value="TASK1">Task 1</option>
                        <option value="TASK2">Task 2</option>
                    </select>
                </div>
                <div className="flex items-center">
                    <button
                        type="submit"
                        className="mr-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        {isEdit ? "Update" : "Create"}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/admin/writing-task/list")}
                        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
