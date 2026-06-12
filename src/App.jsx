import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Intro from './components/Intro';
import Home from './pages/Home';
import Search from './pages/Search';
import MyList from './pages/MyList';
import NotFound from './pages/NotFound';
import DetailModal from './components/DetailModal';

function App() {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [autoPlayTrailer, setAutoPlayTrailer] = useState(false);
  const [showIntro, setShowIntro] = useState(() => {
    // Only play intro once per browser session
    return !sessionStorage.getItem('funflix_intro_played');
  });

  const handleMovieClick = (movie, playTrailer = false) => {
    console.log('[App] handleMovieClick fired for:', movie.title || movie.name, 'playTrailer:', playTrailer);
    setSelectedMovie(movie);
    setAutoPlayTrailer(playTrailer);
  };

  const handleCloseModal = () => {
    console.log('[App] handleCloseModal fired');
    setSelectedMovie(null);
    setAutoPlayTrailer(false);
  };

  const handleIntroComplete = () => {
    sessionStorage.setItem('funflix_intro_played', 'true');
    setShowIntro(false);
  };

  return (
    <>
      {showIntro && <Intro onComplete={handleIntroComplete} />}
      
      <Router>
        <div className="app-container">
          <Navbar />
          
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home onMovieClick={handleMovieClick} />} />
              <Route path="/search" element={<Search onMovieClick={handleMovieClick} />} />
              <Route path="/my-list" element={<MyList onMovieClick={handleMovieClick} />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          <Footer />

          {selectedMovie && (
            <DetailModal 
              movie={selectedMovie} 
              autoPlayTrailer={autoPlayTrailer}
              onClose={handleCloseModal} 
            />
          )}
        </div>
      </Router>
    </>
  );
}

export default App;
