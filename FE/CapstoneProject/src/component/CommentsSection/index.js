// src/components/CommentsSection.js
import React, { useEffect, useState, useContext } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { StompContext } from "../../context/StompContext";
import avatarPlaceholder from "../../assets/images/Avatar.png";
import CommentItem from "../CommentItem";
import {
    getCommentsByCourseId,
    addComment
} from "../../api/apiService/dataService";

export default function CommentsSection({ courseId, lessonId }) {
    const userInfo = useSelector((state) => state.login.user);
    const stompClient = useContext(StompContext);

    const [comments, setComments] = useState([]);
    const [showReplyBox, setShowReplyBox] = useState(-1);
    const [subComment, setSubComment] = useState({
        content: "",
        parentCommentId: null,
        replyToUser: "",
        replyToUserName: "",
    });
    const [comment, setComment] = useState({
        content: "",
    });

    useEffect(() => {
        if (!courseId) return;

        fetchComments();

        if (stompClient) {
            // Chờ đến khi STOMP kết nối thành công mới subscribe
            stompClient.onConnect = () => {
                console.log("Connected to STOMP");
                subscribeToComments();
            };
        }

        // Không subscribe ngay lập tức ở đây
        // onConnect sẽ lo việc đó

        // return () => { ... nếu cần unsubscribe }

    }, [courseId, stompClient]);

    const fetchComments = async () => {
        try {
            const res = await getCommentsByCourseId(courseId);
            setComments(res);
        } catch (error) {
            console.error("Error fetching comments:", error);
            toast.error("Failed to load comments.");
        }
    };

    const subscribeToComments = () => {
        if (!stompClient || !stompClient.active) return;

        stompClient.subscribe(`/topic/comments/${courseId}`, (message) => {
            const newComment = JSON.parse(message.body);
            setComments((prevComments) => [...prevComments, newComment]);
        });
    };

    const sendValue = async (isSub) => {
        if (!stompClient || !stompClient.active) {
            toast.error("WebSocket is not connected.");
            return;
        }

        const data = isSub
            ? {
                  content: subComment.content,
                  parentCommentId: subComment.parentCommentId,
              }
            : {
                  content: comment.content,
              };

        try {
            const res = await addComment(courseId, data);
            // Bỏ stompClient.publish
            // Server đã convertAndSend sau khi comment thành công
            
            if (isSub) {
                setSubComment({
                    content: "",
                    parentCommentId: null,
                    replyToUser: "",
                    replyToUserName: "",
                });
            } else {
                setComment({ content: "" });
            }
        } catch (error) {
            console.error("Error adding comment:", error);
            toast.error("Failed to add comment.");
        }
    };

    const handleSendComment = (isSub) => {
        if (isSub && !subComment.content.trim()) {
            toast.error("Reply content cannot be empty.");
            return;
        }
        if (!isSub && !comment.content.trim()) {
            toast.error("Comment content cannot be empty.");
            return;
        }
        sendValue(isSub);
        setShowReplyBox(-1);
    };

    const handleReply = (cmt) => {
        setShowReplyBox(cmt.id);
        setSubComment({
            content: "",
            parentCommentId: cmt.id,
            replyToUser: cmt.userEmail,
            replyToUserName: cmt.userName,
        });
    };

    const getReplies = (commentId) => {
        return comments.filter((c) => c.parentCommentId === commentId);
    };

    const renderComments = (commentList, indentLevel = 0) => {
        return commentList.map((cmt) => (
            <CommentItem
                key={cmt.id}
                comment={cmt}
                handleReply={handleReply}
                showReplyBox={showReplyBox}
                subComment={subComment}
                setSubComment={setSubComment}
                handleSendComment={handleSendComment}
                getReplies={getReplies}
                renderComments={renderComments}
            />
        ));
    };

    return (
        <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-800">Comments ({comments.length})</h3>

            <div className="mt-6 flex items-start space-x-4">
                <img
                    src={userInfo.avatar || avatarPlaceholder}
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                    <textarea
                        value={comment.content}
                        onChange={(e) => setComment({ content: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                        placeholder="Add a comment..."
                        rows={3}
                    />
                    <div className="flex justify-end mt-2">
                        <button
                            onClick={() => handleSendComment(false)}
                            className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 text-sm"
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-8 space-y-6">
                {renderComments(comments.filter((c) => c.parentCommentId === null))}
            </div>
        </div>
    );
}
