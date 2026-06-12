import axios from 'axios';

const API_KEY = 
  import.meta.env.REACT_APP_TMDB_KEY || 
  import.meta.env.VITE_TMDB_API_KEY || 
  import.meta.env.VITE_TMDB_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

// Console warning if API key is missing to help with debugging
if (!API_KEY) {
  console.warn(
    'TMDB API key is missing. Please set REACT_APP_TMDB_KEY, VITE_TMDB_API_KEY, or VITE_TMDB_KEY in your environment/dotenv file.'
  );
} else {
  console.log(`[TMDB] API Key loaded successfully: ${API_KEY.substring(0, 5)}...${API_KEY.substring(API_KEY.length - 4)}`);
}

const tmdb = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'en-US',
  },
});

export const requests = {
  fetchTrending: '/trending/all/week',
  fetchNetflixOriginals: '/discover/tv?with_networks=213',
  fetchTopRated: '/movie/top_rated',
  fetchActionMovies: '/discover/movie?with_genres=28',
  fetchComedyMovies: '/discover/movie?with_genres=35',
  fetchHorrorMovies: '/discover/movie?with_genres=27',
  fetchRomanceMovies: '/discover/movie?with_genres=10749',
  fetchDocumentaries: '/discover/movie?with_genres=99',
};

// Helper function to build image URLs
export const getImageUrl = (path, size = 'original') => {
  if (!path) return 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=1080'; // fallback
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

// Fetch movies/shows for a category URL
export const fetchCategoryMovies = async (url) => {
  try {
    console.log(`[TMDB] Fetching category movies from: ${url} (API Key: ${API_KEY ? 'Present' : 'Missing'})`);
    const response = await tmdb.get(url);
    console.log(`[TMDB] Successful fetch from ${url}. Results count:`, response.data.results?.length);
    return response.data.results || [];
  } catch (error) {
    console.error(`[TMDB] Error fetching category movies from ${url}:`, error.message, error.response?.data);
    return [];
  }
};

// Search movies
export const searchMovies = async (query) => {
  try {
    console.log(`[TMDB] Searching for: "${query}"`);
    const response = await tmdb.get('/search/multi', {
      params: {
        query,
        include_adult: false,
      },
    });
    console.log(`[TMDB] Search results count:`, response.data.results?.length);
    // Filter to return only results with a poster/backdrop and either movie/tv media type
    return (response.data.results || []).filter(
      (item) => (item.media_type === 'movie' || item.media_type === 'tv') && (item.poster_path || item.backdrop_path)
    );
  } catch (error) {
    console.error(`[TMDB] Error searching movies for "${query}":`, error.message, error.response?.data);
    return [];
  }
};

// Fetch details for a specific media item (with genres)
export const fetchMediaDetails = async (id, mediaType = 'movie') => {
  try {
    console.log(`[TMDB] Fetching details for ${mediaType} ID: ${id}`);
    const response = await tmdb.get(`/${mediaType}/${id}`);
    console.log(`[TMDB] Details for ID ${id} loaded successfully.`);
    return response.data;
  } catch (error) {
    console.error(`[TMDB] Error fetching details for ${mediaType} with ID ${id}:`, error.message, error.response?.data);
    return null;
  }
};

export default tmdb;
