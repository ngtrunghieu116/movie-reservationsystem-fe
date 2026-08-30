import { CreditCard, Clock, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export const PaymentPanel = ({
    reservationData,
    timeLeft = 0,
    isExpired = false,
    isProcessingPayment = false,
    onPay = () => {}
}) => {
    if (!reservationData) return null;

    const {
        ticketSubtotal = 0,
        fnbSubtotal = 0,
        totalAmount = 0
    } = reservationData;

    const formatCountdown = (seconds) => {
        if (seconds <= 0) return '00:00';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const isExpiringSoon = timeLeft > 0 && timeLeft < 120;

    return (
        <div className="bg-[#121821] border border-[#2A323E] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl sticky top-24">
            
            {/* Header */}
            <div className="flex items-center space-x-3 border-b border-[#2A323E] pb-5">
                <div className="w-10 h-10 rounded-xl bg-[#E50914]/15 border border-[#E50914]/30 flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-5 h-5 text-[#E50914]" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-[#F8FAFC]">Thanh Toán</h2>
                    <p className="text-xs text-[#94A3B8]">Chọn cổng thanh toán và hoàn tất đơn hàng</p>
                </div>
            </div>

            {/* Countdown Box */}
            <div className={`
                p-3.5 rounded-xl border flex items-center justify-between text-xs transition-colors
                ${isExpired
                    ? 'bg-red-950/40 border-red-800/50 text-red-400'
                    : isExpiringSoon
                        ? 'bg-red-950/20 border-red-500/40 text-red-400'
                        : 'bg-[#171C24] border-[#2A323E] text-[#CBD5E1]'
                }
            `}>
                <div className="flex items-center space-x-2">
                    <Clock className={`w-4 h-4 ${isExpired || isExpiringSoon ? 'text-[#E50914] animate-pulse' : 'text-[#F59E0B]'}`} />
                    <span>{isExpired ? 'Đơn hàng đã hết hạn:' : 'Thời gian giữ chỗ còn lại:'}</span>
                </div>
                <span className={`font-mono text-base font-black tracking-wider ${isExpired || isExpiringSoon ? 'text-[#E50914]' : 'text-[#F59E0B]'}`}>
                    {formatCountdown(timeLeft)}
                </span>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 bg-[#171C24] p-4.5 rounded-xl border border-[#252C38] text-xs">
                <div className="flex items-center justify-between text-[#94A3B8]">
                    <span>Tiền vé xem phim:</span>
                    <span className="font-mono text-[#CBD5E1] font-semibold">
                        {Number(ticketSubtotal || 0).toLocaleString('vi-VN')} đ
                    </span>
                </div>

                <div className="flex items-center justify-between text-[#94A3B8]">
                    <span>Tiền bắp nước (F&B):</span>
                    <span className="font-mono text-[#CBD5E1] font-semibold">
                        {Number(fnbSubtotal || 0).toLocaleString('vi-VN')} đ
                    </span>
                </div>

                <div className="pt-3 border-t border-[#2A323E] flex items-center justify-between">
                    <span className="text-sm font-bold text-white uppercase tracking-wide">Tổng Cộng:</span>
                    <span className="text-xl sm:text-2xl font-black font-mono text-[#E50914] tracking-tight">
                        {Number(totalAmount || 0).toLocaleString('vi-VN')} đ
                    </span>
                </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3">
                <span className="text-xs text-[#94A3B8] uppercase tracking-wider font-semibold block">
                    Phương thức thanh toán
                </span>

                <div className="relative p-4 rounded-xl border-2 border-[#E50914] bg-[#1A1015]/60 shadow-[0_0_15px_rgba(229,9,20,0.12)] flex items-start space-x-3 cursor-pointer">
                    <div className="mt-0.5">
                        <CheckCircle2 className="w-5 h-5 text-[#E50914]" />
                    </div>
                    <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-white">Cổng VNPAY QR / Thẻ ATM & Quốc tế</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#0066B3]/20 border border-[#0066B3]/50 text-[#38BDF8] font-bold">
                                VNPAY
                            </span>
                        </div>
                        <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                            Quét mã VNPAY-QR trên Mobile Banking, thẻ ATM nội địa, hoặc thẻ quốc tế Visa / MasterCard / JCB.
                        </p>
                    </div>
                </div>
            </div>

            {/* Expiration Error Notice */}
            {isExpired && (
                <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-800/50 flex items-start space-x-2.5 text-xs text-red-300">
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <span>
                        Đơn đặt vé này đã hết thời gian giữ chỗ. Vui lòng quay lại chọn suất chiếu và ghế mới.
                    </span>
                </div>
            )}

            {/* Payment Action Button */}
            <button
                type="button"
                disabled={isExpired || isProcessingPayment}
                onClick={onPay}
                className={`
                    w-full py-3.5 rounded-xl text-sm sm:text-base font-bold transition-all shadow-lg select-none flex items-center justify-center space-x-2
                    ${isExpired || isProcessingPayment
                        ? 'bg-[#252B34] text-[#64748B] cursor-not-allowed shadow-none border border-[#343B46]'
                        : 'bg-[#E50914] text-white hover:bg-[#F5222D] shadow-[#E50914]/30 cursor-pointer'
                    }
                `}
            >
                {isProcessingPayment ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Đang chuyển hướng sang VNPAY...</span>
                    </>
                ) : isExpired ? (
                    <span>Đơn hàng đã hết hạn</span>
                ) : (
                    <span>THANH TOÁN NGAY</span>
                )}
            </button>

            {/* Security Guarantee Note */}
            <p className="text-center text-[11px] text-[#64748B]">
                🔒 Giao dịch được mã hóa và bảo mật 100% qua cổng VNPAY
            </p>
        </div>
    );
};

export default PaymentPanel;
