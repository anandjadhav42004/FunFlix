import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Search, Bell, Menu } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync state with url query params if we are on the search page
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q') || '';
    setSearchQuery(query);
    if (query) {
      setIsSearchActive(true);
    }
  }, [location.search]);

  // Click outside to collapse search
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target) &&
        !searchQuery
      ) {
        setIsSearchActive(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchQuery]);

  const handleSearchClick = () => {
    setIsSearchActive(true);
    setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 100);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.trim()) {
      navigate(`/search?q=${encodeURIComponent(value)}`);
    } else {
      navigate('/');
    }
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-left">
        <Link to="/" className="nav-logo">FunFlix</Link>
        <ul className="nav-links">
          <li>
            <Link to="/" className={`nav-item ${location.pathname === '/' && !location.search ? 'active' : ''}`}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/search?q=tv+series" className={`nav-item ${location.search === '?q=tv+series' ? 'active' : ''}`}>
              TV Shows
            </Link>
          </li>
          <li>
            <Link to="/search?q=movies" className={`nav-item ${location.search === '?q=movies' ? 'active' : ''}`}>
              Movies
            </Link>
          </li>
          <li>
            <Link to="/search?q=new+popular" className={`nav-item ${location.search === '?q=new+popular' ? 'active' : ''}`}>
              New &amp; Popular
            </Link>
          </li>
          <li>
            <Link to="/my-list" className={`nav-item ${location.pathname === '/my-list' ? 'active' : ''}`}>
              My List
            </Link>
          </li>
        </ul>
      </div>

      <div className="navbar-right">
        <div 
          ref={searchContainerRef}
          className={`search-container ${isSearchActive ? 'active' : ''}`}
        >
          <button 
            type="button" 
            className="search-icon-btn" 
            onClick={handleSearchClick}
          >
            <Search size={20} />
          </button>
          <input
            ref={searchInputRef}
            type="text"
            className="search-input"
            placeholder="Titles, people, genres..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        <span className="nav-item">Kids</span>
        <button type="button" className="nav-item">
          <Bell size={20} />
        </button>

        <div className="profile-container">
          <img 
            className="profile-avatar" 
            src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png" 
            alt="Profile Avatar" 
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
