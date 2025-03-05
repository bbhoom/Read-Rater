import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, BookOpen, Star, Filter, ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Book {
  id: string;
  title: string;
  author: string;
  cover_url: string;
  average_rating: number;
  genre: string;
}

export default function Books() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false);

  useEffect(() => {
    fetchBooks()
      , [selectedGenre]

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
  }, []);

  const fetchBooks = async () => {
    try {
      let query = supabase.from('books').select('*').order('title');

      if (selectedGenre !== 'all') {
        query = query.eq('genre', selectedGenre);
      }

      const { data, error } = await query;

      if (error) throw error;
      setBooks(data || []);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };


  const filteredBooks = books.filter((book) => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === 'all' || book.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  const genres = [
    { value: 'all', label: 'All Genres' },
    { value: 'fiction', label: 'Fiction' },
    { value: 'non-fiction', label: 'Non-Fiction' },
    { value: 'mystery', label: 'Mystery' },
    { value: 'sci-fi', label: 'Science Fiction' },
    { value: 'fantasy', label: 'Fantasy' }
  ];

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-hidden relative">
      {/* Floating Particles Background */}
      <div
        id="particles-container"
        className="absolute inset-0 pointer-events-none"
      />

      <div className="container mx-auto px-6 relative z-10 py-12">
        {/* Header and Search Section */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Explore Books
          </h1>

          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative flex-grow"
            >
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search books by title or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </motion.div>

            {/* Genre Dropdown */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="relative"
            >
              <button
                onClick={() => setIsGenreDropdownOpen(!isGenreDropdownOpen)}
                className="flex items-center justify-between w-full md:w-48 bg-gray-800 border-2 border-gray-700 rounded-full px-4 py-3 text-white"
              >
                {genres.find(g => g.value === selectedGenre)?.label}
                <ChevronDown className={`ml-2 transition ${isGenreDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isGenreDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full mt-2 w-full md:w-48 bg-gray-800 border-2 border-gray-700 rounded-xl shadow-2xl z-20"
                  >
                    {genres.map((genre) => (
                      <button
                        key={genre.value}
                        onClick={() => {
                          setSelectedGenre(genre.value);
                          setIsGenreDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-700 transition first:rounded-t-xl last:rounded-b-xl"
                      >
                        {genre.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>

        {/* Books Grid */}
        {filteredBooks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <BookOpen className="mx-auto h-16 w-16 text-gray-400 mb-6" />
            <h3 className="text-2xl font-bold text-white mb-4">No books found</h3>
            <p className="text-gray-400">Try adjusting your search or genre filter</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6"
          >
            <AnimatePresence>
              {filteredBooks.map((book, index) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1
                  }}
                >
                  <Link
                    to={`/books/${book.id}`}
                    className="group block"
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="aspect-[2/3] bg-gray-800 rounded-2xl overflow-hidden shadow-2xl mb-4"
                    >
                      {book.cover_url ? (
                        <img
                          src={book.cover_url}
                          alt={book.title}
                          className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-700">
                          <BookOpen className="h-16 w-16 text-gray-500" />
                        </div>
                      )}
                    </motion.div>
                    <div className="px-1">
                      <h3 className="font-semibold text-white group-hover:text-blue-400 transition truncate">
                        {book.title}
                      </h3>
                      <p className="text-sm text-gray-400 truncate">{book.author}</p>
                      {book.average_rating && (
                        <div className="flex items-center mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < Math.round(book.average_rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-600'
                                }`}
                            />
                          ))}
                          <span className="ml-2 text-xs text-gray-500">
                            ({book.average_rating.toFixed(1)})
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Subtle Footer Glow */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-blue-900/30 to-transparent"></div>
    </div>
  );
}