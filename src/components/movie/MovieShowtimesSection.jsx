import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, AlertCircle, ChevronDown, ChevronUp, Clock, Ticket } from 'lucide-react';
import { useMovieShowtimes } from '../../hooks/useMovieShowtimes';

const generateNextDates = (daysCount = 7) => {
    const dates = [];
    const today = new Date();
    const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

    for (let i = 0; i < daysCount; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);

        const isToday = i === 0;
        const dayLabel = isToday ? 'Hôm nay' : dayNames[d.getDay()];
        const dayNum = String(d.getDate()).padStart(2, '0');
        const monthNum = String(d.getMonth() + 1).padStart(2, '0');
        const dateStr = `${d.getFullYear()}-${monthNum}-${dayNum}`;
        const displayDate = `${dayNum}/${monthNum}`;

        dates.push({
            dateStr,
            dayLabel,
            displayDate,
            rawDate: d
        });
    }
    return dates;
};

const MovieShowtimesSection = ({ movie, sectionRef }) => {
    const navigate = useNavigate();
    const datesList = useMemo(() => generateNextDates(7), []);
    const [selectedDateIndex, setSelectedDateIndex] = useState(0);
    // Initialized as null: No theater is expanded by default until user explicitly clicks on one
    const [openTheaterId, setOpenTheaterId] = useState(null);
    const [selectedShowtimeAlert, setSelectedShowtimeAlert] = useState(null);

    const selectedDateObj = datesList[selectedDateIndex];
    const isComingSoon = movie?.status === 'COMING_SOON';
    const isEnded = movie?.status === 'ENDED';

    // Fetch showtimes for movie and selected date
    const { 
        data: showtimes, 
        isLoading, 
        isError, 
        refetch 
    } = useMovieShowtimes(movie?.id, selectedDateObj?.dateStr);

    // Group showtimes by Theater -> Room
    const groupedShowtimes = useMemo(() => {
        if (!Array.isArray(showtimes) || showtimes.length === 0) return {};

        const grouped = {};
        showtimes.forEach(st => {
            const theaterName = st.theaterName || 'Trung Tâm Chiếu Phim Quốc Gia - NCC';
            const roomName = st.roomName || 'Phòng Chiếu';

            if (!grouped[theaterName]) {
                grouped[theaterName] = {
                    name: theaterName,
                    address: st.theaterAddress || '87 Láng Hạ, Ba Đình, Hà Nội',
                    rooms: {},
                    totalShowtimes: 0
                };
            }
            if (!grouped[theaterName].rooms[roomName]) {
                grouped[theaterName].rooms[roomName] = [];
            }
            grouped[theaterName].rooms[roomName].push(st);
            grouped[theaterName].totalShowtimes += 1;
        });
        return grouped;
    }, [showtimes]);

    const toggleTheaterDropdown = (theaterName) => {
        setOpenTheaterId(prev => prev === theaterName ? null : theaterName);
    };

    const handleSelectShowtime = (showtime) => {
        if (isComingSoon) {
            setSelectedShowtimeAlert({
                type: 'warning',
                title: 'Phim Sắp Chiếu',
                message: `Phim "${movie.title}" chưa mở bán vé chính thức cho suất chiếu này. Vui lòng quay lại sau!`
            });
            return;
        }

        // Navigate to seat selection page
        navigate(`/booking/${showtime.id}`);
    };

    return (
        <div ref={sectionRef} className="w-full py-8 bg-slate-50 border-t border-slate-200/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                
                {/* Section Header */}
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
                            <Ticket className="w-6 h-6 text-red-600" />
                            <span>Lịch Chiếu & Đặt Vé</span>
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                            Chọn ngày chiếu, chọn rạp và suất chiếu phù hợp để tiến hành chọn ghế
                        </p>
                    </div>
                </div>

                {/* 1. Horizontal Date Selector Bar */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300">
                    {datesList.map((d, index) => {
                        const isSelected = index === selectedDateIndex;
                        return (
                            <button
                                key={d.dateStr}
                                onClick={() => {
                                    setSelectedDateIndex(index);
                                    setOpenTheaterId(null); // Reset dropdown when changing dates
                                }}
                                className={`flex-shrink-0 px-4 py-2.5 rounded-2xl flex flex-col items-center min-w-[5.5rem] transition duration-200 border cursor-pointer ${
                                    isSelected
                                        ? 'bg-red-600 text-white border-red-600 shadow-md shadow-red-600/30'
                                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                                }`}
                            >
                                <span className={`text-xs font-extrabold uppercase tracking-wider ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                                    {d.dayLabel}
                                </span>
                                <span className={`text-[11px] font-medium mt-0.5 ${isSelected ? 'text-red-100' : 'text-slate-500'}`}>
                                    {d.displayDate}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Notification Alert Box */}
                {selectedShowtimeAlert && (
                    <div className={`p-4 rounded-2xl border flex items-start gap-3 transition animate-fadeIn ${
                        selectedShowtimeAlert.type === 'warning'
                            ? 'bg-amber-50 border-amber-200 text-amber-900'
                            : 'bg-blue-50 border-blue-200 text-blue-900'
                    }`}>
                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-600" />
                        <div className="flex-1">
                            <h4 className="font-bold text-sm">{selectedShowtimeAlert.title}</h4>
                            <p className="text-xs sm:text-sm mt-0.5">{selectedShowtimeAlert.message}</p>
                        </div>
                        <button 
                            onClick={() => setSelectedShowtimeAlert(null)}
                            className="text-xs font-semibold underline hover:opacity-75"
                        >
                            Đóng
                        </button>
                    </div>
                )}

                {/* Showtimes & Available Theaters Container */}
                {isLoading ? (
                    <div className="py-12 text-center text-slate-500 bg-white rounded-3xl border border-slate-200 shadow-sm">
                        <div className="w-8 h-8 border-3 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                        <p className="text-sm font-medium">Đang tải danh sách rạp và suất chiếu...</p>
                    </div>
                ) : isError ? (
                    <div className="py-12 text-center text-slate-500 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
                        <p className="text-sm text-red-600 font-medium">Không thể tải suất chiếu cho ngày đã chọn.</p>
                        <button 
                            onClick={refetch}
                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
                        >
                            Thử lại
                        </button>
                    </div>
                ) : isComingSoon || isEnded || Object.keys(groupedShowtimes).length === 0 ? (
                    /* Display exact message when no showtimes or COMING_SOON / ENDED */
                    <div className="py-12 text-center text-slate-500 bg-white rounded-3xl border border-slate-200/80 shadow-xs p-8 space-y-2">
                        <Calendar className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                        <h3 className="text-base font-bold text-slate-800">
                            {isEnded 
                                ? 'Phim đã kết thúc đợt chiếu.' 
                                : 'Phim hiện chưa có lịch chiếu nào.'
                            }
                        </h3>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto">
                            {isComingSoon 
                                ? 'Phim chưa chính thức khởi chiếu. Vui lòng quay lại sau khi phim ra rạp!' 
                                : isEnded
                                ? 'Cảm ơn bạn đã quan tâm. Hãy đón xem các bộ phim đang chiếu khác!'
                                : `Hiện chưa có suất chiếu nào tại các rạp cho ngày ${selectedDateObj.displayDate}.`
                            }
                        </p>
                    </div>
                ) : (
                    /* Available Theaters List with Manual Dropdown Accordion */
                    <div className="space-y-4">
                        {Object.entries(groupedShowtimes).map(([theaterName, theaterData]) => {
                            const isOpen = openTheaterId === theaterName;

                            return (
                                <div 
                                    key={theaterName} 
                                    className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden shadow-xs ${
                                        isOpen ? 'border-red-300 ring-2 ring-red-500/10 shadow-md' : 'border-slate-200 hover:border-slate-300'
                                    }`}
                                >
                                    {/* Theater Header Bar (User clicks to Dropdown) */}
                                    <button
                                        onClick={() => toggleTheaterDropdown(theaterName)}
                                        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50/80 transition duration-200 cursor-pointer"
                                    >
                                        <div className="flex items-center gap-3.5">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-colors ${
                                                isOpen ? 'bg-red-600 text-white shadow-md shadow-red-600/30' : 'bg-red-50 text-red-600'
                                            }`}>
                                                <MapPin className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-base font-extrabold text-slate-900 group-hover:text-red-600 transition">
                                                    {theaterName}
                                                </h3>
                                                <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                                                    <span>{theaterData.address}</span>
                                                    <span>•</span>
                                                    <span className="font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-md text-[11px]">
                                                        {theaterData.totalShowtimes} suất chiếu
                                                    </span>
                                                </p>
                                            </div>
                                        </div>

                                        {/* Dropdown Toggle Chevron */}
                                        <div className={`p-2 rounded-xl border transition-colors ${
                                            isOpen ? 'bg-red-50 border-red-200 text-red-600' : 'bg-slate-100 border-slate-200 text-slate-500'
                                        }`}>
                                            {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                        </div>
                                    </button>

                                    {/* Dropdown Content: Rooms & Showtimes (Only shown when user clicks) */}
                                    {isOpen && (
                                        <div className="border-t border-slate-100 p-6 bg-slate-50/50 space-y-5 animate-fadeIn">
                                            {Object.entries(theaterData.rooms).map(([roomName, showtimeList]) => (
                                                <div key={roomName} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
                                                            {roomName}
                                                        </span>
                                                        <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                                                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                                                            <span>2D Phụ đề</span>
                                                        </span>
                                                    </div>

                                                    {/* Showtime Buttons Grid (Only time shown, no price) */}
                                                    <div className="flex flex-wrap gap-3 pt-1">
                                                        {showtimeList.map((st) => {
                                                            const startTime = new Date(st.startTime);
                                                            const timeStr = startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                                                            return (
                                                                <button
                                                                    key={st.id}
                                                                    onClick={() => handleSelectShowtime(st)}
                                                                    className="group px-4 py-2.5 bg-slate-50 hover:bg-red-600 text-slate-900 hover:text-white rounded-xl border border-slate-200 hover:border-red-600 transition duration-200 flex items-center justify-center shadow-2xs hover:shadow-md cursor-pointer"
                                                                >
                                                                    <span className="text-sm font-extrabold tracking-tight">
                                                                        {timeStr}
                                                                    </span>
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

            </div>
        </div>
    );
};

export default MovieShowtimesSection;
