import React from 'react';
import {deleteComment } from '../../services/commentsServices';
import { getCurrentUser } from '../../services/authServices';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button, Input } from '../index.js';

const DeleteComment = () => {

       const { commentId } = useParams();
    
          const [error, setError] = useState('');
          const [success, setSuccess] = useState('');
          const { register, handleSubmit } = useForm();
          const navigate = useNavigate();
        
          console.log("comment id: ",commentId)

    const delete_Comment = async(data)=>{

        console.log("data in frontend: ",data);

        await deleteComment(commentId);

    }      
  return (
    <div>
      
    </div>
  )
}

export default DeleteComment
