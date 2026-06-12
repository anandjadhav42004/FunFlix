import React, { useState, useEffect } from 'react';
import Banner from '../components/Banner';
import Row from '../components/Row';
import { fetchCategoryMovies, requests } from '../services/tmdb';

const Home = ({ onMovieClick }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const verifyApi = async () => {
      try {
        setLoading(true);
        setError(false);
        // Fetch netflix originals as a health check
        const data = await fetchCategoryMovies(requests.fetchNetflixOriginals);
        if (!data || data.length === 0) {
          throw new Error('Failed to retrieve movies from TMDB API.');
        }
        setLoading(false);
      } catch (err) {
        console.error('[Home] API health check failed:', err);
        setError(true);
        setLoading(false);
      }
    };

    verifyApi();
  }, []);

  if (loading) {
    return (
      <div className="home-loading fade-in">
        <div className="spinner"></div>
        <p className="loading-text">Loading FunFlix...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-error fade-in">
        <h2 className="error-title">Something went wrong</h2>
        <p className="error-message">
          We are unable to connect to the movie database. Please make sure your TMDB API Key is configured in your environment files and you are connected to the internet.
        </p>
        <button 
          type="button" 
          className="retry-btn"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="home-page fade-in">
      <Banner onMovieClick={onMovieClick} />
      
      <div style={{ marginTop: '-150px', position: 'relative', zIndex: 20, paddingBottom: '50px' }}>
        <Row
          title="FUNFLIX ORIGINALS"
          fetchUrl={requests.fetchNetflixOriginals}
          isLargeRow={true}
          onMovieClick={onMovieClick}
        />
        <Row
          title="Trending Now"
          fetchUrl={requests.fetchTrending}
          onMovieClick={onMovieClick}
        />
        <Row
          title="Top Rated"
          fetchUrl={requests.fetchTopRated}
          onMovieClick={onMovieClick}
        />
        <Row
          title="Action Movies"
          fetchUrl={requests.fetchActionMovies}
          onMovieClick={onMovieClick}
        />
        <Row
          title="Comedy Movies"
          fetchUrl={requests.fetchComedyMovies}
          onMovieClick={onMovieClick}
        />
        <Row
          title="Horror Movies"
          fetchUrl={requests.fetchHorrorMovies}
          onMovieClick={onMovieClick}
        />
        <Row
          title="Romance Movies"
          fetchUrl={requests.fetchRomanceMovies}
          onMovieClick={onMovieClick}
        />
        <Row
          title="Documentaries"
          fetchUrl={requests.fetchDocumentaries}
          onMovieClick={onMovieClick}
        />
      </div>
    </div>
  );
};

export default Home;
