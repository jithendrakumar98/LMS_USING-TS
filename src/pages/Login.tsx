import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { GraduationCap } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

interface LoginForm {
  username: string;
  password: string;
}

function Login() {
  const navigate = useNavigate();
  const { register, handleSubmit, watch } = useForm<LoginForm>();
  const username = watch('username');

  const validateLogin = async (userId: string, password: string) => {
    const isTeacher = userId.length === 4;
    const endpoint = isTeacher ? '/teachers/login' : '/users/login';
    const payload = isTeacher 
      ? { teacherId: parseInt(userId), password }
      : { userID: userId, password };

    try {
      const response = await axios.post(`http://localhost:8080${endpoint}`, payload);
      return response.data;
    } catch (error) {
      return false;
    }
  };

  const onSubmit = async (data: LoginForm) => {
    localStorage.clear();
    try {
      const isAuthenticated = await validateLogin(data.username, data.password);
      
      if (isAuthenticated) {
        const userRole = data.username.length === 4 ? 'teacher' : 'student';
        
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('username', data.username);
        localStorage.setItem('userRole', userRole);
        
        navigate('/');
      } else {
        toast.error('Invalid credentials');
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <GraduationCap className="h-12 w-12 text-indigo-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to EduTrack
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <div className="mt-1">
                <input
                  {...register('username')}
                  type="text"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  {...register('password')}
                  type="password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;