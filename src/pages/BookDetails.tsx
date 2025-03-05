import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { Star, MessageSquare, User, ChevronLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { Link } from 'react-router-dom';

interface Review {
  id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  user: {
    email: string;
  };
}

interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  cover_url: string;
  genre: string;
  published_date: string;
  average_rating: number;
}

export default function BookDetails() {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
  const { user } = useAuthStore();
  useEffect(() => {
    fetchBookAndReviews();

    // Floating particles background
    const particlesContainer = document.getElementById('particles-container');
    if (particlesContainer) {
      const particles = [...Array(50)].map(() => {
        const particle = document.createElement('div');
        particle.classList.add('absolute', 'w-2', 'h-2', 'bg-white/20', 'rounded-full');
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particlesContainer.appendChild(particle);
        return particle;
      });

      return () => {
        particles.forEach(p => particlesContainer.removeChild(p));
      };
    }
  }, [id]);

  const fetchBookAndReviews = async () => {
    try {
      const [bookResponse, reviewsResponse] = await Promise.all([
        supabase.from('books').select('*').eq('id', id).single(),
        supabase
          .from('reviews')
          .select('*, user:users(email)')
          .eq('book_id', id)
          .order('created_at', { ascending: false }),
      ]);

      if (bookResponse.error) throw bookResponse.error;
      if (reviewsResponse.error) throw reviewsResponse.error;

      setBook(bookResponse.data);
      setReviews(reviewsResponse.data || []);
    } catch (error) {
      console.error('Error fetching book details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      console.error("User is not logged in.");
      return;
    }

    if (!newReview.rating || !newReview.comment.trim()) {
      console.error("Rating and comment are required.");
      return;
    }

    try {
      const { data, error } = await supabase.from('reviews').insert([
        {
          book_id: id, // Ensure book_id is included
          user_id: user.id, // Ensure user.id exists
          rating: newReview.rating,
          comment: newReview.comment,
          created_at: new Date().toISOString(), // Explicitly set timestamp
        },
      ]);

      if (error) throw error;

      console.log("Review submitted successfully:", data);
      setNewReview({ rating: 0, comment: '' });
      fetchBookAndReviews(); // Refresh the reviews list
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex justify-center items-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="w-16 h-16 border-4 border-t-blue-600 border-white/20 rounded-full"
        />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex justify-center items-center text-white">
        <h2 className="text-3xl font-bold">Book not found</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-hidden relative">
      {/* Floating Particles Background */}
      <div
        id="particles-container"
        className="absolute inset-0 pointer-events-none"
      />

      <div className="container mx-auto px-6 relative z-10 py-12">
        {/* Back Button */}
        <Link
          to="/books"
          className="inline-flex items-center text-white mb-8 hover:text-blue-400 transition"
        >
          <ChevronLeft className="mr-2" /> Back to Books
        </Link>

        {/* Book Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gray-800/60 backdrop-blur-lg rounded-2xl overflow-hidden shadow-2xl"
        >
          <div className="md:flex">
            {/* Book Cover */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="md:w-1/3 relative"
            >
              {book.cover_url ? (
                <img
                  src={book.cover_url}
                  alt={book.title}
                  className="w-full h-96 object-cover"
                />
              ) : (
                <div className="h-96 bg-gray-700 flex items-center justify-center">
                  <span className="text-gray-400">No cover</span>
                </div>
              )}
            </motion.div>

            {/* Book Information */}
            <div className="md:w-2/3 p-8">
              <motion.h1
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
              >
                {book.title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-xl text-gray-300 mb-6"
              >
                {book.author}
              </motion.p>

              {/* Rating */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex items-center mb-6"
              >
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-6 w-6 ${i < Math.round(book.average_rating || 0)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-600'
                      }`}
                  />
                ))}
                <span className="ml-3 text-gray-400">
                  {book.average_rating?.toFixed(1) || 'No ratings'} / 5
                </span>
              </motion.div>

              {/* Book Details */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="grid md:grid-cols-2 gap-4 mb-6"
              >
                <div>
                  <h3 className="font-semibold text-blue-400">Genre</h3>
                  <p className="text-gray-300">{book.genre}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-400">Published</h3>
                  <p className="text-gray-300">
                    {new Date(book.published_date).toLocaleDateString()}
                  </p>
                </div>
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <h3 className="font-semibold text-blue-400 mb-3">Description</h3>
                <p className="text-gray-300 leading-relaxed">
                  {book.description}
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Reviews Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-12"
        >
          <h2 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Reader Reviews
          </h2>

          {/* Review Form */}
          {user && (
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              onSubmit={handleSubmitReview}
              className="bg-gray-800/60 backdrop-blur-lg rounded-2xl p-8 mb-12"
            >
              <h3 className="text-xl font-semibold mb-6 text-white">
                Share Your Thoughts
              </h3>

              {/* Star Rating */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Your Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      key={rating}
                      type="button"
                      onClick={() => setNewReview({ ...newReview, rating })}
                      className={`p-2 ${newReview.rating >= rating
                        ? 'text-yellow-400'
                        : 'text-gray-500'
                        }`}
                    >
                      <Star className="h-7 w-7 fill-current" />
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Review Textarea */}
              <div className="mb-6">
                <label
                  htmlFor="comment"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Your Review
                </label>
                <textarea
                  id="comment"
                  rows={4}
                  value={newReview.comment}
                  onChange={(e) =>
                    setNewReview({ ...newReview, comment: e.target.value })
                  }
                  className="w-full bg-gray-700 border-none text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-purple-700 text-white px-6 py-3 rounded-full hover:shadow-lg transition"
              >
                Submit Review
              </motion.button>
            </motion.form>
          )}

          {/* Reviews List */}
          <AnimatePresence>
            {reviews.length === 0 ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-gray-400 py-12"
              >
                No reviews yet. Be the first to review this book!
              </motion.p>
            ) : (
              reviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1
                  }}
                  className="bg-gray-800/60 backdrop-blur-lg rounded-2xl p-6 mb-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <User className="h-6 w-6 text-blue-400 mr-3" />
                      <span className="font-medium text-white">
                        {review.user.email}
                      </span>
                    </div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${i < review.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-600'
                            }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-300 mb-4">{review.comment}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Subtle Footer Glow */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-blue-900/30 to-transparent"></div>
    </div>
  );
}