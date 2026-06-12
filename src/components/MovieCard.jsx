import React, { useState, useEffect } from 'react';
import { Play, Plus, Check } from 'lucide-react';
import { getImageUrl } from '../services/tmdb';
import './MovieCard.css';

const MovieCard = ({ movie, isLargeRow = false, onClick }) => {
  const [isInList, setIsInList] = useState(false);

  useEffect(() => {
    if (!movie) return;
    const list = JSON.parse(localStorage.getItem('funflix_mylist') || '[]');
    setIsInList(list.some((item) => item.id === movie.id));

    // Listen to changes from other components/modals
    const handleListUpdate = () => {
      const currentList = JSON.parse(localStorage.getItem('funflix_mylist') || '[]');
      setIsInList(currentList.some((item) => item.id === movie.id));
    };

    window.addEventListener('mylist_updated', handleListUpdate);
    return () => window.removeEventListener('mylist_updated', handleListUpdate);
  }, [movie]);

  if (!movie) return null;

  const imagePath = isLargeRow ? movie.poster_path : movie.backdrop_path || movie.poster_path;
  const imageUrl = getImageUrl(imagePath, isLargeRow ? 'w342' : 'w780');

  const title = movie.title || movie.name || movie.original_name || 'Untitled';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'NR';
  const releaseDate = movie.release_date || movie.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : '';

  const toggleList = (e) => {
    e.stopPropagation(); // Prevent opening detail modal
    const list = JSON.parse(localStorage.getItem('funflix_mylist') || '[]');
    let updatedList = [];
    if (isInList) {
      updatedList = list.filter((item) => item.id !== movie.id);
    } else {
      updatedList = [...list, movie];
    }
    localStorage.setItem('funflix_mylist', JSON.stringify(updatedList));
    setIsInList(!isInList);
    window.dispatchEvent(new Event('mylist_updated'));
  };

  const handleCardClick = () => {
    console.log('[MovieCard] Card clicked for movie:', movie.id, title);
    if (onClick) {
      onClick(movie);
    } else {
      console.warn('[MovieCard] onClick handler is not defined');
    }
  };

  return (
    <div 
      className={`movie-card ${isLargeRow ? 'large' : ''}`}
      onClick={handleCardClick}
    >
      <img 
        src={imageUrl} 
        alt={title} 
        className="movie-card-img" 
        loading="lazy" 
      />

      <div className="movie-card-overlay">
        <div className="movie-card-top-actions">
        <button
            type="button"
            className="movie-card-play-btn"
            onClick={(e) => { e.stopPropagation(); handleCardClick(); }}
            title={`Play ${title}`}
          >
            <Play size={16} fill="currentColor" />
          </button>
          <button 
            type="button" 
            className={`movie-card-list-btn ${isInList ? 'in-list' : ''}`} 
            onClick={toggleList}
            title={isInList ? 'Remove from My List' : 'Add to My List'}
          >
            {isInList ? <Check size={16} /> : <Plus size={16} />}
          </button>
        </div>
        <div className="movie-card-title">{title}</div>
        <div className="movie-card-info">
          <span className="movie-card-rating">{rating} Rating</span>
          {year && <span className="movie-card-year">{year}</span>}
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
