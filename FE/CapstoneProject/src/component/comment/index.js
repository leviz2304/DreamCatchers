import React, { useEffect, useState } from "react";
import clsx from "clsx";
import styles from "./Comment.module.scss";
import avatarPlaceholder from "../../assets/images/avatar_25.jpg";
import { over } from "stompjs";
import SockJS from "sockjs-client";
import { useSelector } from "react-redux";
import * as dataApi from "../../api/apiService/dataService";
import moment from "moment";
import { toast } from "sonner";

let stompClient = null;

export default function Comment({ courseId, lessonId }) {
  const userInfo = useSelector((state) => state.login.user);
  const initComment = {
    avatar: userInfo.avatar,
    email: userInfo.email,
    userName: `${userInfo.firstName} ${userInfo.lastName}`,
    lessonId,
  };

  const [comments, setComments] = useState([]);
  const [showReplyBox, setShowReplyBox] = useState(-1);
  const [subComment, setSubComment] = useState(initComment);
  const [comment, setComment] = useState(initComment);

  useEffect(() => {
    if (!lessonId) return;

    connect();
    fetchComments();

    return () => {
      if (stompClient) {
        stompClient.disconnect();
        console.log("Disconnected from WebSocket.");
      }
    };
  }, [lessonId]);

  const fetchComments = async () => {
    try {
      const result = await dataApi.getComments(lessonId);
      setComments(result.content.content);
    } catch (error) {
      console.log("Error fetching comments:", error);
      toast.error("Failed to load comments.");
    }
  };

  const connect = () => {
    const Sock = new SockJS("http://localhost:8080/ws");
    stompClient = over(Sock);
    stompClient.connect({}, () => {
      console.log("WebSocket connected successfully.");
      onConnected();
    }, onError);
  };

  const onConnected = () => {
    if (stompClient) {
      console.log(`Subscribing to comments for lesson: ${lessonId}`);
      stompClient.subscribe(`/comment/lesson/${lessonId}`, onMessageReceived);
    }
  };

  const onError = (err) => {
    console.log("WebSocket connection error:", err);
  };

  const onMessageReceived = (payload) => {
    const payloadData = JSON.parse(payload.body);
    console.log("WebSocket message received:", payloadData);
    setComments((prev) => [payloadData, ...prev]);
  };

  const sendValue = (sub) => {
    if (stompClient) {
        const data = sub ? { ...subComment } : { ...comment };
        console.log("Sending data:", data);
        // Send to WebSocket
        stompClient.send(`/app/comment/lesson/${lessonId}`, {}, JSON.stringify(data));
        // Clear the input field
        sub
            ? setSubComment({ ...subComment, content: "" })
            : setComment({ ...comment, content: "" });
    } else {
        console.log("WebSocket is not connected.");
    }
};


  const handleSendComment = (sub) => {
    sendValue(sub);
    setShowReplyBox(-1);
  };

  const handleReply = (cmt) => {
    setShowReplyBox(cmt.id);
    setSubComment({
      ...subComment,
      content: "",
      parentId: cmt.id,
      replyToUser: cmt.userEmail,
      replyToUserName: cmt.userName,
    });
  };

  const getReplies = (commentId) => {
    return comments.filter((c) => c.parentId === commentId);
  };

  const renderComments = (commentList) => {
    return commentList.map((cmt, ind) => {
      const timeElapsed = moment(cmt.date).fromNow();
      const replies = getReplies(cmt.id);

      return (
        <div key={cmt.id} className="flex flex-col">
          <div className="flex items-start space-x-4">
            <img
              src={cmt.avatar || avatarPlaceholder}
              alt="User Avatar"
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-800">{cmt.userName}</span>
                <span className="text-sm text-gray-500">{timeElapsed}</span>
              </div>
              <p className="mt-1 text-gray-700">{cmt.content}</p>
              <button
                onClick={() => handleReply(cmt)}
                className="mt-2 text-sm text-blue-500 hover:underline"
              >
                Reply
              </button>
            </div>
          </div>

          {showReplyBox === cmt.id && (
            <div className="ml-14 mt-4">
              <textarea
                value={subComment.content}
                onChange={(e) =>
                  setSubComment({ ...subComment, content: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder={`Reply to ${cmt.userName}`}
                rows={2}
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={() => handleSendComment(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Send
                </button>
              </div>
            </div>
          )}

          {replies.length > 0 && (
            <div className="ml-14 mt-4 space-y-4">
              {renderComments(replies)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="mt-8">
      {/* Comment Input */}
      <div className="flex items-start space-x-4">
        <img
          src={userInfo.avatar || avatarPlaceholder}
          alt="User Avatar"
          className="w-10 h-10 rounded-full"
        />
        <div className="flex-1">
          <textarea
            value={comment.content}
            onChange={(e) => setComment({ ...comment, content: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Add a comment..."
            rows={3}
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={() => handleSendComment(false)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="mt-8 space-y-6">
        {renderComments(
          comments.filter((c) => c.parentId === 0 || c.parentId === null)
        )}
      </div>
    </div>
  );
}
