import axios from 'axios';

const TMDB_API_KEY = "3d22081cae0e925800702333596e462e";
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const axiosInstance = axios.create({
  timeout: 6000
});

interface TMDBMovie {
  id: number;
  title: string;
  original_title: string;
  release_date: string;
  poster_path: string;
  vote_average: number;
  genres: { id: number; name: string }[];
  runtime: number;
  overview: string;
}

interface TMDBSeries {
  id: number;
  name: string;
  original_name: string;
  first_air_date: string;
  poster_path: string;
  vote_average: number;
  genres: { id: number; name: string }[];
  episode_run_time: number[];
  overview: string;
}

export interface StreamingProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
  category?: 'flatrate' | 'rent' | 'buy';
  link?: string;
}

export type StreamingFilterId = 'netflix' | 'prime-video' | 'hbo' | 'apple';

export const STREAMING_FILTER_OPTIONS: {
  id: StreamingFilterId;
  label: string;
  providerIds: number[];
}[] = [
  { id: 'netflix', label: 'Netflix', providerIds: [8] },
  { id: 'prime-video', label: 'Prime Video', providerIds: [119, 9] },
  { id: 'hbo', label: 'HBO', providerIds: [1899, 384] },
  { id: 'apple', label: 'Apple TV', providerIds: [350] },
];

const PROVIDER_URLS: Record<number, string> = {
  8: 'https://www.netflix.com/br',
  9: 'https://www.primevideo.com',
  119: 'https://www.primevideo.com',
  337: 'https://www.disneyplus.com/pt-br',
  384: 'https://www.max.com/br',
  1899: 'https://www.max.com/br',
  350: 'https://tv.apple.com',
  531: 'https://www.paramountplus.com/br',
  307: 'https://www.starzplay.com',
  2: 'https://tv.apple.com',
  3: 'https://play.google.com/store/movies',
  7: 'https://www.vudu.com',
  68: 'https://www.microsoft.com/pt-br/store/movies-and-tv',
  619: 'https://www.starzplay.com',
  167: 'https://www.mubi.com/pt/br',
  258: 'https://www.claro.com.br/claro-video',
  227: 'https://www.globoplay.globo.com',
  307: 'https://www.starzplay.com',
};

interface StreamingProviders {
  link?: string;
  flatrate?: StreamingProvider[];
  rent?: StreamingProvider[];
  buy?: StreamingProvider[];
}

export const searchMovie = async (query: string): Promise<TMDBMovie | null> => {
  try {
    const response = await axiosInstance.get(`${TMDB_BASE_URL}/search/movie`, {
      params: {
        api_key: TMDB_API_KEY,
        query,
        language: 'pt-BR'
      }
    });

    if (response.data.results.length > 0) {
      const movieId = response.data.results[0].id;
      const details = await axiosInstance.get(`${TMDB_BASE_URL}/movie/${movieId}`, {
        params: {
          api_key: TMDB_API_KEY,
          language: 'pt-BR'
        }
      });
      return details.data;
    }
    return null;
  } catch (error) {
    console.error('Error searching movie:', error);
    return null;
  }
};

export const searchSeries = async (query: string): Promise<TMDBSeries | null> => {
  try {
    const response = await axiosInstance.get(`${TMDB_BASE_URL}/search/tv`, {
      params: {
        api_key: TMDB_API_KEY,
        query,
        language: 'pt-BR'
      }
    });

    if (response.data.results.length > 0) {
      const seriesId = response.data.results[0].id;
      const details = await axiosInstance.get(`${TMDB_BASE_URL}/tv/${seriesId}`, {
        params: {
          api_key: TMDB_API_KEY,
          language: 'pt-BR'
        }
      });
      return details.data;
    }
    return null;
  } catch (error) {
    console.error('Error searching series:', error);
    return null;
  }
};

export const getStreamingProviders = async (tmdbId: number, type: 'movie' | 'series'): Promise<StreamingProvider[]> => {
  try {
    const endpoint = type === 'movie' ? 'movie' : 'tv';
    const response = await axiosInstance.get(`${TMDB_BASE_URL}/${endpoint}/${tmdbId}/watch/providers`, {
      params: {
        api_key: TMDB_API_KEY
      }
    });

    const providers = response.data.results.BR as StreamingProviders;
    if (!providers) return [];

    const juswatchLink = providers.link || '';

    const mapWithMeta = (list: StreamingProvider[] | undefined, category: 'flatrate' | 'rent' | 'buy') =>
      (list || []).map(p => ({
        ...p,
        category,
        link: PROVIDER_URLS[p.provider_id] || juswatchLink,
      }));

    const seen = new Set<number>();
    const allProviders: StreamingProvider[] = [];
    for (const p of [
      ...mapWithMeta(providers.flatrate, 'flatrate'),
      ...mapWithMeta(providers.rent, 'rent'),
      ...mapWithMeta(providers.buy, 'buy'),
    ]) {
      const key = p.provider_id * 10 + (['flatrate','rent','buy'].indexOf(p.category!));
      if (!seen.has(key)) {
        seen.add(key);
        allProviders.push(p);
      }
    }

    return allProviders;
  } catch (error) {
    console.error('Error fetching streaming providers:', error);
    return [];
  }
};

export const getImageUrl = (path: string) => {
  return `https://image.tmdb.org/t/p/w500${path}`;
}; 