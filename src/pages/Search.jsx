import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { searchMovies } from '../services/tmdb';
import MovieCard from '../components/MovieCard';
import './Search.css';

const Search = ({ onMovieClick }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  // Get search query from URL parameter e.g. ?q=matrix
  const query = new URLSearchParams(location.search).get('q') || '';

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const performSearch = async () => {
      setLoading(true);
      const data = await searchMovies(query);
      setResults(data);
      setLoading(false);
    };

    // Simple debounce to prevent excessive API requests
    const timeoutId = setTimeout(() => {
      performSearch();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <div className="search-page fade-in">
      {query && (
        <h2 className="search-title">
          Showing results for: <span>"{query}"</span>
        </h2>
      )}

      {loading ? (
        <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>
          Searching...
        </div>
      ) : results.length > 0 ? (
        <div className="search-grid">
          {results.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onClick={onMovieClick}
            />
          ))}
        </div>
      ) : (
        query && (
          <div className="search-no-results fade-in">
            <div className="search-no-results-title">
              Your search for "{query}" did not find any matches.
            </div>
            <div className="search-no-results-suggestions">
              Suggestions:
              <ul>
                <li>Try different keywords</li>
                <li>Looking for a movie or TV show? Try its official name</li>
                <li>Try a genre, like comedy, romance, sports, or drama</li>
              </ul>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default Search;
