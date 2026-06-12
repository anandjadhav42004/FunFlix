import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import './MyList.css';

const MyList = ({ onMovieClick }) => {
  const [myList, setMyList] = useState([]);

  const loadList = () => {
    const list = JSON.parse(localStorage.getItem('funflix_mylist') || '[]');
    setMyList(list);
  };

  useEffect(() => {
    loadList();

    // Listen to changes from modals or individual cards
    window.addEventListener('mylist_updated', loadList);
    return () => window.removeEventListener('mylist_updated', loadList);
  }, []);

  return (
    <div className="mylist-page fade-in">
      <h2 className="mylist-title">My List</h2>

      {myList.length > 0 ? (
        <div className="mylist-grid">
          {myList.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onClick={onMovieClick}
            />
          ))}
        </div>
      ) : (
        <div className="mylist-empty fade-in">
          <div className="mylist-empty-title">Your list is empty.</div>
          <p className="mylist-empty-desc">
            Explore popular categories, discover new releases, and add movies or TV shows to save them for later!
          </p>
          <Link to="/" className="mylist-browse-btn">
            Browse Home
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyList;
