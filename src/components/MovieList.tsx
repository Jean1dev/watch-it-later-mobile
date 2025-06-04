
import { Search } from "lucide-react";
import { useState } from "react";
import { useMovies } from "@/hooks/useMovies";
import MovieItem from "./MovieItem";

const MovieList = () => {
  const { movies, loading } = useMovies();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
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
        <p className="text-gray-600">{movies.length} {movies.length === 1 ? 'item' : 'itens'} na sua lista</p>
      </div>

      {/* Search */}
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
