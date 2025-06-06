import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { getImageUrl, getStreamingProviders } from '../integrations/tmdb';
import { ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { useMovies } from '@/hooks/useMovies';
import RatingModal from '@/components/RatingModal';

interface MediaDetails {
  id: string;
  title: string;
  original_title: string;
  release_date: string;
  poster_path: string;
  vote_average: number;
  genres: string[];
  runtime: number;
  overview: string;
  type: 'movie' | 'series';
  tmdb_id?: number;
  watched?: boolean;
}

interface StreamingProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
}

export function MediaDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [media, setMedia] = useState<MediaDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [streamingProviders, setStreamingProviders] = useState<StreamingProvider[]>([]);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const { markAsWatched } = useMovies();

  useEffect(() => {
    async function fetchMediaDetails() {
      try {
        const { data, error } = await supabase
          .from('watchlist')
          .select('*')
          .eq('id', id)
          .single();
        if (error) throw error;
        setMedia({...data, type: data.type as 'movie' | 'series'});
      } catch (error) {
        console.error('Error fetching media details:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchMediaDetails();
  }, [id]);

  useEffect(() => {
    async function fetchStreamingProviders() {
      if (!media?.tmdb_id) return;
      
      try {
        const providers = await getStreamingProviders(media.tmdb_id, media.type);
        setStreamingProviders(providers);
      } catch (error) {
        console.error('Error fetching streaming providers:', error);
      }
    }

    fetchStreamingProviders();
  }, [media?.tmdb_id, media?.type]);

  const handleMarkAsWatched = () => {
    setIsRatingModalOpen(true);
  };

  const handleRate = async (rating: number | null) => {
    if (!media) return;
    await markAsWatched(media.id, rating);
    setMedia(prev => prev ? { ...prev, watched: true, rating } : null);
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Carregando...</div>;
  }

  if (!media) {
    return <div className="flex justify-center items-center min-h-screen">Mídia não encontrada</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={20} />
          Voltar para a lista
        </button>

        {!media.watched && (
          <button
            onClick={handleMarkAsWatched}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <Check size={20} />
            Já assisti
          </button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3">
          <img
            src={getImageUrl(media.poster_path)}
            alt={media.title}
            className="w-full rounded-lg shadow-lg"
          />
        </div>
        <div className="w-full md:w-2/3">
          <h1 className="text-3xl font-bold mb-2">{media.title}</h1>
          <p className="text-gray-600 mb-4">{media.original_title}</p>
          
          <div className="flex items-center gap-4 mb-4">
            <span className="bg-yellow-400 text-black px-3 py-1 rounded-full">
              {media.vote_average.toFixed(1)}/10
            </span>
            <span className="text-gray-600">{media.release_date}</span>
            <span className="text-gray-600">
              {media.type === 'movie' ? `${media.runtime} min` : 'Série'}
            </span>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Gêneros</h2>
            <div className="flex flex-wrap gap-2">
              {media.genres.map((genre, index) => (
                <span
                  key={index}
                  className="bg-gray-200 px-3 py-1 rounded-full text-sm"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Onde Assistir</h2>
            {streamingProviders.length > 0 ? (
              <div className="flex flex-wrap gap-4">
                {streamingProviders.map((provider) => (
                  <a
                    key={provider.provider_id}
                    href="#"
                    className="flex items-center justify-center w-12 h-12 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={getImageUrl(provider.logo_path)}
                      alt={provider.provider_name}
                      className="w-8 h-8 object-contain"
                    />
                  </a>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-gray-500 bg-gray-100 px-4 py-3 rounded-lg">
                <AlertCircle size={20} />
                <span>Não disponível em streaming no Brasil</span>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Sinopse</h2>
            <p className="text-gray-700 leading-relaxed">{media.overview}</p>
          </div>
        </div>
      </div>

      <RatingModal
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        onRate={handleRate}
        title={media.title}
      />
    </div>
  );
} 