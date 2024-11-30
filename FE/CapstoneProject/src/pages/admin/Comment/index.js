import React, { useEffect, useState } from "react";
import { getRecentComments } from "../../../api/apiService/dataService";

const RecentComments = () => {
    const [comments, setComments] = useState([]);

    useEffect(() => {
        getRecentComments().then((data) => setComments(data));
    }, []);

    return (
        <div className="bg-orange-100 shadow-md rounded-lg p-4 max-w-[600px] ">
            <h3 className="text-lg font-semibold mb-4">Recent Comments</h3>
            <ul className="space-y-4">
                {comments.map((comment) => (
                    <li key={comment.id} className="flex items-center space-x-4">
                        <img
                            src={comment.avatar}
                            alt={comment.userName}
                            className="w-20 h-20 rounded-full"
                        />
                        <div>
                            <p className="font-medium text-gray-800">{comment.userName} ({comment.userEmail})</p>
                            <p className="text-sm text-black">Comment: {comment.content}</p>
                            <p className="text-xs text-black">
                                On Lesson ID: {comment.lessonId || "N/A"}{" "}
                                {comment.replyToUser && `, Reply to: ${comment.replyToUserName}`}
                            </p>
                            <p className="text-xs text-black">
                                {new Date(comment.date).toLocaleString()}
                            </p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RecentComments;
