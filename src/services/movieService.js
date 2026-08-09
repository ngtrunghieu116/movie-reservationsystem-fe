import { movieApi } from '../api/movieApi';
import { movieMapper } from '../utils/movieMapper';
import { logger } from '../utils/logger';

export const movieService = {
    getNowShowing: async (params) => {
        try {
            const response = await movieApi.getNowShowing(params);
            const moviesData = response.data;
            
            // TODO: Remove List compatibility after backend v2 implements Pagination
            if (moviesData && moviesData.content) {
                return {
                    ...moviesData,
                    content: movieMapper.toListViewModel(moviesData.content)
                };
            }
            if (Array.isArray(moviesData)) {
                return movieMapper.toListViewModel(moviesData);
            }
            return Array.isArray(response) ? movieMapper.toListViewModel(response) : [];
        } catch (error) {
            logger.error('Failed to fetch now showing movies in movieService', error);
            throw error;
        }
    },

    getComingSoon: async (params) => {
        try {
            const response = await movieApi.getComingSoon(params);
            const moviesData = response.data;
            
            // TODO: Remove List compatibility after backend v2 implements Pagination
            if (moviesData && moviesData.content) {
                return {
                    ...moviesData,
                    content: movieMapper.toListViewModel(moviesData.content)
                };
            }
            if (Array.isArray(moviesData)) {
                return movieMapper.toListViewModel(moviesData);
            }
            return Array.isArray(response) ? movieMapper.toListViewModel(response) : [];
        } catch (error) {
            logger.error('Failed to fetch coming soon movies in movieService', error);
            throw error;
        }
    },

    getMovies: async (params) => {
        try {
            const response = await movieApi.getMovies(params);
            const moviesData = response.data;
            
            // TODO: Remove List compatibility after backend v2 implements Pagination
            if (moviesData && moviesData.content) {
                return {
                    ...moviesData,
                    content: movieMapper.toListViewModel(moviesData.content)
                };
            }
            if (Array.isArray(moviesData)) {
                return movieMapper.toListViewModel(moviesData);
            }
            return Array.isArray(response) ? movieMapper.toListViewModel(response) : [];
        } catch (error) {
            logger.error('Failed to fetch movies in movieService', error);
            throw error;
        }
    }
};
