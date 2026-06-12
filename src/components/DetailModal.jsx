import React, { useState, useEffect } from 'react';
import { X, Play, Plus, Check, Star } from 'lucide-react';
import tmdb, { fetchMediaDetails, getImageUrl } from '../services/tmdb';
import './DetailModal.css';

const DetailModal = ({ movie, onClose, autoPlayTrailer = false }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [trailerKey, setTrailerKey] = useState(null);
  const [isPlayingTrailer, setIsPlayingTrailer] = useState(false);
  const [isInList, setIsInList] = useState(false);

  // Determine media type
  const isTv = movie.first_air_date || movie.name || movie.media_type === 'tv';
  const mediaType = isTv ? 'tv' : 'movie';

  useEffect(() => {
    if (!movie) return;

    const getDetails = async () => {
      setLoading(true);
      const data = await fetchMediaDetails(movie.id, mediaType);
      if (data) {
        setDetails(data);
      }

      // Fetch trailer
      try {
        const videosResponse = await tmdb.get(`/${mediaType}/${movie.id}/videos`);
        const videos = videosResponse.data.results || [];
        const trailer = videos.find(
          (v) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
        ) || videos[0];
        
        if (trailer) {
          setTrailerKey(trailer.key);
        } else {
          setTrailerKey(null);
        }
      } catch (err) {
        console.error('Error fetching trailer videos:', err);
        setTrailerKey(null);
      }

      setLoading(false);
    };

    getDetails();
    // Reset player state on movie change; autoPlayTrailer will be handled after trailerKey loads
    setIsPlayingTrailer(false);
  }, [movie, mediaType]);

  // Auto-play trailer when autoPlayTrailer prop is true and trailerKey becomes available
  useEffect(() => {
    if (autoPlayTrailer && trailerKey) {
      setIsPlayingTrailer(true);
    }
  }, [autoPlayTrailer, trailerKey]);

  // Sync My List state
  useEffect(() => {
    if (!movie) return;
    const list = JSON.parse(localStorage.getItem('funflix_mylist') || '[]');
    setIsInList(list.some((item) => item.id === movie.id));

    const handleListUpdate = () => {
      const currentList = JSON.parse(localStorage.getItem('funflix_mylist') || '[]');
      setIsInList(currentList.some((item) => item.id === movie.id));
    };

    window.addEventListener('mylist_updated', handleListUpdate);
    return () => window.removeEventListener('mylist_updated', handleListUpdate);
  }, [movie]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!movie) return null;

  const displayTitle = details?.title || details?.name || movie.title || movie.name || 'Untitled';
  const displayOverview = details?.overview || movie.overview || 'No description available.';
  const displayRating = details?.vote_average || movie.vote_average || 0;
  const displayVotes = details?.vote_count || movie.vote_count || 0;
  
  const releaseDateStr = details?.release_date || details?.first_air_date || movie.release_date || movie.first_air_date;
  const displayYear = releaseDateStr ? new Date(releaseDateStr).getFullYear() : 'N/A';

  const backdropUrl = getImageUrl(details?.backdrop_path || movie.backdrop_path, 'original');
  const genres = details?.genres || [];

  const handleBackdropClick = (e) => {
    // Use currentTarget comparison so it works regardless of compound class names
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const toggleList = () => {
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

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="modal-content" tabIndex={-1}>
        <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <div 
          className="modal-hero"
          style={{ backgroundImage: isPlayingTrailer && trailerKey ? 'none' : `url("${backdropUrl}")` }}
        >
          {isPlayingTrailer && trailerKey ? (
            <div className="modal-hero-player">
              <iframe
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=0&rel=0&modestbranding=1`}
                title={`${displayTitle} Trailer`}
                width="100%"
                height="100%"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          ) : (
            <>
              <div className="modal-hero-fade"></div>
              <h2 className="modal-hero-title">{displayTitle}</h2>
              {trailerKey && (
                <button 
                  type="button" 
                  className="modal-hero-play-btn"
                  onClick={() => setIsPlayingTrailer(true)}
                >
                  <Play size={18} fill="currentColor" /> Play Trailer
                </button>
              )}
            </>
          )}
        </div>

        <div className="modal-body">
          <div className="modal-left">
            <div className="modal-metadata">
              <span className="modal-match">
                {Math.round(displayRating * 10)}% Match
              </span>
              <span className="modal-year">{displayYear}</span>
              {details?.runtime && (
                <span className="modal-duration">
                  {Math.floor(details.runtime / 60)}h {details.runtime % 60}m
                </span>
              )}
              {details?.number_of_seasons && (
                <span className="modal-seasons">
                  {details.number_of_seasons} {details.number_of_seasons === 1 ? 'Season' : 'Seasons'}
                </span>
              )}
              <span className="modal-rating-badge">HD</span>
            </div>

            <p className="modal-overview">{displayOverview}</p>

            <div className="modal-actions">
              <button 
                type="button" 
                className={`modal-btn-list ${isInList ? 'in-list' : ''}`}
                onClick={toggleList}
              >
                {isInList ? <Check size={18} /> : <Plus size={18} />}
                {isInList ? 'Remove from My List' : 'Add to My List'}
              </button>
            </div>
          </div>

          <div className="modal-right">
            <div className="modal-meta-row">
              <span className="modal-meta-label">Rating: </span>
              <span className="modal-meta-value">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  {displayRating.toFixed(1)} <Star size={14} fill="#e50914" color="#e50914" />
                  ({displayVotes} votes)
                </span>
              </span>
            </div>

            {details?.status && (
              <div className="modal-meta-row">
                <span className="modal-meta-label">Status: </span>
                <span className="modal-meta-value">{details.status}</span>
              </div>
            )}

            <div className="modal-meta-row">
              <span className="modal-meta-label">Genres: </span>
              <div className="modal-genres">
                {genres.length > 0 ? (
                  genres.map((g) => (
                    <span key={g.id} className="modal-genre-tag">
                      {g.name}
                    </span>
                  ))
                ) : (
                  <span className="modal-meta-value">N/A</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
