import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';

export default function Auth() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn, signUp } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      if (isSignIn) {
        // Sign In
        await signIn(email, password);
        navigate('/');
      } else {
        // Sign Up
        // Check username uniqueness
        const { data: existingUser, error: usernameCheckError } = await supabase
          .from('users')
          .select('*')
          .eq('username', username)
          .single();

        if (existingUser) {
          throw new Error('Username already exists');
        }

        // Perform sign up
        await signUp(email, password, username);

        // Show success message
        setSuccessMessage('Please check your email to confirm your account');
        setIsSignIn(true);
      }
    } catch (err: any) {
      // Specific error handling
      if (err.message.includes('Email not confirmed')) {
        setError('Please check your email and confirm your account');
      } else {
        setError(err.message || 'An error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-900 p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-700"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-400">
          {isSignIn ? 'Sign In' : 'Create Account'}
        </h2>

        {error && (
          <div className="bg-red-600 text-white p-3 rounded-md mb-4 text-center">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-600 text-white p-3 rounded-md mb-4 text-center">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isSignIn && (
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full rounded-md bg-gray-800 border border-gray-600 text-white p-2 focus:ring-blue-500 focus:border-blue-500"
                required
                minLength={3}
                maxLength={50}
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md bg-gray-800 border border-gray-600 text-white p-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md bg-gray-800 border border-gray-600 text-white p-2 focus:ring-blue-500 focus:border-blue-500"
              required
              minLength={6}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md font-semibold shadow-md transition-all disabled:opacity-50"
          >
            {loading
              ? (isSignIn ? 'Signing In...' : 'Creating Account...')
              : (isSignIn ? 'Sign In' : 'Create Account')
            }
          </motion.button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => {
              setIsSignIn(!isSignIn);
              setError('');
              setSuccessMessage('');
            }}
            className="text-blue-400 hover:text-blue-500 transition-all"
            disabled={loading}
          >
            {isSignIn
              ? "Don't have an account? Sign Up"
              : 'Already have an account? Sign In'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}