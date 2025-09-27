import { Search, Filter } from "lucide-react";
import { useState, useEffect } from "react";
import { useMovies } from "@/hooks/useMovies";
import { getStreamingProviders } from "@/integrations/tmdb";
import MovieItem from "./MovieItem";

const MovieList = () => {
  const { movies, loading } = useMovies();
  const [searchTerm, setSearchTerm] = useState("");
  const [showOnlyAvailableInBrazil, setShowOnlyAvailableInBrazil] = useState(false);
  const [availableMovies, setAvailableMovies] = useState<Set<string>>(new Set());
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  useEffect(() => {
    const checkAvailability = async () => {
      if (!showOnlyAvailableInBrazil) {
        setAvailableMovies(new Set());
        return;
      }

      setCheckingAvailability(true);
      const availableSet = new Set<string>();
      
      const unwatchedMovies = movies.filter(movie => !movie.watched);
      
      for (const movie of unwatchedMovies) {
        if (!movie.tmdb_id) continue;
        
        try {
          const providers = await getStreamingProviders(movie.tmdb_id, movie.type);
          if (providers.length > 0) {
            availableSet.add(movie.id);
          }
        } catch (error) {
          console.error('Error checking streaming availability:', error);
        }
      }
      
      setAvailableMovies(availableSet);
      setCheckingAvailability(false);
    };

    checkAvailability();
  }, [showOnlyAvailableInBrazil, movies]);

  const filteredMovies = movies
    .filter(movie => !movie.watched)
    .filter(movie =>
      movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(movie => 
      !showOnlyAvailableInBrazil || availableMovies.has(movie.id)
    );

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center animate-pulse">
          <Search size={32} className="text-gray-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Carregando...</h2>
        <p className="text-gray-600">Buscando seus filmes e séries</p>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <Search size={32} className="text-gray-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Lista Vazia</h2>
        <p className="text-gray-600">Adicione filmes e séries para começar!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Minha Lista</h2>
        <p className="text-gray-600">{filteredMovies.length} {filteredMovies.length === 1 ? 'item' : 'itens'} na sua lista</p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar na lista..."
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-0 transition-colors"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-500" />
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={showOnlyAvailableInBrazil}
              onChange={(e) => setShowOnlyAvailableInBrazil(e.target.checked)}
              disabled={checkingAvailability}
              className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 disabled:opacity-50"
            />
            <span>
              {checkingAvailability ? 'Verificando disponibilidade...' : 'Disponíveis no Brasil'}
            </span>
          </label>
        </div>
      </div>

      {/* Movies List */}
      <div className="space-y-3">
        {filteredMovies.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Nenhum resultado encontrado</p>
          </div>
        ) : (
          filteredMovies.map((movie) => (
            <MovieItem key={movie.id} movie={movie} />
          ))
        )}
      </div>
    </div>
  );
};

export default MovieList;
