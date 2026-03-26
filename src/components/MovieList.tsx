import { Search, Filter } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useMovies } from "@/hooks/useMovies";
import {
  getStreamingProviders,
  STREAMING_FILTER_OPTIONS,
  type StreamingFilterId,
} from "@/integrations/tmdb";
import MovieItem from "./MovieItem";

const MovieList = () => {
  const { movies, loading } = useMovies();
  const [searchTerm, setSearchTerm] = useState("");
  const [showOnlyAvailableInBrazil, setShowOnlyAvailableInBrazil] = useState(false);
  const [streamingFilterIds, setStreamingFilterIds] = useState<Set<StreamingFilterId>>(
    () => new Set()
  );
  const [movieProviderIds, setMovieProviderIds] = useState<Map<string, number[]>>(
    () => new Map()
  );
  const [loadingProviders, setLoadingProviders] = useState(false);

  const needsProviderData =
    showOnlyAvailableInBrazil || streamingFilterIds.size > 0;

  useEffect(() => {
    const loadProviders = async () => {
      if (!needsProviderData) {
        setMovieProviderIds(new Map());
        return;
      }

      setLoadingProviders(true);
      const next = new Map<string, number[]>();
      const unwatchedMovies = movies.filter((movie) => !movie.watched);

      for (const movie of unwatchedMovies) {
        if (!movie.tmdb_id) continue;

        try {
          const providers = await getStreamingProviders(movie.tmdb_id, movie.type);
          const ids = [...new Set(providers.map((p) => p.provider_id))];
          next.set(movie.id, ids);
        } catch (error) {
          console.error("Error checking streaming availability:", error);
        }
      }

      setMovieProviderIds(next);
      setLoadingProviders(false);
    };

    loadProviders();
  }, [needsProviderData, movies]);

  const wantedProviderIds = useMemo(() => {
    const set = new Set<number>();
    for (const fid of streamingFilterIds) {
      const opt = STREAMING_FILTER_OPTIONS.find((o) => o.id === fid);
      opt?.providerIds.forEach((id) => set.add(id));
    }
    return set;
  }, [streamingFilterIds]);

  const toggleStreamingFilter = (id: StreamingFilterId) => {
    setStreamingFilterIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredMovies = movies
    .filter((movie) => !movie.watched)
    .filter((movie) =>
      movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((movie) => {
      if (!showOnlyAvailableInBrazil) return true;
      const ids = movieProviderIds.get(movie.id);
      return Boolean(ids && ids.length > 0);
    })
    .filter((movie) => {
      if (streamingFilterIds.size === 0) return true;
      const ids = movieProviderIds.get(movie.id) ?? [];
      return ids.some((pid) => wantedProviderIds.has(pid));
    });

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
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-500 shrink-0" />
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={showOnlyAvailableInBrazil}
                onChange={(e) => setShowOnlyAvailableInBrazil(e.target.checked)}
                disabled={loadingProviders}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 disabled:opacity-50"
              />
              <span>
                {showOnlyAvailableInBrazil && loadingProviders
                  ? "Verificando disponibilidade..."
                  : "Disponíveis no Brasil"}
              </span>
            </label>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-2">Streaming</p>
            <div className="flex flex-wrap gap-2">
              {STREAMING_FILTER_OPTIONS.map((opt) => {
                const active = streamingFilterIds.has(opt.id);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => toggleStreamingFilter(opt.id)}
                    disabled={loadingProviders}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border-2 transition-colors disabled:opacity-50 ${
                      active
                        ? "border-purple-600 bg-purple-50 text-purple-800"
                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
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
