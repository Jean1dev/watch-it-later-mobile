
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Movie {
  id: string;
  title: string;
  type: 'movie' | 'series';
  link?: string;
  created_at: string;
}

export const useMovies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Carregar filmes do Supabase
  const loadMovies = async () => {
    try {
      const { data, error } = await supabase
        .from('movies')
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

      // Type assertion para garantir compatibilidade com nossa interface
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
      const { data, error } = await supabase
        .from('movies')
        .insert([movieData])
        .select()
        .single();

      if (error) {
        console.error('Erro ao adicionar filme:', error);
        toast({
          title: "Erro",
          description: "Não foi possível adicionar o filme.",
          variant: "destructive",
        });
        return;
      }

      // Type assertion para o dado retornado
      setMovies(prev => [data as Movie, ...prev]);
      toast({
        title: "Sucesso!",
        description: `${movieData.type === 'movie' ? 'Filme' : 'Série'} adicionado à sua lista!`,
      });
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
        .from('movies')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao remover filme:', error);
        toast({
          title: "Erro",
          description: "Não foi possível remover o filme.",
          variant: "destructive",
        });
        return;
      }

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

  return {
    movies,
    loading,
    addMovie,
    removeMovie,
    getMovieById,
  };
};
