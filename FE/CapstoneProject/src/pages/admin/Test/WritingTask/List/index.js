import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllWritingTasks, deleteWritingTask } from "../../../../../api/apiService/dataService";

export default function WritingTaskList() {
    const [tasks, setTasks] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await getAllWritingTasks();
            setTasks(response);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this task?")) {
            await deleteWritingTask(id);
            fetchTasks();
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-semibold mb-6">Writing Tasks</h1>
            <button
                onClick={() => navigate("/admin/writing-task/create")}
                className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                Create New Task
            </button>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow rounded-lg">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b text-left">ID</th>
                            <th className="py-2 px-4 border-b text-left">Title</th>
                            <th className="py-2 px-4 border-b text-left">Prompt</th>
                            <th className="py-2 px-4 border-b text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map((task) => (
                            <tr key={task.id} className="hover:bg-gray-100">
                                <td className="py-2 px-4 border-b">{task.id}</td>
                                <td className="py-2 px-4 border-b">{task.title}</td>
                                <td className="py-2 px-4 border-b">{task.prompt}</td>
                                <td className="py-2 px-4 border-b">
                                    <button
                                        onClick={() => navigate(`/admin/writing-task/edit/${task.id}`)}
                                        className="mr-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(task.id)}
                                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
