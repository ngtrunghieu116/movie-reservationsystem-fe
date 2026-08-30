import { Film, Calendar, Clock, Ticket, Popcorn, ShieldCheck, AlertCircle } from 'lucide-react';

export const OrderSummary = ({ reservationData }) => {
    if (!reservationData) return null;

    const {
        bookingCode,
        movieTitle,
        showtimeStart,
        ticketSeats = [],
        ticketSubtotal = 0,
        items = [],
        fnbSubtotal = 0
    } = reservationData;

    const startDate = showtimeStart ? new Date(showtimeStart) : null;
    const formattedTime = startDate
        ? startDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
        : '--:--';
    const formattedDate = startDate
        ? startDate.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })
        : '--/--/----';

    return (
        <div className="bg-[#121821] border border-[#2A323E] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#2A323E] pb-5">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-[#E50914]/15 border border-[#E50914]/30 flex items-center justify-center flex-shrink-0">
                        <Film className="w-5 h-5 text-[#E50914]" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-[#F8FAFC]">Thông Tin Đặt Vé</h2>
                        <p className="text-xs text-[#94A3B8]">Chi tiết suất chiếu, ghế ngồi & bắp nước</p>
                    </div>
                </div>

                {bookingCode && (
                    <div className="text-right">
                        <span className="text-[10px] text-[#64748B] uppercase tracking-wider block font-semibold">Mã giữ chỗ</span>
                        <span className="text-sm sm:text-base font-black font-mono text-[#F59E0B] tracking-wider">
                            #{bookingCode}
                        </span>
                    </div>
                )}
            </div>

            {/* Movie Info */}
            <div className="space-y-3 bg-[#171C24] p-4.5 rounded-xl border border-[#252C38]">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-wide flex items-center space-x-2">
                    <span>{movieTitle || 'Phim đang chiếu'}</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-[#CBD5E1] pt-1">
                    <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-[#E50914] flex-shrink-0" />
                        <span>Giờ chiếu: <strong className="text-white font-mono">{formattedTime}</strong></span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-[#E50914] flex-shrink-0" />
                        <span className="capitalize">{formattedDate}</span>
                    </div>
                </div>
            </div>

            {/* Seats Info */}
            <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-[#94A3B8]">
                    <span className="flex items-center space-x-1.5 text-[#2563EB]">
                        <Ticket className="w-4 h-4" />
                        <span className="text-[#CBD5E1]">Ghế đã chọn ({ticketSeats.length}):</span>
                    </span>
                    <span className="font-mono text-white font-bold">
                        {Number(ticketSubtotal || 0).toLocaleString('vi-VN')} đ
                    </span>
                </div>

                <div className="flex flex-wrap gap-2">
                    {ticketSeats.map((seat, idx) => (
                        <div
                            key={seat.seatId || idx}
                            className="px-3 py-1.5 rounded-lg bg-[#1E293B] border border-[#3B82F6]/40 text-[#60A5FA] font-mono font-bold text-xs flex items-center space-x-1 shadow-sm"
                        >
                            <span>{seat.rowName}{seat.seatNumber}</span>
                            {seat.seatType && (
                                <span className="text-[10px] text-[#94A3B8] font-normal font-sans ml-1">
                                    ({seat.seatType})
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* F&B Info */}
            <div className="space-y-3 border-t border-[#2A323E] pt-5">
                <div className="flex items-center justify-between text-xs font-semibold text-[#94A3B8]">
                    <span className="flex items-center space-x-1.5 text-[#F59E0B]">
                        <Popcorn className="w-4 h-4" />
                        <span className="text-[#CBD5E1]">Bắp nước ({items.length} loại):</span>
                    </span>
                    <span className="font-mono text-white font-bold">
                        {Number(fnbSubtotal || 0).toLocaleString('vi-VN')} đ
                    </span>
                </div>

                {items.length > 0 ? (
                    <div className="space-y-2">
                        {items.map((item) => (
                            <div
                                key={item.itemId || item.productId}
                                className="flex items-center justify-between p-3 rounded-xl bg-[#171C24] border border-[#252C38] text-xs"
                            >
                                <div className="space-y-0.5">
                                    <span className="font-bold text-white block">{item.productName}</span>
                                    <span className="text-[11px] text-[#94A3B8] font-mono">
                                        {Number(item.unitPrice || 0).toLocaleString('vi-VN')} đ × {item.quantity}
                                    </span>
                                </div>
                                <span className="font-mono font-bold text-[#F59E0B] text-sm">
                                    {Number(item.subtotal || 0).toLocaleString('vi-VN')} đ
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-xs text-[#64748B] italic bg-[#171C24] p-3 rounded-xl border border-[#252C38]">
                        Không có sản phẩm bắp nước trong đơn này.
                    </p>
                )}
            </div>

            {/* Terms & Guidance */}
            <div className="space-y-2 pt-2 border-t border-[#2A323E]/80 text-[11px] text-[#94A3B8] leading-relaxed">
                <div className="flex items-start space-x-2">
                    <ShieldCheck className="w-4 h-4 text-[#10B981] flex-shrink-0 mt-0.5" />
                    <span>Vé và bắp nước sẽ được gửi qua email và hiển thị tại mục <strong>Lịch sử đặt vé</strong> sau khi thanh toán thành công.</span>
                </div>
                <div className="flex items-start space-x-2">
                    <AlertCircle className="w-4 h-4 text-[#F59E0B] flex-shrink-0 mt-0.5" />
                    <span>Vui lòng kiểm tra kỹ thông tin phim, suất chiếu và ghế ngồi. Vé đã mua không thể hoàn/hủy.</span>
                </div>
            </div>
        </div>
    );
};

export default OrderSummary;
