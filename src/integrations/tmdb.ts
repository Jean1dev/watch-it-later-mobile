import axios from 'axios';

const TMDB_API_KEY = "3d22081cae0e925800702333596e462e";
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

interface TMDBMovie {
  id: number;
  title: string;
  original_title: string;
  release_date: string;
  poster_path: string;
  vote_average: number;
  genres: { id: number; name: string }[];
  runtime: number;
  overview: string;
}

interface TMDBSeries {
  id: number;
  name: string;
  original_name: string;
  first_air_date: string;
  poster_path: string;
  vote_average: number;
  genres: { id: number; name: string }[];
  episode_run_time: number[];
  overview: string;
}

export const searchMovie = async (query: string): Promise<TMDBMovie | null> => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
      params: {
        api_key: TMDB_API_KEY,
        query,
        language: 'pt-BR'
      }
    });

    if (response.data.results.length > 0) {
      const movieId = response.data.results[0].id;
      const details = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}`, {
        params: {
          api_key: TMDB_API_KEY,
          language: 'pt-BR'
        }
      });
      return details.data;
    }
    return null;
  } catch (error) {
    console.error('Error searching movie:', error);
    return null;
  }
};

export const searchSeries = async (query: string): Promise<TMDBSeries | null> => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/search/tv`, {
      params: {
        api_key: TMDB_API_KEY,
        query,
        language: 'pt-BR'
      }
    });

    if (response.data.results.length > 0) {
      const seriesId = response.data.results[0].id;
      const details = await axios.get(`${TMDB_BASE_URL}/tv/${seriesId}`, {
        params: {
          api_key: TMDB_API_KEY,
          language: 'pt-BR'
        }
      });
      return details.data;
    }
    return null;
  } catch (error) {
    console.error('Error searching series:', error);
    return null;
  }
};

export const getImageUrl = (path: string) => {
  return `https://image.tmdb.org/t/p/w500${path}`;
}; 