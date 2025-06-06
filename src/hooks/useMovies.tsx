import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { searchMovie, searchSeries } from "@/integrations/tmdb";

export interface Movie {
  id: string;
  title: string;
  original_title: string;
  type: 'movie' | 'series';
  link?: string;
  created_at: string;
  poster_path?: string;
  release_date?: string;
  vote_average?: number;
  genres?: string[];
  runtime?: number;
  overview?: string;
  tmdb_id?: number;
  watched?: boolean;
  rating?: number;
}

export const useMovies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadMovies = async () => {
    try {
      const { data, error } = await supabase
        .from('watchlist')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar filmes:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os filmes.",
          variant: "destructive",
        });
        return;
      }

      setMovies((data || []) as Movie[]);
    } catch (error) {
      console.error('Erro ao carregar filmes:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os filmes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovies();
  }, []);

  const addMovie = async (movieData: Omit<Movie, 'id' | 'created_at'>) => {
    try {
      let tmdbData = null;
      
      if (movieData.type === 'movie') {
        tmdbData = await searchMovie(movieData.title);
      } else {
        tmdbData = await searchSeries(movieData.title);
      }

      if (tmdbData) {
        const enrichedData = {
          ...movieData,
          original_title: tmdbData.original_title || tmdbData.original_name,
          poster_path: tmdbData.poster_path,
          release_date: tmdbData.release_date || tmdbData.first_air_date,
          vote_average: tmdbData.vote_average,
          genres: tmdbData.genres.map((g: any) => g.name),
          runtime: movieData.type === 'movie' ? tmdbData.runtime : tmdbData.episode_run_time?.[0],
          overview: tmdbData.overview,
          tmdb_id: tmdbData.id,
        };

        const { data, error } = await supabase
          .from('watchlist')
          .insert([enrichedData])
          .select()
          .single();

        if (error) throw error;

        setMovies(prev => [data as Movie, ...prev]);
        toast({
          title: "Sucesso!",
          description: `${movieData.type === 'movie' ? 'Filme' : 'Série'} adicionado à sua lista!`,
        });
      } else {
        const { data, error } = await supabase
          .from('watchlist')
          .insert([movieData])
          .select()
          .single();

        if (error) throw error;

        setMovies(prev => [data as Movie, ...prev]);
        toast({
          title: "Aviso",
          description: `${movieData.type === 'movie' ? 'Filme' : 'Série'} adicionado, mas não foi possível encontrar informações adicionais.`,
        });
      }
    } catch (error) {
      console.error('Erro ao adicionar filme:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o filme.",
        variant: "destructive",
      });
    }
  };

  const removeMovie = async (id: string) => {
    try {
      const { error } = await supabase
        .from('watchlist')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMovies(prev => prev.filter(movie => movie.id !== id));
    } catch (error) {
      console.error('Erro ao remover filme:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o filme.",
        variant: "destructive",
      });
    }
  };

  const getMovieById = (id: string) => {
    return movies.find(movie => movie.id === id);
  };

  const markAsWatched = async (id: string, rating: number | null) => {
    try {
      const { error } = await supabase
        .from('watchlist')
        .update({ watched: true, rating })
        .eq('id', id);

      if (error) throw error;

      setMovies(prev => prev.map(movie => 
        movie.id === id ? { ...movie, watched: true, rating } : movie
      ));

      toast({
        title: "Sucesso!",
        description: "Filme marcado como assistido!",
      });
    } catch (error) {
      console.error('Erro ao marcar filme como assistido:', error);
      toast({
        title: "Erro",
        description: "Não foi possível marcar o filme como assistido.",
        variant: "destructive",
      });
    }
  };

  return {
    movies,
    loading,
    addMovie,
    removeMovie,
    getMovieById,
    markAsWatched,
  };
};
