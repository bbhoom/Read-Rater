
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Books from './pages/Books';
import BookDetails from './pages/BookDetails';
import Profile from './pages/Profile';
import Auth from './pages/Auth';
import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';

function App() {
  const { initializeUser, loading } = useAuthStore();

  useEffect(() => {
    initializeUser();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  else {
    return (
      <Router>
        <div className="max-h-screen bg-gray-50 w-full max-w-full p-0 m-0">
          <Navbar />
          <main className="w-full max-w-full px-0 py-8">

            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/books" element={<Books />} />
              <Route path="/books/:id" element={<BookDetails />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/auth" element={<Auth />} />
            </Routes>
          </main>
        </div>
      </Router>
    );
  }
}

export default App