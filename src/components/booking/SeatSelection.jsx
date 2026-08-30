import { useMemo } from 'react';
import { Lock } from 'lucide-react';

const VietnamStar = ({ className }) => (
    <svg viewBox="0 0 900 600" className={className} style={{ width: '22px', height: '15px' }}>
        <polygon points="450,120 546,425 285,236 615,236 354,425" fill="#FBBF24" />
    </svg>
);

export const SeatSelection = ({
    seats = [],
    selectedSeats = [],
    onToggleSeat = () => {},
    roomName = 'Phòng chiếu số 11'
}) => {
    // Nhóm ghế theo từng hàng (rowName: A, B, C...)
    const rows = useMemo(() => {
        if (!seats || seats.length === 0) return {};
        const grouped = {};
        seats.forEach((seat) => {
            const row = seat.rowName || 'A';
            if (!grouped[row]) {
                grouped[row] = [];
            }
            grouped[row].push(seat);
        });

        // Sắp xếp các hàng theo thứ tự alphabet và ghế trong hàng theo seatNumber
        const sortedRows = {};
        Object.keys(grouped)
            .sort()
            .forEach((rowKey) => {
                sortedRows[rowKey] = grouped[rowKey].sort(
                    (a, b) => a.seatNumber - b.seatNumber
                );
            });

        return sortedRows;
    }, [seats]);

    // Kiểm tra trạng thái của một ghế
    const getSeatState = (seat) => {
        const isSelected = selectedSeats.some((s) => s.seatId === seat.seatId);

        if (isSelected) {
            return {
                style: 'bg-[#2563EB] border-[#60A5FA] text-white font-bold shadow-[0_0_12px_rgba(37,99,235,0.7)] ring-1 ring-[#60A5FA] scale-105 cursor-pointer',
                isClickable: true, // Click để hủy chọn / release
                icon: null,
                tooltip: `${seat.rowName}${seat.seatNumber} (Ghế bạn chọn - ${(seat.price || 0).toLocaleString('vi-VN')} đ)`
            };
        }

        if (seat.status === 'SOLD') {
            return {
                style: 'bg-[#7F1D1D] border-[#7F1D1D] opacity-90 cursor-not-allowed',
                isClickable: false,
                icon: <VietnamStar className="w-5 h-5 absolute inset-0 m-auto" />,
                tooltip: `${seat.rowName}${seat.seatNumber} (Đã bán)`
            };
        }

        if (seat.status === 'HELD') {
            return {
                style: 'bg-[#3F3F46] border-dashed border-[#71717A] text-[#94A3B8] cursor-not-allowed opacity-75',
                isClickable: false,
                icon: <Lock className="w-3 h-3 text-amber-200/50 absolute inset-0 m-auto" />,
                tooltip: `${seat.rowName}${seat.seatNumber} (Đang có người giữ chỗ)`
            };
        }

        // Trạng thái AVAILABLE
        if (seat.seatType === 'VIP') {
            return {
                style: 'bg-[#F59E0B] border-[#FCD34D] text-[#171C24] font-bold hover:bg-[#FBBF24] hover:shadow-[0_0_8px_rgba(245,158,11,0.5)] cursor-pointer transition-all hover:scale-105',
                isClickable: true,
                icon: null,
                tooltip: `${seat.rowName}${seat.seatNumber} (VIP - ${(seat.price || 0).toLocaleString('vi-VN')} đ)`
            };
        }

        if (seat.seatType === 'COUPLE') {
            return {
                style: 'bg-[#E11D48] border-[#FB7185] text-white font-bold hover:bg-[#F43F5E] hover:shadow-[0_0_8px_rgba(225,29,72,0.5)] cursor-pointer transition-all hover:scale-105 min-w-[3.5rem]',
                isClickable: true,
                icon: null,
                tooltip: `${seat.rowName}${seat.seatNumber} (Đôi - ${(seat.price || 0).toLocaleString('vi-VN')} đ)`
            };
        }

        // Standard
        return {
            style: 'bg-[#252B34] border-[#343B46] text-[#D1D5DB] hover:bg-[#343B46] hover:border-[#4B5563] hover:text-white hover:shadow-[0_0_6px_rgba(255,255,255,0.15)] cursor-pointer transition-all hover:scale-105',
            isClickable: true,
            icon: null,
            tooltip: `${seat.rowName}${seat.seatNumber} (Thường - ${(seat.price || 0).toLocaleString('vi-VN')} đ)`
        };
    };

    return (
        <div className="w-full flex flex-col items-center py-6">
            
            {/* 1. CINEMA SCREEN (Golden Trapezoid Perspective Glow matching mau.png) */}
            <div className="w-full max-w-2xl mx-auto flex flex-col items-center mb-8 px-4">
                <div className="w-full relative flex flex-col items-center">
                    {/* Perspective Trapezoid Screen */}
                    <div 
                        className="w-full h-12 relative shadow-[0_15px_35px_rgba(245,158,11,0.25)]"
                        style={{
                            background: 'linear-gradient(180deg, #F59E0B 0%, rgba(245, 158, 11, 0.4) 60%, transparent 100%)',
                            clipPath: 'polygon(0% 0%, 100% 0%, 90% 100%, 10% 100%)',
                            borderRadius: '4px'
                        }}
                    />
                    {/* Perspective Glow Effect */}
                    <div className="w-4/5 h-2 bg-gradient-to-r from-transparent via-[#FCD34D] to-transparent opacity-70 blur-xs -mt-1" />
                </div>

                {/* Room Name Label */}
                <h3 className="text-sm sm:text-base font-bold text-[#F8FAFC] tracking-widest mt-4 uppercase">
                    {roomName || 'Phòng chiếu'}
                </h3>
            </div>

            {/* 2. SEAT MAP GRID */}
            <div className="w-full overflow-x-auto pb-6 scrollbar-none">
                <div className="min-w-fit mx-auto flex flex-col items-center space-y-2.5 px-4">
                    {Object.entries(rows).map(([rowKey, rowSeats]) => (
                        <div key={rowKey} className="flex items-center space-x-2.5">
                            {/* Row Label Left */}
                            <span className="w-5 text-right text-xs font-bold text-[#94A3B8]">
                                {rowKey}
                            </span>

                            {/* Seats in Row */}
                            <div className="flex space-x-2">
                                {rowSeats.map((seat) => {
                                    const { style, isClickable, icon, tooltip } = getSeatState(seat);
                                    const sizeClass = seat.seatType === 'COUPLE' ? 'w-12 h-7 sm:h-8' : 'w-7 h-7 sm:w-8 sm:h-8';

                                    return (
                                        <button
                                            key={seat.seatId}
                                            type="button"
                                            title={tooltip}
                                            disabled={!isClickable}
                                            onClick={() => onToggleSeat(seat)}
                                            className={`
                                                ${sizeClass} rounded-md border text-[10px] sm:text-xs flex items-center justify-center relative select-none font-semibold
                                                ${style}
                                            `}
                                        >
                                            {!icon && <span>{seat.rowName}{seat.seatNumber}</span>}
                                            {icon}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Row Label Right */}
                            <span className="w-5 text-left text-xs font-bold text-[#94A3B8]">
                                {rowKey}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* 3. SEAT LEGEND (Exact matching mau.png) */}
            <div className="mt-4 pt-6 border-t border-[#2A323E]/80 w-full max-w-3xl flex flex-wrap items-center justify-center gap-5 sm:gap-7 text-xs text-[#CBD5E1]">
                <div className="flex items-center space-x-2">
                    <span className="w-4 h-4 rounded bg-[#7F1D1D] border border-[#7F1D1D] flex items-center justify-center relative overflow-hidden">
                        <VietnamStar className="absolute" />
                    </span>
                    <span>Đã đặt</span>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="w-4 h-4 rounded bg-[#2563EB] border border-[#60A5FA] shadow-[0_0_6px_rgba(37,99,235,0.7)]" />
                    <span>Ghế bạn chọn</span>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="w-4 h-4 rounded bg-[#252B34] border border-[#343B46]" />
                    <span>Ghế thường</span>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="w-4 h-4 rounded bg-[#F59E0B] border border-[#FCD34D]" />
                    <span>Ghế VIP</span>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="w-5 h-4 rounded bg-[#E11D48] border border-[#FB7185]" />
                    <span>Ghế đôi</span>
                </div>
            </div>
        </div>
    );
};

export default SeatSelection;
