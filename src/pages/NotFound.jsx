import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="notfound-page fade-in">
      <h1 className="notfound-title">Lost Your Way?</h1>
      <p className="notfound-desc">
        Sorry, we can't find that page. You'll find lots to explore on the home page.
      </p>
      <Link to="/" className="notfound-btn">
        FunFlix Home
      </Link>
    </div>
  );
};

export default NotFound;
