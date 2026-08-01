import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ImageOff } from 'lucide-react';

const HeroSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [backdrops, setBackdrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    // MOCK DATA - REPLACE WITH API: GET /api/movies/banners OR GET /api/movies/featured
    const fetchBanners = async () => {
      try {
        setLoading(true);
        // When Backend API is available, replace with:
        // const response = await axiosClient.get('/movies/banners');
        const mockData = [
          {
            id: 1,
            title: 'Godzilla x Kong: Đế Chế Mới',
            image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1600&q=80',
          },
          {
            id: 2,
            title: 'Dune: Hành Tinh Cát 2',
            image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
          },
          {
            id: 3,
            title: 'Mai',
            image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1600&q=80',
          },
        ];
        setBackdrops(mockData);
        setError(null);
      } catch (err) {
        setError('Không thể tải dữ liệu banner từ hệ thống.');
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // Auto Carousel Logic (5-second interval, pauses on hover)
  useEffect(() => {
    if (backdrops.length > 1 && !isHovered) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev === backdrops.length - 1 ? 0 : prev + 1));
      }, 5000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [backdrops.length, isHovered]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? backdrops.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === backdrops.length - 1 ? 0 : prev + 1));
  };

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="w-full bg-slate-900">
      {/* Full Width Container with max-w-[1500px] */}
      <div className="max-w-[1500px] mx-auto relative w-full">
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative w-full h-[320px] sm:h-[420px] md:h-[800px] rounded-none overflow-hidden bg-slate-950 group flex items-center justify-center"
        >
          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center gap-3 text-slate-400">
              <div className="w-8 h-8 border-3 border-red-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-medium">Đang tải banner...</span>
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="flex flex-col items-center gap-2 text-rose-400">
              <ImageOff className="w-8 h-8" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && backdrops.length === 0 && (
            <div className="text-slate-400 text-sm">Chưa có banner phim nào.</div>
          )}

          {/* Banner Images, Gradient Overlay & Navigation Controls */}
          {!loading && !error && backdrops.length > 0 && (
            <>
              {/* Image Banner Slide */}
              <img
                key={backdrops[currentIndex].id}
                src={backdrops[currentIndex].image}
                alt={backdrops[currentIndex].title || 'Hero Banner'}
                className="w-full h-full object-cover transition-all duration-700 ease-in-out"
              />

              {/* Gradient Overlay for Cinematic Depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20 pointer-events-none"></div>

              {/* Previous Button */}
              {backdrops.length > 1 && (
                <button
                  onClick={handlePrev}
                  aria-label="Previous Slide"
                  className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/40 hover:bg-red-600 text-white rounded-full flex items-center justify-center backdrop-blur-md border border-white/10 transition-all duration-300 opacity-80 group-hover:opacity-100 hover:scale-110 shadow-xl z-10"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              {/* Next Button */}
              {backdrops.length > 1 && (
                <button
                  onClick={handleNext}
                  aria-label="Next Slide"
                  className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/40 hover:bg-red-600 text-white rounded-full flex items-center justify-center backdrop-blur-md border border-white/10 transition-all duration-300 opacity-80 group-hover:opacity-100 hover:scale-110 shadow-xl z-10"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}

              {/* Pagination Dots */}
              {backdrops.length > 1 && (
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
                  {backdrops.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleDotClick(idx)}
                      aria-label={`Go to slide ${idx + 1}`}
                      className={`transition-all duration-300 ${idx === currentIndex
                        ? 'w-8 h-2.5 bg-red-600 rounded-full shadow-md shadow-red-600/50'
                        : 'w-2.5 h-2.5 bg-white/50 hover:bg-white rounded-full'
                        }`}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;
