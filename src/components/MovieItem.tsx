
import { Film, Tv, ExternalLink, Trash2 } from "lucide-react";
import { Movie, useMovies } from "@/hooks/useMovies";
import { useToast } from "@/hooks/use-toast";

interface MovieItemProps {
  movie: Movie;
}

const MovieItem = ({ movie }: MovieItemProps) => {
  const { removeMovie } = useMovies();
  const { toast } = useToast();

  const handleRemove = () => {
    removeMovie(movie.id);
    toast({
      title: "Removido!",
      description: `${movie.title} foi removido da sua lista.`,
    });
  };

  const handleLinkClick = () => {
    if (movie.link) {
      window.open(movie.link, '_blank');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-3">
      <div className="flex items-start justify-between">
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
          
          <p className="text-sm text-gray-500 mt-1">
            Adicionado em {new Date(movie.createdAt).toLocaleDateString('pt-BR')}
          </p>
        </div>

        <div className="flex items-center gap-2 ml-3">
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
  );
};

export default MovieItem;
