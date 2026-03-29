import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { getImageUrl, getStreamingProviders, StreamingProvider } from '../integrations/tmdb';
import { ArrowLeft, Check, AlertCircle, Tv, ShoppingCart, Clock, ExternalLink } from 'lucide-react';
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
  rating?: number;
}

const CATEGORY_CONFIG = {
  flatrate: {
    label: 'Incluído na Assinatura',
    icon: Tv,
    gradient: 'from-purple-500 to-blue-500',
    badgeBg: 'bg-purple-100 text-purple-700',
    border: 'border-purple-200',
    iconColor: 'text-purple-500',
  },
  rent: {
    label: 'Alugar',
    icon: Clock,
    gradient: 'from-amber-400 to-orange-500',
    badgeBg: 'bg-amber-100 text-amber-700',
    border: 'border-amber-200',
    iconColor: 'text-amber-500',
  },
  buy: {
    label: 'Comprar',
    icon: ShoppingCart,
    gradient: 'from-emerald-400 to-teal-500',
    badgeBg: 'bg-emerald-100 text-emerald-700',
    border: 'border-emerald-200',
    iconColor: 'text-emerald-500',
  },
} as const;

function ProviderSection({ providers }: { providers: StreamingProvider[] }) {
  const grouped = providers.reduce<Record<string, StreamingProvider[]>>((acc, p) => {
    const cat = p.category || 'flatrate';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(p);
    return acc;
  }, {});

  const order: Array<'flatrate' | 'rent' | 'buy'> = ['flatrate', 'rent', 'buy'];

  return (
    <div className="space-y-4">
      {order.map((cat) => {
        const list = grouped[cat];
        if (!list?.length) return null;
        const cfg = CATEGORY_CONFIG[cat];
        const Icon = cfg.icon;
        return (
          <div key={cat} className={`rounded-xl border ${cfg.border} overflow-hidden`}>
            <div className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${cfg.gradient} bg-opacity-10`}>
              <Icon size={15} className="text-white" />
              <span className="text-sm font-semibold text-white">{cfg.label}</span>
            </div>
            <div className="p-3 flex flex-wrap gap-3 bg-white">
              {list.map((provider) => (
                <a
                  key={`${provider.provider_id}-${cat}`}
                  href={provider.link || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex flex-col items-center gap-1.5 p-2 rounded-xl border ${cfg.border} bg-gray-50 hover:bg-white hover:shadow-md transition-all duration-200 w-20`}
                  title={`Assistir no ${provider.provider_name}`}
                >
                  <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm">
                    <img
                      src={getImageUrl(provider.logo_path)}
                      alt={provider.provider_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-[10px] font-medium text-center text-gray-600 leading-tight line-clamp-2">
                    {provider.provider_name}
                  </span>
                  <ExternalLink size={10} className={`${cfg.iconColor} opacity-0 group-hover:opacity-100 transition-opacity`} />
                </a>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
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
          onClick={() => navigate('/', { state: { goTo: 'list' } })}
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
            <h2 className="text-xl font-semibold mb-3">Onde Assistir</h2>
            {streamingProviders.length > 0 ? (
              <ProviderSection providers={streamingProviders} />
            ) : (
              <div className="flex items-center gap-3 text-gray-500 bg-gray-100 px-4 py-4 rounded-xl border border-gray-200">
                <AlertCircle size={20} className="shrink-0" />
                <span className="text-sm">Não disponível em streaming no Brasil</span>
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