import React, { useEffect, useState } from "react";
import { getAdminEssayStatistics } from "../../../api/apiService/dataService";

const AdminEssayStatistics = () => {
    const [statistics, setStatistics] = useState({ totalEssayCount: 0, averageScore: 0 });

    useEffect(() => {
        getAdminEssayStatistics().then(data => setStatistics(data));
    }, []);

    return (
        <div className="bg-white shadow-md rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Admin Essay Statistics</h3>
            <p className="text-gray-700">Total Submissions: <strong>{statistics.totalEssayCount}</strong></p>
            <p className="text-gray-700">Average Score: <strong>{statistics.averageScore?.toFixed(2)}</strong></p>
        </div>
    );
};

export default AdminEssayStatistics;
