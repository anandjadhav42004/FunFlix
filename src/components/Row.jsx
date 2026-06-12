import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchCategoryMovies } from '../services/tmdb';
import MovieCard from './MovieCard';
import './Row.css';

const Row = ({ title, fetchUrl, isLargeRow = false, onMovieClick }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const rowRef = useRef(null);

  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true);
      const data = await fetchCategoryMovies(fetchUrl);
      if (data && data.length > 0) {
        // Filter out items without images to maintain high visual quality
        const filteredData = data.filter(movie => movie.backdrop_path || movie.poster_path);
        setMovies(filteredData);
      }
      setLoading(false);
    };

    loadMovies();
  }, [fetchUrl]);

  const handleScroll = (direction) => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo =
        direction === 'left'
          ? scrollLeft - clientWidth * 0.75
          : scrollLeft + clientWidth * 0.75;

      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (loading && movies.length === 0) {
    return (
      <div className="row" style={{ height: isLargeRow ? '280px' : '150px' }}>
        <h3 className="row-title">{title}</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Loading...</p>
      </div>
    );
  }

  if (movies.length === 0) return null;

  return (
    <div className="row fade-in">
      <h3 className="row-title">{title}</h3>
      <div className="row-container">
        <button
          type="button"
          className="row-arrow left"
          onClick={() => handleScroll('left')}
          aria-label="Scroll left"
        >
          <ChevronLeft size={28} />
        </button>

        <div className="row-posters" ref={rowRef}>
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              isLargeRow={isLargeRow}
              onClick={onMovieClick}
            />
          ))}
        </div>

        <button
          type="button"
          className="row-arrow right"
          onClick={() => handleScroll('right')}
          aria-label="Scroll right"
        >
          <ChevronRight size={28} />
        </button>
      </div>
    </div>
  );
};

export default Row;
