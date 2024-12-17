// src/components/CommentItem.js
import React from "react";
import moment from "moment";
import avatarPlaceholder from "../../assets/images/Avatar.png";

const CommentItem = ({
    comment,
    handleReply,
    showReplyBox,
    subComment,
    setSubComment,
    handleSendComment,
    getReplies,
    renderComments,
}) => {
    const timeElapsed = moment(comment.createdAt).fromNow();
    const replies = getReplies(comment.id);

    return (
        <div className={`pb-6 border-b border-gray-200`}>
            <div className="flex items-start">
                <img
                    src={comment.avatar || avatarPlaceholder}
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full"
                />
                <div className="ml-4 flex-1">
                    <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-900 text-[14px]">{comment.userName}</span>
                        <span className="text-sm text-gray-500">{timeElapsed}</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-900 leading-relaxed">{comment.content}</p>
                    <button
                        onClick={() => handleReply(comment)}
                        className="mt-2 text-sm text-gray-500 hover:text-blue-500"
                    >
                        Reply
                    </button>

                    {showReplyBox === comment.id && (
                        <div className="mt-4">
                            <textarea
                                value={subComment.content}
                                onChange={(e) =>
                                    setSubComment({ ...subComment, content: e.target.value })
                                }
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                                placeholder={`Reply to ${comment.userName}`}
                                rows={2}
                            />
                            <div className="flex justify-end mt-2">
                                <button
                                    onClick={() => handleSendComment(true)}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
                                >
                                    Post Reply
                                </button>
                            </div>
                        </div>
                    )}

                    {replies.length > 0 && (
                        <div className="mt-4 space-y-6">
                            {renderComments(replies, 1)}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CommentItem;
