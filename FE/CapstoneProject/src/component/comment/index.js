// Comment.js

import React, { useEffect, useState } from "react";
import clsx from "clsx";
import styles from "./Comment.module.scss";
import avatar from "../../assets/images/avatar_25.jpg";
import { over } from "stompjs";
import SockJS from "sockjs-client";
import { useSelector } from "react-redux";
import * as dataApi from "../../api/apiService/dataService";
import * as userApi from "../../api/apiService/authService";
import moment from "moment";
import { toast } from "sonner";

var stompClient = null;

export default function Comment({ courseId, lessonId }) {
  const userInfo = useSelector((state) => state.login.user);
  const initComment = {
    avatar: userInfo.avatar,
    email: userInfo.email,
    userName: userInfo.firstName + " " + userInfo.lastName,
    lessonId: lessonId,
  };
  const [comments, setComments] = useState([]);
  const [showReplyBox, setShowReplyBox] = useState(-1);
  const [subComment, setSubComment] = useState(initComment);
  const [comment, setComment] = useState(initComment);

  useEffect(() => {
    if (!lessonId) {
      return;
    }
    connect();

    const fetchApi = async () => {
      try {
        const result = await dataApi.getComments(lessonId);
        setComments(result.content.content);
      } catch (error) {
        console.log(error);
      }
    };
    fetchApi();
    setComment({ ...initComment, lessonId: lessonId });
    setSubComment({ ...initComment, lessonId: lessonId });

    return () => {
      if (stompClient) {
        stompClient.disconnect();
      }
    };
  }, [lessonId]);

  const connect = () => {
    const Sock = new SockJS("http://localhost:8080/ws");
    stompClient = over(Sock);
    stompClient.connect({}, onConnected, onError);
  };

  const onConnected = () => {
    stompClient.subscribe(`/comment/lesson/${lessonId}`, onMessageReceived);
  };

  const onError = (err) => {
    console.log(err);
  };

  const onMessageReceived = (payload) => {
    var payloadData = JSON.parse(payload.body);
    setComments((prev) => [payloadData, ...prev]);
  };

  const sendValue = (sub) => {
    if (stompClient) {
      let data = sub ? { ...subComment } : { ...comment };
      stompClient.send(
        `/app/comment/lesson/${lessonId}`,
        {},
        JSON.stringify(data)
      );
      sub ? setSubComment({ ...subComment, content: "" }) : setComment({ ...comment, content: "" });
    } else {
      console.log("stompClient is not connected");
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
        <div key={ind} className={styles.commentContainer}>
          <div className={styles.comment}>
            <img src={cmt.avatar || avatar} alt="User Avatar" className={styles.avatar} />
            <div className={styles.commentContent}>
              <div className={styles.commentHeader}>
                <span className={styles.commentAuthor}>{cmt.userName}</span>
                <span className={styles.commentTime}>{timeElapsed}</span>
              </div>
              <div className={styles.commentText}>{cmt.content}</div>
              <div className={styles.commentActions}>
                <button onClick={() => handleReply(cmt)} className={styles.replyButton}>Reply</button>
                {userInfo.email === cmt.userEmail && (
                  <button onClick={() => handleRemoveComment(cmt.id)} className={styles.deleteButton}>Delete</button>
                )}
              </div>
            </div>
          </div>

          {/* Reply Input */}
          {showReplyBox === cmt.id && (
            <div className={styles.commentInputBox}>
              <img src={userInfo.avatar || avatar} alt="User Avatar" className={styles.avatar} />
              <div className={styles.commentInputBox}>
                <textarea
                  value={subComment.content}
                  onChange={(e) => setSubComment({ ...subComment, content: e.target.value })}
                  className={styles.commentInput}
                  placeholder={`Reply to ${cmt.userName}`}
                />
                <button onClick={() => handleSendComment(true)} className={styles.sendButton}>Send</button>
              </div>
            </div>
          )}

          {/* Replies */}
          {replies.length > 0 && (
            <div className={styles.repliesContainer}>
              {renderComments(replies)}
            </div>
          )}
        </div>
      );
    });
  };

  const handleRemoveComment = (cmtId) => {
    const fetchApi = async () => {
      try {
        await userApi.removeCommentById(userInfo.email, cmtId);
        const result = await dataApi.getComments(lessonId);
        setComments(result.content.content);
      } catch (error) {
        toast.error(error.message);
        console.log(error);
      }
    };
    fetchApi();
  };

  return (
    <div className={styles.commentsSection}>
      {/* Comment Input */}
      <div className={styles.commentInputContainer}>
        <img src={userInfo.avatar || avatar} alt="User Avatar" className={styles.avatar} />
        <div className={styles.commentInputBox}>
          <textarea
            value={comment.content}
            onChange={(e) => setComment({ ...comment, content: e.target.value })}
            className={styles.commentInput}
            placeholder="Add a comment..."
          />
          <button onClick={() => handleSendComment(false)} className={styles.sendButton}>Send</button>
        </div>
      </div>

      {/* Comments List */}
      <div className={styles.commentsList}>
        {renderComments(comments.filter((c) => c.parentId === 0))}
      </div>
    </div>
  );
}
