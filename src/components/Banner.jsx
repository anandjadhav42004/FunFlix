import React, { useState, useEffect } from 'react';
import { Play, Info } from 'lucide-react';
import { fetchCategoryMovies, requests, getImageUrl } from '../services/tmdb';
import './Banner.css';

const Banner = ({ onMovieClick }) => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBannerMovie = async () => {
      setLoading(true);
      const movies = await fetchCategoryMovies(requests.fetchNetflixOriginals);
      if (movies && movies.length > 0) {
        // Pick a random Netflix original
        const randomIndex = Math.floor(Math.random() * movies.length);
        setMovie(movies[randomIndex]);
      }
      setLoading(false);
    };

    loadBannerMovie();
  }, []);

  const truncate = (string, n) => {
    return string?.length > n ? string.substr(0, n - 1) + '...' : string;
  };

  if (loading) {
    return (
      <div className="banner" style={{ background: '#111', height: '400px' }}>
        <div className="banner-contents">
          <h1 className="banner-title">Loading...</h1>
        </div>
      </div>
    );
  }

  if (!movie) return null;

  const title = movie.title || movie.name || movie.original_name || 'Featured Title';
  const backdropUrl = getImageUrl(movie.backdrop_path, 'original');

  return (
    <header
      className="banner"
      style={{
        backgroundImage: `url("${backdropUrl}")`,
      }}
    >
      <div className="banner-fade-top"></div>
      <div className="banner-fade-left"></div>
      
      <div className="banner-contents">
        <h1 className="banner-title">{title}</h1>
        <p className="banner-description">
          {truncate(movie.overview, 150)}
        </p>
        <div className="banner-buttons">
          <button 
            type="button" 
            className="banner-btn banner-btn-play"
            onClick={() => onMovieClick(movie, true)}
          >
            <Play size={18} fill="currentColor" /> Play
          </button>
          <button 
            type="button" 
            className="banner-btn banner-btn-info"
            onClick={() => onMovieClick(movie)}
          >
            <Info size={18} /> More Info
          </button>
        </div>
      </div>

      <div className="banner-fade-bottom"></div>
    </header>
  );
};

export default Banner;
