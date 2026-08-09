import { movieFormatter } from './movieFormatter';
import posterPlaceholder from '../assets/images/poster-placeholder.svg';

const getFullImageUrl = (path) => {
    if (!path) return posterPlaceholder;
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
        return path;
    }
    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
    const serverBase = apiBase.replace(/\/api\/?$/, '');
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${serverBase}${cleanPath}`;
};

export const movieMapper = {
    /**
     * Chuyển đổi MovieResponse từ Backend thành MovieViewModel cho View
     * @param {Object} response - Data trả về từ Backend API
     * @returns {Object} MovieViewModel
     */
    toViewModel: (response) => {
        if (!response) return null;
        
        const rawPoster = response.posterPath || response.posterUrl || response.poster;
        const rawBanner = response.bannerPath || response.bannerUrl || response.banner;
        const poster = getFullImageUrl(rawPoster);
        const banner = rawBanner ? getFullImageUrl(rawBanner) : poster;
        
        return {
            id: response.id,
            title: response.title || 'Unknown Title',
            poster: poster,
            banner: banner,
            duration: movieFormatter.formatDuration(response.duration),
            ageRating: response.ageRating || 'P',
            genres: response.genres ? response.genres.map(g => g.name || g) : [],
            releaseDate: response.releaseDate,
            status: response.status || 'UNKNOWN',
            trailerUrl: response.trailerUrl,
            rating: movieFormatter.formatRating(response.averageRating ?? response.rating)
        };
    },

    /**
     * Map một danh sách MovieResponse thành mảng MovieViewModel
     * @param {Array} responseList 
     * @returns {Array} Array of MovieViewModel
     */
    toListViewModel: (responseList) => {
        if (!Array.isArray(responseList)) return [];
        return responseList.map(movieMapper.toViewModel);
    }
};
