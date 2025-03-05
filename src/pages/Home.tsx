import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Star,
  Users,
  ChevronRight,
  Layers,
  Compass,
  Zap
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Book {
  id: number;
  title: string;
  author: string;
  cover_url: string;
}

export default function InnovativeLandingPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    fetchBooks();
    const featureInterval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 3000);

    return () => clearInterval(featureInterval);
  }, []);

  const fetchBooks = async () => {
    const { data, error } = await supabase
      .from('books')
      .select('id, title, author, cover_url')
      .limit(6);

    if (error) {
      console.error('Error fetching books:', error.message);
    } else {
      setBooks(data || []);
    }
  };

  const features = [
    {
      icon: Layers,
      title: "Vast Literary Universe",
      description: "Explore an endless collection of books across every genre imaginable.",
      color: "from-blue-500 to-blue-700"
    },
    {
      icon: Compass,
      title: "Personalized Recommendations",
      description: "Discover books tailored exactly to your unique reading preferences.",
      color: "from-purple-500 to-purple-700"
    },
    {
      icon: Zap,
      title: "Community Insights",
      description: "Connect with readers worldwide and share your literary journey.",
      color: "from-green-500 to-green-700"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-hidden relative m-0 p-0">
      {/* Remove default margin and padding */}
      <style>{`
        body, html {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }
      `}</style>

      {/* Floating Particles Background */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: Math.random()
            }}
            animate={{
              x: [
                Math.random() * window.innerWidth,
                Math.random() * window.innerWidth,
                Math.random() * window.innerWidth
              ],
              y: [
                Math.random() * window.innerHeight,
                Math.random() * window.innerHeight,
                Math.random() * window.innerHeight
              ],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "loop"
            }}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 relative z-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center pt-24 mb-16"
        >
          <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Unlock Worlds Between Pages
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
            Your gateway to endless stories, authentic reviews, and a global community of passionate readers.
          </p>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/books"
              className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-700 text-white px-10 py-4 rounded-full text-lg shadow-2xl hover:shadow-blue-500/50 transition duration-300"
            >
              Explore Books
              <ChevronRight className="ml-3" size={24} />
            </Link>
          </motion.div>
        </motion.div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              animate={{
                opacity: activeFeature === index ? 1 : 0.6,
                y: activeFeature === index ? 0 : 20,
                scale: activeFeature === index ? 1 : 0.95
              }}
              transition={{ duration: 0.5 }}
              className={`bg-gradient-to-br ${feature.color} p-6 rounded-2xl shadow-2xl text-center transition-all duration-300 cursor-pointer`}
              onClick={() => setActiveFeature(index)}
            >
              <feature.icon className="mx-auto mb-4 text-white" size={48} />
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-white/80">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Featured Books Carousel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-4xl font-bold text-center mb-10 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Featured Books
          </h2>
          <div className="grid md:grid-cols-6 gap-6">
            {books.map((book, index) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1
                }}
                whileHover={{
                  scale: 1.05,
                  rotate: Math.random() * 2 - 1 // Slight random rotation
                }}
                className="bg-gray-800 rounded-xl overflow-hidden shadow-2xl hover:shadow-blue-500/30 transition duration-300"
              >
                <img
                  src={book.cover_url}
                  alt={book.title}
                  className="w-full h-72 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-white truncate">{book.title}</h3>
                  <p className="text-gray-400 text-sm">{book.author}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Subtle Footer Glow */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-blue-900/30 to-transparent"></div>
    </div>
  );
}