import React, { useState, useEffect } from 'react';
import { addComment } from '../../services/commentsServices';
import { getCurrentUser } from '../../services/authServices';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';

const AddComments = ({ onCommentAdded = () => {} }) => {
  const { id } = useParams(); // videoId
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { register, handleSubmit, reset, setFocus } = useForm();
  const navigate = useNavigate();

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 2000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const add_comment = async (data) => {
    setError('');
    setSuccess('');

    try {
      const userData = await getCurrentUser();
      if (!userData) {
        navigate('/login');
        return;
      }

      const added = await addComment(id, data);
      if (added) {
        setSuccess('Comment added ✅');
        reset();
        setFocus('content');
        onCommentAdded(); // safely triggers refresh in parent
      }
    } catch (error) {
      setError(error.message || 'Something went wrong');
    }
  };

  return (
    <div className="mt-6 mb-4">
      <h3 className="text-base font-semibold text-white mb-2">Add a Comment</h3>

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      {success && <p className="text-green-500 text-sm mb-2">{success}</p>}

      <form onSubmit={handleSubmit(add_comment)} className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Write a comment..."
          {...register('content', { required: true })}
          className="flex-1 px-4 py-2 text-sm rounded-full bg-[#222] text-white border border-gray-700 focus:outline-none focus:ring focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-5 py-2 text-sm rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Comment
        </button>
      </form>
    </div>
  );
};

export default AddComments;
