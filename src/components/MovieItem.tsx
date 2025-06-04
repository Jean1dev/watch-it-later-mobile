import { Film, Tv, ExternalLink, Trash2 } from "lucide-react";
import { Movie, useMovies } from "@/hooks/useMovies";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { getImageUrl } from "@/integrations/tmdb";

interface MovieItemProps {
  movie: Movie;
}

const MovieItem = ({ movie }: MovieItemProps) => {
  const { removeMovie } = useMovies();
  const { toast } = useToast();

  const handleRemove = async () => {
    await removeMovie(movie.id);
    toast({
      title: "Removido!",
      description: `${movie.title} foi removido da sua lista.`,
    });
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    if (movie.link) {
      e.preventDefault();
      window.open(movie.link, '_blank');
    }
  };

  return (
    <Link to={`/media/${movie.id}`} className="block">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-3 hover:shadow-md transition-shadow">
        <div className="flex items-start gap-4">
          {movie.poster_path ? (
            <img
              src={getImageUrl(movie.poster_path)}
              alt={movie.title}
              className="w-20 h-30 object-cover rounded-lg"
            />
          ) : (
            <div className="w-20 h-30 bg-gray-100 rounded-lg flex items-center justify-center">
              {movie.type === 'movie' ? (
                <Film size={24} className="text-gray-400" />
              ) : (
                <Tv size={24} className="text-gray-400" />
              )}
            </div>
          )}

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {movie.type === 'movie' ? (
                <Film size={16} className="text-purple-500" />
              ) : (
                <Tv size={16} className="text-blue-500" />
              )}
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                movie.type === 'movie' 
                  ? 'bg-purple-100 text-purple-700' 
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {movie.type === 'movie' ? 'Filme' : 'Série'}
              </span>
            </div>
            
            <h3 className="font-semibold text-gray-800 text-lg leading-tight">
              {movie.title}
            </h3>

            {movie.original_title && movie.original_title !== movie.title && (
              <p className="text-sm text-gray-500">{movie.original_title}</p>
            )}
            
            <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
              {movie.release_date && (
                <span>{new Date(movie.release_date).getFullYear()}</span>
              )}
              {movie.vote_average && (
                <span className="flex items-center gap-1">
                  <span className="text-yellow-500">★</span>
                  {movie.vote_average.toFixed(1)}
                </span>
              )}
              {movie.runtime && (
                <span>{movie.runtime} min</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {movie.link && (
              <button
                onClick={handleLinkClick}
                className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                title="Ver trailer"
              >
                <ExternalLink size={18} />
              </button>
            )}
            
            <button
              onClick={handleRemove}
              className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Remover da lista"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieItem;
