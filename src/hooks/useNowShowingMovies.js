import { useState, useEffect, useCallback } from 'react';
import { movieService } from '../services/movieService';
import { showtimeService } from '../services/showtimeService';

export const useNowShowingMovies = (selectedDateStr) => {
    const [movies, setMovies] = useState([]);
    const [showtimesByMovie, setShowtimesByMovie] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setIsError(false);
        setError(null);

        try {
            // 1. Fetch normalized NOW_SHOWING movies
            const moviesList = await movieService.getNowShowing();
            setMovies(moviesList);

            // 2. Fetch normalized Showtimes for selected date
            if (selectedDateStr) {
                const fromDate = `${selectedDateStr}T00:00:00`;
                const toDate = `${selectedDateStr}T23:59:59`;

                const rawShowtimes = await showtimeService.getShowtimes({
                    fromDate,
                    toDate,
                    page: 0,
                    size: 200
                });

                const grouped = rawShowtimes.reduce((acc, st) => {
                    const mId = st.movieId;
                    if (!acc[mId]) {
                        acc[mId] = [];
                    }
                    acc[mId].push(st);
                    return acc;
                }, {});

                setShowtimesByMovie(grouped);
            } else {
                setShowtimesByMovie({});
            }
        } catch (err) {
            setIsError(true);
            setError(err.message || 'Không thể tải danh sách phim đang chiếu');
        } finally {
            setIsLoading(false);
        }
    }, [selectedDateStr]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        movies,
        showtimesByMovie,
        isLoading,
        isError,
        error,
        refetch: fetchData
    };
};
