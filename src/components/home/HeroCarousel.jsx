import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import HeroSkeleton from '../ui/skeletons/HeroSkeleton';
import posterPlaceholder from '../../assets/images/poster-placeholder.svg';

const HeroCarousel = ({ 
    movies, 
    isLoading, 
    isError,
    currentIndex,
    onNext,
    onPrev,
    onSelect,
    onHoverChange
}) => {
    const navigate = useNavigate();

    if (isLoading) return <HeroSkeleton />;
    
    if (isError || !movies || movies.length === 0) {
        return (
            <div className="w-full h-[480px] md:h-[520px] bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl text-slate-800 font-bold mb-2">Chào mừng đến với CineMind</h2>
                    <p className="text-slate-500">Hiện chưa có phim nổi bật.</p>
                </div>
            </div>
        );
    }

    const currentMovie = movies[currentIndex] || movies[0];

    const handleImageError = (e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = posterPlaceholder;
    };

    return (
        <div 
            className="relative w-full h-[480px] md:h-[520px] overflow-hidden group bg-slate-900"
            onMouseEnter={() => onHoverChange?.(true)}
            onMouseLeave={() => onHoverChange?.(false)}
        >
            {/* Background Image */}
            <div className="absolute inset-0">
                <img 
                    src={currentMovie.banner || currentMovie.poster || posterPlaceholder} 
                    alt={currentMovie.title}
                    fetchpriority="high"
                    onError={handleImageError}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-[1.03] opacity-40"
                />
            </div>
            
            {/* Gradient overlays for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-slate-900/30"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-transparent to-transparent"></div>

            {/* Content */}
            <div className="relative h-full flex flex-col justify-end p-8 md:p-12 lg:p-16 max-w-7xl mx-auto z-10">
                <div className="max-w-2xl flex flex-col gap-3">
                    <div className="flex gap-2 items-center">
                        <Badge variant="danger">Nổi bật</Badge>
                        <Badge variant={currentMovie.ageRating === '18+' ? 'danger' : 'info'}>
                            {currentMovie.ageRating}
                        </Badge>
                    </div>
                    
                    <h1 className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tight">
                        {currentMovie.title}
                    </h1>
                    
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-300 text-sm">
                        <span>{currentMovie.genres?.join(', ') || 'Thể loại'}</span>
                        <span className="text-slate-500">•</span>
                        <span>{currentMovie.duration}</span>
                        <span className="text-slate-500">•</span>
                        <span className="text-amber-400 font-semibold">{currentMovie.rating}</span>
                    </div>
                    
                    <div className="flex gap-3 mt-4">
                        <Button 
                            variant="primary" 
                            size="lg"
                            onClick={(e) => { e.stopPropagation(); navigate(`/movies/${currentMovie.id}`); }}
                        >
                            Đặt Vé Ngay
                        </Button>
                        {currentMovie.trailerUrl && (
                            <button
                                onClick={(e) => { e.stopPropagation(); window.open(currentMovie.trailerUrl, '_blank'); }}
                                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-white/30 text-white font-semibold text-sm hover:bg-white/10 transition-colors"
                            >
                                ▶ Xem Trailer
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Navigation Arrows */}
            <button 
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/25 transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center z-20"
                onClick={onPrev}
                aria-label="Previous Slide"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button 
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/25 transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center z-20"
                onClick={onNext}
                aria-label="Next Slide"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>

            {/* Dot Indicators */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {movies.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => onSelect?.(idx)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                            idx === currentIndex 
                                ? 'bg-primary w-7' 
                                : 'bg-white/40 w-2 hover:bg-white/70'
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default HeroCarousel;
