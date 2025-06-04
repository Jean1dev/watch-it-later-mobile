
import { useState } from "react";
import { Plus, Film, Tv, Link as LinkIcon } from "lucide-react";
import { useMovies } from "@/hooks/useMovies";
import { useToast } from "@/hooks/use-toast";

const AddMovie = () => {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<'movie' | 'series'>('movie');
  const [link, setLink] = useState("");
  const { addMovie } = useMovies();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Erro",
        description: "O título é obrigatório!",
        variant: "destructive",
      });
      return;
    }

    addMovie({
      title: title.trim(),
      type,
      link: link.trim() || undefined,
    });

    toast({
      title: "Sucesso!",
      description: `${type === 'movie' ? 'Filme' : 'Série'} adicionado à sua lista!`,
    });

    // Reset form
    setTitle("");
    setLink("");
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
          <Plus size={32} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Adicionar à Lista</h2>
        <p className="text-gray-600">Adicione filmes e séries que você quer assistir</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Título */}
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Título *
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Vingadores, Breaking Bad..."
            className="w-full px-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-0 transition-colors"
          />
        </div>

        {/* Tipo */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">Tipo</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setType('movie')}
              className={`flex items-center justify-center gap-2 py-4 px-4 rounded-xl font-medium transition-all ${
                type === 'movie'
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Film size={20} />
              Filme
            </button>
            <button
              type="button"
              onClick={() => setType('series')}
              className={`flex items-center justify-center gap-2 py-4 px-4 rounded-xl font-medium transition-all ${
                type === 'series'
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Tv size={20} />
              Série
            </button>
          </div>
        </div>

        {/* Link */}
        <div className="space-y-2">
          <label htmlFor="link" className="block text-sm font-medium text-gray-700">
            Link do Trailer (opcional)
          </label>
          <div className="relative">
            <LinkIcon size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              id="link"
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://..."
              className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-0 transition-colors"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-xl shadow-lg active:scale-95 transition-transform text-lg"
        >
          Adicionar à Lista
        </button>
      </form>
    </div>
  );
};

export default AddMovie;
