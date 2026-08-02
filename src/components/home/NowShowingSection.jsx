import React, { useState, useEffect } from 'react';
import { Film } from 'lucide-react';

const NowShowingSection = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // MOCK DATA - REPLACE WITH API: GET /api/movies/now-showing
    const fetchNowShowingMovies = async () => {
      try {
        setLoading(true);
        // When API is ready, replace with:
        // const data = await movieApi.getNowShowing();
        const mockData = [
          {
            id: 1,
            title: 'Godzilla x Kong: Đế Chế Mới',
            genre: 'Hành động, Viễn tưởng',
            releaseDate: '29/03/2026',
            poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80',
          },
          {
            id: 2,
            title: 'Mai',
            genre: 'Tâm lý, Lãng mạn',
            releaseDate: '10/02/2026',
            poster: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=80',
          },
          {
            id: 3,
            title: 'Dune: Hành Tinh Cát 2',
            genre: 'Khoa học viễn tưởng',
            releaseDate: '01/03/2026',
            poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
          },
          {
            id: 4,
            title: 'Kung Fu Panda 4',
            genre: 'Hoạt hình, Hài hước',
            releaseDate: '08/03/2026',
            poster: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80',
          },
        ];
        setMovies(mockData);
        setError(null);
      } catch (err) {
        setError('Không thể tải danh sách phim đang chiếu.');
      } finally {
        setLoading(false);
      }
    };

    fetchNowShowingMovies();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8 border-b border-slate-200 pb-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Phim Đang Chiếu
        </h2>
        <span className="w-12 h-1 bg-red-600 rounded-full"></span>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="py-16 text-center text-slate-500 flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm">Đang tải phim đang chiếu...</span>
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
          <span className="text-sm">Hiện chưa có phim nào đang chiếu.</span>
        </div>
      )}

      {/* Grid of Movie Cards */}
      {!loading && !error && movies.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="group bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col justify-between"
            >
              {/* Poster Image (Standard 2:3 aspect ratio) */}
              <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-100">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Card Content: Thể loại, Tên phim, Ngày công chiếu */}
              <div className="p-4 space-y-1.5">
                <p className="text-xs font-semibold text-red-600 truncate">{movie.genre}</p>
                <h3 className="font-bold text-base text-slate-900 group-hover:text-red-600 transition line-clamp-1">
                  {movie.title}
                </h3>
                <p className="text-xs text-slate-500 pt-1 border-t border-slate-100">
                  Ngày công chiếu: <span className="font-medium text-slate-700">{movie.releaseDate}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default NowShowingSection;
