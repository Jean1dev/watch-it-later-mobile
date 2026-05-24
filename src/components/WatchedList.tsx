import { Film, Tv, Star } from "lucide-react";
import { useMovies } from "@/hooks/useMovies";
import { getImageUrl } from "@/integrations/tmdb";
import { Link } from "react-router-dom";

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        size={14}
        className={star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
      />
    ))}
  </div>
);

const WatchedList = () => {
  const { movies, loading } = useMovies();
  const watched = movies.filter((m) => m.watched);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-700">
          {watched.length} {watched.length === 1 ? "assistido" : "assistidos"}
        </h2>
      </div>

      {watched.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <Star size={32} className="text-gray-300" />
          </div>
          <p className="text-gray-500 font-medium">Nenhum filme assistido ainda</p>
          <p className="text-sm text-gray-400">
            Marque um filme como assistido para ele aparecer aqui
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {watched.map((movie) => (
            <Link to={`/media/${movie.id}`} key={movie.id} className="block">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  {movie.poster_path ? (
                    <img
                      src={getImageUrl(movie.poster_path)}
                      alt={movie.title}
                      className="w-16 h-24 object-cover rounded-lg flex-shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      {movie.type === "movie" ? (
                        <Film size={24} className="text-gray-400" />
                      ) : (
                        <Tv size={24} className="text-gray-400" />
                      )}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          movie.type === "movie"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {movie.type === "movie" ? "Filme" : "Série"}
                      </span>
                    </div>

                    <h3 className="font-semibold text-gray-800 leading-tight truncate">
                      {movie.title}
                    </h3>

                    {movie.original_title && movie.original_title !== movie.title && (
                      <p className="text-xs text-gray-500 truncate">{movie.original_title}</p>
                    )}

                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                      {movie.release_date && (
                        <span>{new Date(movie.release_date).getFullYear()}</span>
                      )}
                      {movie.vote_average != null && (
                        <span className="flex items-center gap-1">
                          <span className="text-yellow-500">★</span>
                          {movie.vote_average.toFixed(1)}
                        </span>
                      )}
                    </div>

                    <div className="mt-2">
                      {movie.rating != null ? (
                        <div className="flex items-center gap-2">
                          <StarRating rating={movie.rating} />
                          <span className="text-xs text-gray-500">Minha nota</span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">Sem nota</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default WatchedList;
