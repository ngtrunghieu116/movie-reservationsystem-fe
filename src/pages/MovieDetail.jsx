import React, { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useMovieDetail } from '../hooks/useMovieDetail';
import MovieDetailHero from '../components/movie/MovieDetailHero';
import TrailerModal from '../components/movie/TrailerModal';
import MovieShowtimesSection from '../components/movie/MovieShowtimesSection';
import { Film, AlertCircle, ArrowLeft } from 'lucide-react';
import ROUTES from '../constants/routes';

const MovieDetail = () => {
    const { id } = useParams();
    const { data: movie, isLoading, isError, error, refetch } = useMovieDetail(id);

    const [isTrailerOpen, setIsTrailerOpen] = useState(false);
    const showtimesRef = useRef(null);

    const handleScrollToShowtimes = () => {
        if (showtimesRef.current) {
            showtimesRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    if (isLoading) {
        return (
            <div className="w-full min-h-[calc(100vh-5rem)] bg-slate-950 flex flex-col justify-center items-center py-20 text-white">
                <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-slate-400 text-sm font-medium">Đang tải thông tin phim...</p>
            </div>
        );
    }

    if (isError || !movie) {
        return (
            <div className="w-full min-h-[calc(100vh-5rem)] bg-slate-50 flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-4">
                    <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto">
                        <AlertCircle className="w-8 h-8" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">Không tìm thấy phim</h2>
                    <p className="text-sm text-slate-500">
                        {error || 'Phim bạn đang tìm kiếm không tồn tại hoặc đã bị gỡ bỏ.'}
                    </p>
                    <div className="pt-2 flex justify-center gap-3">
                        <button
                            onClick={refetch}
                            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition"
                        >
                            Thử lại
                        </button>
                        <Link
                            to={ROUTES.HOME}
                            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold shadow-md transition flex items-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Về Trang Chủ</span>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-slate-50">
            {/* 1. Hero Header Section */}
            <MovieDetailHero 
                movie={movie}
                onOpenTrailer={() => setIsTrailerOpen(true)}
                onScrollToShowtimes={handleScrollToShowtimes}
            />

            {/* 2. Showtimes Section */}
            <MovieShowtimesSection 
                movie={movie}
                sectionRef={showtimesRef}
            />

            {/* 3. Trailer Modal */}
            <TrailerModal 
                isOpen={isTrailerOpen}
                onClose={() => setIsTrailerOpen(false)}
                trailerUrl={movie.trailerUrl}
                movieTitle={movie.title}
            />
        </div>
    );
};

export default MovieDetail;
