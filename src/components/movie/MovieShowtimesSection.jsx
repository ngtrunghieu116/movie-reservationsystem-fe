import { AlertCircle } from 'lucide-react';

const MovieShowtimesSection = ({
    movie,
    datesList = [],
    selectedDateIndex = 0,
    onSelectDate = () => {},
    showtimes = [],
    isLoading = false,
    isError = false,
    onRefetch = () => {},
    selectedShowtime = null,
    onSelectShowtime = () => {},
    timeLeftFormatted = '--:--',
    isExpiringSoon = false,
    sectionRef = null
}) => {
    const isComingSoon = movie?.status === 'COMING_SOON';
    const isEnded = movie?.status === 'ENDED';
    const selectedDateObj = datesList[selectedDateIndex];

    // Sort showtimes chronologically
    const sortedShowtimes = [...showtimes].sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

    return (
        <div ref={sectionRef} className="w-full bg-[#0B0F14] text-white border-t border-[#1F2937]/80">
            {/* 1. Horizontal Date Selector Bar (Matching mau.png) */}
            <div className="w-full bg-[#0F141B] border-b border-[#2A323E] py-3">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                        {datesList.map((d, index) => {
                            const isSelected = index === selectedDateIndex;
                            return (
                                <button
                                    key={d.dateStr}
                                    type="button"
                                    onClick={() => onSelectDate(index)}
                                    className={`flex-shrink-0 px-4 py-2.5 rounded-xl flex flex-col items-center min-w-[5.5rem] transition-all duration-200 border cursor-pointer select-none ${
                                        isSelected
                                            ? 'bg-[#E50914] text-white border-[#E50914] shadow-lg shadow-[#E50914]/25'
                                            : 'bg-[#121821] text-[#94A3B8] border-[#2A323E] hover:border-[#4B5563] hover:text-[#F8FAFC]'
                                    }`}
                                >
                                    <span className={`text-[11px] font-semibold tracking-wider ${isSelected ? 'text-white/90' : 'text-[#94A3B8]'}`}>
                                        {d.monthLabel}
                                    </span>
                                    <span className={`text-xl sm:text-2xl font-black my-0.5 font-mono ${isSelected ? 'text-white' : 'text-[#F8FAFC]'}`}>
                                        {d.dayNum}
                                    </span>
                                    <span className={`text-[11px] font-medium ${isSelected ? 'text-white/90' : 'text-[#94A3B8]'}`}>
                                        {d.dayFullLabel}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* 2. Showtime Selection & Countdown Header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
                    
                    {/* Left: Showtime Pills */}
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="text-sm font-semibold text-[#CBD5E1] mr-1">Giờ chiếu:</span>
                        
                        {isLoading ? (
                            <div className="flex items-center space-x-2 text-xs text-[#94A3B8]">
                                <div className="w-4 h-4 border-2 border-[#E50914] border-t-transparent rounded-full animate-spin" />
                                <span>Đang tải suất chiếu...</span>
                            </div>
                        ) : isError ? (
                            <div className="flex items-center space-x-2 text-xs text-[#E50914]">
                                <span>Lỗi tải suất chiếu.</span>
                                <button onClick={onRefetch} className="underline hover:text-white cursor-pointer">
                                    Thử lại
                                </button>
                            </div>
                        ) : sortedShowtimes.length > 0 ? (
                            <div className="flex flex-wrap items-center gap-2.5">
                                {sortedShowtimes.map((st) => {
                                    const startTime = new Date(st.startTime);
                                    const timeStr = startTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
                                    const isStSelected = selectedShowtime?.id === st.id;

                                    return (
                                        <button
                                            key={st.id}
                                            type="button"
                                            onClick={() => onSelectShowtime(st)}
                                            className={`px-4 py-1.5 rounded-lg text-sm font-bold font-mono transition-all duration-200 border cursor-pointer ${
                                                isStSelected
                                                    ? 'bg-[#E50914] text-white border-[#E50914] shadow-md shadow-[#E50914]/30 ring-2 ring-[#E50914]/50'
                                                    : 'bg-[#171C24] text-[#CBD5E1] border-[#2A323E] hover:border-[#E50914] hover:text-white'
                                            }`}
                                        >
                                            {timeStr}
                                        </button>
                                    );
                                })}
                            </div>
                        ) : (
                            <span className="text-xs text-[#94A3B8] italic">
                                {isComingSoon 
                                    ? 'Phim sắp chiếu - chưa có suất chiếu.'
                                    : isEnded
                                    ? 'Phim đã kết thúc đợt chiếu.'
                                    : `Không có suất chiếu trong ngày ${selectedDateObj?.displayDate || ''}.`}
                            </span>
                        )}
                    </div>

                    {/* Right: Countdown Pill (Matching mau.png) */}
                    <div className="flex items-center self-start sm:self-auto">
                        <div className="px-4 py-1.5 rounded-lg bg-[#121821] border border-[#2A323E] flex items-center space-x-2">
                            <span className="text-xs text-[#CBD5E1]">Thời gian chọn ghế:</span>
                            <span className={`text-sm font-bold font-mono ${
                                isExpiringSoon ? 'text-[#E50914] animate-pulse' : 'text-[#F59E0B]'
                            }`}>
                                {selectedShowtime && timeLeftFormatted ? timeLeftFormatted : '10:00'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Empty State Notification */}
                {!isLoading && !isError && sortedShowtimes.length === 0 && (
                    <div className="my-6 p-6 rounded-2xl bg-[#121821] border border-[#2A323E] text-center space-y-2 max-w-lg mx-auto">
                        <AlertCircle className="w-8 h-8 text-[#94A3B8] mx-auto" />
                        <h4 className="text-sm font-bold text-[#F8FAFC]">Chưa có suất chiếu</h4>
                        <p className="text-xs text-[#94A3B8]">
                            Vui lòng chọn một ngày khác trên thanh lịch chiếu để tìm kiếm suất chiếu khả dụng.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MovieShowtimesSection;
