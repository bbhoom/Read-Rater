import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, User, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';

export default function Navbar() {
  const { user, signOut } = useAuthStore();

  return (
    <motion.nav
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-900/80 backdrop-blur-md shadow-lg fixed top-0 left-0 right-0 z-50"
    >
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/"
            className="flex items-center space-x-2 group"
          >
            <BookOpen className="h-6 w-6 text-blue-400 group-hover:rotate-12 transition-transform duration-300" />
            <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
              ReadRater
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/books"
                className="text-gray-300 hover:text-white transition-colors duration-300"
              >
                Books
              </Link>
            </motion.div>
            {user ? (
              <div className="flex items-center space-x-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/profile"
                    className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors duration-300"
                  >
                    <User className="h-5 w-5" />
                    <span>Profile</span>
                  </Link>
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => signOut()}
                  className="flex items-center space-x-1 text-gray-300 hover:text-red-400 transition-colors duration-300"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </motion.button>
              </div>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/auth"
                  className="bg-gradient-to-r from-blue-600 to-purple-700 text-white px-4 py-2 rounded-full hover:from-blue-700 hover:to-purple-800 transition duration-300"
                >
                  Sign In
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}