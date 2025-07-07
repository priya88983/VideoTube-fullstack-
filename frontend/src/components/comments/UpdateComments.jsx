import React, { useState } from 'react';
import {updateComment } from '../../services/commentsServices';
import { getCurrentUser } from '../../services/authServices';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button, Input } from '../index.js';

const UpdateComments = () => {
     const { commentId } = useParams();

      const [error, setError] = useState('');
      const [success, setSuccess] = useState('');
      const { register, handleSubmit } = useForm();
      const navigate = useNavigate();
    
      console.log("comment id: ",commentId)

const update_comment = async (data) => {
  setError('');
  setSuccess('');
  

  console.log("📩 Payload being sent to backend:", data);

  // Should look like { content: "..." }

  try {
   const updated = await updateComment(commentId, data);
console.log("updated comment: ", updated);

// ✅ Extract videoId from the response
const videoId = updated?.data?.video;
console.log("videoId from backend:", videoId);

navigate(`/videos/${videoId}`);


  

    setSuccess('Comment updated successfully ✅');

    setTimeout(() => {
      navigate(`/video/${video}`);
    }, 1500);
  } catch (err) {
    console.error("❌ Update error:", err?.response?.data || err.message);
    setError(err?.response?.data?.message || "Something went wrong");
  
}

    };
  
    return (
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-md mt-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Update Comment</h2>
  
        {error && <p className="text-red-500 mt-6 text-center text-sm">{error}</p>}
        {success && <p className="text-green-500 mt-6 text-center text-sm">{success}</p>}
  
        <form onSubmit={handleSubmit(update_comment)} className="space-y-5">
          <Input
            label="Content"
            placeholder="Update your comment"
            {...register('content', { required: true })} // ✅ Fixed here
          />
  
          <Button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            Update Comment
          </Button>
        </form>
      </div>
    );
  };


export default UpdateComments
