import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { getImageUrl } from '../integrations/tmdb';

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
}

export function MediaDetails() {
  const { id } = useParams();
  const [media, setMedia] = useState<MediaDetails | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Carregando...</div>;
  }

  if (!media) {
    return <div className="flex justify-center items-center min-h-screen">Mídia não encontrada</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
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

          <div>
            <h2 className="text-xl font-semibold mb-2">Sinopse</h2>
            <p className="text-gray-700 leading-relaxed">{media.overview}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 