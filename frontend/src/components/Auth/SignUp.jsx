import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../store/authSlice';
import {
  registerUser,
  loginUser,
  getCurrentUser,
} from '../../services/authServices';
import Input from '../utilities/Input';
import Button from '../utilities/Button';

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState('');

  const create = async (data) => {
    setError('');

    try {
      const formData = new FormData();
      formData.append('fullName', data.fullName);
      formData.append('email', data.email);
      formData.append('username', data.username);
      formData.append('password', data.password);
      formData.append('avatar', data.avatar[0]);
      if (data.coverImage?.[0]) {
        formData.append('coverImage', data.coverImage[0]);
      }

      await registerUser(formData);

      // ✅ Login using email if available, else username
      const loginCreds = data.email
        ? { email: data.email, password: data.password }
        : { username: data.username, password: data.password };

      await loginUser(loginCreds);

      const userData = await getCurrentUser();
      if (userData) {
        dispatch(login(userData));
        navigate('/all-videos'); // ✅ Navigate to /all-videos after successful login
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-[#1f1f1f] border border-[#333] rounded-2xl shadow-xl p-8 sm:p-10 text-white">
        <h2 className="text-center text-3xl font-bold text-red-400 mb-2">
          Create your account
        </h2>
        <p className="text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-red-400 hover:underline font-medium">
            Sign In
          </Link>
        </p>

        {error && (
          <p className="text-red-500 mt-4 text-center text-sm">{error}</p>
        )}

        <form
          onSubmit={handleSubmit(create)}
          encType="multipart/form-data"
          className="mt-6 flex flex-col gap-5"
        >
          <Input
            label="Full Name"
            labelClassName="text-white"
            {...register('fullName', { required: true })}
          />
          <Input
            label="Email"
            type="email"
            labelClassName="text-white"
            {...register('email')}
          />
          <Input
            label="Username"
            labelClassName="text-white"
            {...register('username', { required: true })}
          />
          <Input
            label="Password"
            type="password"
            labelClassName="text-white"
            {...register('password', { required: true })}
          />
          <Input
            label="Avatar"
            type="file"
            labelClassName="text-white"
            {...register('avatar', { required: true })}
          />
          <Input
            label="Cover Image"
            type="file"
            labelClassName="text-white"
            {...register('coverImage')}
          />
          <Button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 rounded-md py-2 font-semibold text-white transition"
          >
            Create Account
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
