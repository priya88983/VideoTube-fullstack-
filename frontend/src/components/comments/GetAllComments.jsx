import React, { useEffect, useState } from 'react';
import { getAllComments, updateComment, deleteComment } from '../../services/commentsServices';
import moment from 'moment';
import { useParams } from 'react-router-dom';
import { getCurrentUser } from '../../services/authServices';
import CommentLike from '../../components/like/CommentLike.jsx';
import OwnerMenu from '../../components/OwnerMenu.jsx';
import toast from 'react-hot-toast';

const GetAllComments = ({ refreshFlag }) => {
  const { id } = useParams();
  const [comments, setComments] = useState([]);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
      } catch (err) {
        console.error("Failed to fetch current user:", err.message);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        if (!id) return;
        const response = await getAllComments(id);
        setComments(response?.data?.docs || []);
      } catch (err) {
        setError(err.message || 'Failed to fetch comments');
      }
    };

    fetchComments();
  }, [id, refreshFlag]);

  const handleEditClick = (comment) => {
    setEditingCommentId(comment._id);
    setEditedContent(comment.content);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditedContent("");
  };

  const handleUpdate = async (commentId) => {
    try {
      await updateComment(commentId, { content: editedContent });
      toast.success("Comment updated");
      setEditingCommentId(null);
      setEditedContent("");
      const response = await getAllComments(id);
      setComments(response?.data?.docs || []);
    } catch (err) {
      toast.error("Failed to update comment");
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await deleteComment(commentId);
      toast.success("Comment deleted");
      const response = await getAllComments(id);
      setComments(response?.data?.docs || []);
    } catch (err) {
      toast.error("Failed to delete comment");
    }
  };

  return (
    <div className="mt-10 w-full">
      <h3 className="text-lg font-semibold text-white mb-4 border-b border-gray-700 pb-2">
        Comments ({comments.length})
      </h3>

      {error && (
        <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
      )}

      {comments.length === 0 && !error ? (
        <p className="text-gray-400 text-sm text-center">
          No comments yet. Be the first to comment!
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {comments.map((comment) => (
            <div
              key={comment._id}
              className="flex items-start gap-4 bg-[#1a1a1a] p-4 rounded-xl shadow-sm hover:bg-[#222] transition-all relative"
            >
              {/* Avatar */}
              <img
                src={comment.ownerInfo?.avatar || '/default-avatar.png'}
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover border border-gray-700"
              />

              {/* Content Section */}
              <div className="flex-1">
                {/* Top Row: Username & Time */}
                <div className="mb-1 flex justify-between items-start">
                  <div>
                    <span className="text-sm font-semibold text-gray-200 block">
                      {comment.ownerInfo?.username || 'Anonymous'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {moment(comment.createdAt).fromNow()}
                    </span>
                  </div>

                  {/* Owner-only Menu */}
                  {currentUser?._id === comment.ownerInfo?._id && (
                    <OwnerMenu
                      onEdit={() => handleEditClick(comment)}
                      onDelete={() => handleDelete(comment._id)}
                    />
                  )}
                </div>

                {/* Content + Like */}
                <div className="flex justify-between items-center mt-1">
                  {editingCommentId === comment._id ? (
                    <div className="w-full">
                      <textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        className="w-full bg-[#111] text-gray-200 border border-gray-600 rounded p-2 text-sm resize-none"
                      />
                      <div className="flex gap-2 mt-2 text-sm">
                        <button
                          onClick={() => handleUpdate(comment._id)}
                          className="px-3 py-1 rounded bg-blue-500 hover:bg-blue-600 text-white"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="px-3 py-1 rounded bg-gray-500 hover:bg-gray-600 text-white"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
                        {comment.content}
                      </p>
                      <CommentLike commentId={comment._id} />
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GetAllComments;
