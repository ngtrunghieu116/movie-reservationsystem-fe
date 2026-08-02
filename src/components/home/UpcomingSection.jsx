import React, { useState, useEffect } from 'react';
import { Film } from 'lucide-react';

const UpcomingSection = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // MOCK DATA - REPLACE WITH API: GET /api/movies/upcoming
    const fetchUpcomingMovies = async () => {
      try {
        setLoading(true);
        // When API is ready, replace with:
        // const data = await movieApi.getUpcoming();
        const mockData = [
          {
            id: 101,
            title: 'Lật Mặt 7: Một Điều Ước',
            releaseDate: '26/04/2026',
            poster: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80',
          },
          {
            id: 102,
            title: 'Kẻ Trộm Mặt Trăng 4',
            releaseDate: '05/07/2026',
            poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
          },
          {
            id: 103,
            title: 'Deadpool & Wolverine',
            releaseDate: '26/07/2026',
            poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
          },
          {
            id: 104,
            title: 'Joker: Folie à Deux',
            releaseDate: '04/10/2026',
            poster: 'https://images.unsplash.com/photo-1568876694728-451bbf694b83?auto=format&fit=crop&w=600&q=80',
          },
        ];
        setMovies(mockData);
        setError(null);
      } catch (err) {
        setError('Không thể tải danh sách phim sắp chiếu.');
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingMovies();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8 border-b border-slate-200 pb-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Phim Sắp Chiếu
        </h2>
        <span className="w-12 h-1 bg-red-600 rounded-full"></span>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="py-16 text-center text-slate-500 flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm">Đang tải phim sắp chiếu...</span>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="py-12 text-center text-rose-500 text-sm">
          {error}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && movies.length === 0 && (
        <div className="py-16 text-center text-slate-400 flex flex-col items-center gap-2">
          <Film className="w-10 h-10 text-slate-300" />
          <span className="text-sm">Hiện chưa có phim nào sắp chiếu.</span>
        </div>
      )}

      {/* Grid of Upcoming Movie Cards */}
      {!loading && !error && movies.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="group bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col justify-between"
            >
              {/* Poster Image */}
              <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-100">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Card Content: Tên phim, Ngày khởi chiếu */}
              <div className="p-4 space-y-1.5">
                <h3 className="font-bold text-base text-slate-900 group-hover:text-red-600 transition line-clamp-1">
                  {movie.title}
                </h3>
                <p className="text-xs text-slate-500 pt-1 border-t border-slate-100">
                  Ngày khởi chiếu: <span className="font-medium text-slate-700">{movie.releaseDate}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default UpcomingSection;
