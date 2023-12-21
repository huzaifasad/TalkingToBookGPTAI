import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  auth,
  provider as googleProvider,
  signInWithPopup,
  signOut,
} from '../../firebase'; // Import your firebase configuration file

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      navigate('/');
    }
  }, [navigate]);

  const collectData = async (userData) => {
    try {
      // You can use Firebase Realtime Database or Firestore here
      // Example using Firebase Realtime Database:
      await fetch('http://localhost:5000/user/signup', {
        method: 'post',
        body: JSON.stringify({ ...userData, password }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Store user data in local storage
      localStorage.setItem('user', JSON.stringify(userData));
      navigate('/');
    } catch (error) {
      console.error('Error during signup:', error);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Send additional user data to your server
      const userData = {
        displayName: user.displayName,
        email: user.email,
        // Add more user data if needed
      };

      // Call collectData to handle storing user data
      collectData(userData);
    } catch (error) {
      console.error('Error during Google sign-in:', error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-500 to-indigo-600">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-3xl font-semibold mb-6 text-center text-gray-800">Sign Up</h1>
        <form className="space-y-4">
          <div className="mb-4">
            <label className="block text-gray-700">Your Email</label>
            <input
              type="text"
              placeholder="Your Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 rounded p-3 w-full focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Your Name</label>
            <input
              type="text"
              placeholder="Your Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-300 rounded p-3 w-full focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Your Password</label>
            <input
              type="password"
              placeholder="Your Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 rounded p-3 w-full focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            type="button"
            onClick={collectData}
            className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue transition duration-300"
          >
            Sign Up
          </button>
        </form>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-gray-700">
            Already have an account?{' '}
            <Link to="/sign" className="text-blue-500 hover:underline">
              Login
            </Link>
          </p>
          <Link to="/updateacount" className="text-blue-500 hover:underline">
            Delete Your Existing
          </Link>
        </div>
        <div className="mt-6">
        <button
          onClick={signInWithGoogle}
          className="bg-red-500 text-white px-4 py-2 rounded-full flex items-center justify-center hover:bg-red-600 focus:outline-none focus:shadow-outline-red transition duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-5 h-5 mr-2"
          >
            {/* Google Icon SVG Path */}
          </svg>
          Sign In with Google
        </button>
        </div>
      </div>
    </div>
  );
}
