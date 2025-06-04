
import { useState, useEffect } from "react";

export interface Movie {
  id: string;
  title: string;
  type: 'movie' | 'series';
  link?: string;
  createdAt: string;
}

const STORAGE_KEY = 'movielist-app-movies';

export const useMovies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  // Load movies from localStorage on mount
  useEffect(() => {
    const savedMovies = localStorage.getItem(STORAGE_KEY);
    if (savedMovies) {
      try {
        setMovies(JSON.parse(savedMovies));
      } catch (error) {
        console.error('Error loading movies from localStorage:', error);
        setMovies([]);
      }
    }
  }, []);

  // Save movies to localStorage whenever movies array changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(movies));
  }, [movies]);

  const addMovie = (movieData: Omit<Movie, 'id' | 'createdAt'>) => {
    const newMovie: Movie = {
      ...movieData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };

    setMovies(prev => [newMovie, ...prev]);
  };

  const removeMovie = (id: string) => {
    setMovies(prev => prev.filter(movie => movie.id !== id));
  };

  const getMovieById = (id: string) => {
    return movies.find(movie => movie.id === id);
  };

  return {
    movies,
    addMovie,
    removeMovie,
    getMovieById,
  };
};
