import React, { useEffect, useState } from "react";
import { getAllEssays } from "../../../api/apiService/dataService";

const AdminEssayList = () => {
    const [essays, setEssays] = useState([]);

    useEffect(() => {
        getAllEssays().then(data => setEssays(data));
    }, []);

    return (
        <div className="bg-white shadow-md rounded-lg p-4 mt-4">
            <h3 className="text-lg font-semibold mb-4">All User Essays</h3>
            <ul className="space-y-4">
                {essays.map(essay => (
                    <li key={essay.id} className="border-b pb-2">
                        <p><strong>User:</strong> ({essay.email})</p>
                        <p><strong>Submission Time:</strong> {new Date(essay.submissionTime).toLocaleString()}</p>
                        <p><strong>Score:</strong> {essay.score}</p>
                        <p><strong>Content:</strong> {essay.content.slice(0, 100)}...</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminEssayList;
