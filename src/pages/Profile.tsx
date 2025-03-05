import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Star, BookmarkIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { motion } from 'framer-motion';

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  book: {
    id: string;
    title: string;
    author: string;
    cover_url: string;
  };
}

export default function Profile() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchUserReviews();
  }, [user, navigate]);

  const fetchUserReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*, book:books(id, title, author, cover_url)')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching user reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#121620]">

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121620] text-white p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-gradient-to-r from-blue-600/50 to-purple-600/50 rounded-xl p-8 mb-8 mt-12 items-center">
          <div>
            <h1 className="text-3xl font-bold  mb-2">Your Profile</h1>
            <p className="text-gray-300">{user?.email}</p>
          </div>

        </div>

        <h2 className="text-2xl font-bold mb-6 text-center">Your Reviews</h2>

        {reviews.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-[#1E2433] rounded-xl p-12 text-center"
          >
            <BookOpen className="mx-auto h-16 w-16 text-gray-600 mb-6" />
            <h3 className="text-xl font-semibold text-gray-300 mb-4">No reviews yet</h3>
            <p className="text-gray-500 mb-6">Explore and start your reading journey!</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/books')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              Browse Books
            </motion.button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{
                  scale: 1.02,
                  boxShadow: '0 10px 15px rgba(0,0,0,0.2)'
                }}
                transition={{ duration: 0.3 }}
                className="bg-[#1E2433] rounded-xl p-6 flex gap-6 cursor-pointer hover:border-blue-500 border border-transparent"
                onClick={() => navigate(`/books/${review.book.id}`)}
              >
                <div className="w-24 h-36 rounded-lg overflow-hidden shadow-lg">
                  {review.book.cover_url ? (
                    <motion.img
                      src={review.book.cover_url}
                      alt={review.book.title}
                      whileHover={{ scale: 1.1 }}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <BookOpen className="h-8 w-8 text-gray-500" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-blue-400">{review.book.title}</h3>
                      <p className="text-gray-500">{review.book.author}</p>
                    </div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${i < review.rating
                            ? 'text-yellow-500 fill-current'
                            : 'text-gray-700'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-400 mb-3">{review.comment}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

