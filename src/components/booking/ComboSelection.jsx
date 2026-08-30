import { useState, useEffect, useCallback } from 'react';
import { Sparkles, Package, Popcorn, Coffee, Plus, Minus, AlertCircle, Loader2, ShoppingBag, Check } from 'lucide-react';
import { productApi } from '../../api/productApi';
import { reservationApi } from '../../api/reservationApi';
import toast from 'react-hot-toast';

// Categories Configuration with Icons & Styling
const CATEGORIES = [
    { key: 'ALL', label: 'Tất cả', icon: Sparkles },
    { key: 'COMBO', label: 'Combo', icon: Package },
    { key: 'FOOD', label: 'Bắp rang', icon: Popcorn },
    { key: 'DRINK', label: 'Nước uống', icon: Coffee },
];

const CATEGORY_META = {
    COMBO: { label: 'Combo', icon: Package, color: 'text-amber-400', badgeBg: 'bg-amber-950/60 border-amber-500/30 text-amber-400' },
    FOOD: { label: 'Bắp rang', icon: Popcorn, color: 'text-red-400', badgeBg: 'bg-red-950/60 border-red-500/30 text-red-400' },
    DRINK: { label: 'Nước uống', icon: Coffee, color: 'text-sky-400', badgeBg: 'bg-sky-950/60 border-sky-500/30 text-sky-400' },
};

export const ComboSelection = ({
    reservationId,
    reservationData,
    onReservationUpdate,
    disabled = false
}) => {
    const [products, setProducts] = useState([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(true);
    const [loadError, setLoadError] = useState(null);
    const [activeCategory, setActiveCategory] = useState('ALL');
    const [mutatingProductIds, setMutatingProductIds] = useState(new Set());

    // Map selected items from Backend reservationData { productId -> { itemId, quantity, subtotal } }
    const selectedItemsMap = useCallback(() => {
        const map = {};
        if (reservationData?.items && Array.isArray(reservationData.items)) {
            reservationData.items.forEach(item => {
                map[item.productId] = {
                    itemId: item.itemId,
                    quantity: item.quantity,
                    subtotal: item.subtotal
                };
            });
        }
        return map;
    }, [reservationData]);

    // Fetch product catalog on mount
    const fetchProducts = useCallback(async () => {
        setIsLoadingProducts(true);
        setLoadError(null);
        try {
            const data = await productApi.getProducts();
            const productList = Array.isArray(data) ? data : (data?.content || []);
            const activeList = productList.filter(p => p.isActive !== false);
            setProducts(activeList);
        } catch (err) {
            console.error('Failed to load products:', err);
            setLoadError(err.message || 'Không thể tải danh mục bắp nước');
            toast.error('Không thể tải danh sách bắp nước. Vui lòng thử lại.');
        } finally {
            setIsLoadingProducts(false);
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchProducts();
    }, [fetchProducts]);

    // Handle Quantity Mutation (0 -> 1: add, 1 -> 2: update, 1 -> 0: remove)
    const handleQuantityChange = async (product, targetQty) => {
        if (disabled || mutatingProductIds.has(product.id)) return;

        const currentMap = selectedItemsMap();
        const currentItem = currentMap[product.id];
        const currentQty = currentItem?.quantity || 0;

        if (targetQty === currentQty) return;
        if (targetQty < 0) return;

        // Inventory check
        if (product.availableQuantity != null && targetQty > product.availableQuantity) {
            toast.error(`Sản phẩm "${product.name}" chỉ còn tối đa ${product.availableQuantity} phần.`);
            return;
        }

        // Set mutation state for this specific product only
        setMutatingProductIds(prev => new Set(prev).add(product.id));

        try {
            let response;
            if (currentQty === 0 && targetQty > 0) {
                // 0 -> 1 : ADD ITEM
                response = await reservationApi.addCombo(reservationId, {
                    productId: product.id,
                    quantity: targetQty
                });
            } else if (targetQty === 0 && currentItem) {
                // N -> 0 : REMOVE ITEM
                response = await reservationApi.removeCombo(reservationId, currentItem.itemId);
            } else if (currentItem && targetQty > 0) {
                // N -> M : UPDATE QUANTITY
                response = await reservationApi.updateCombo(reservationId, currentItem.itemId, {
                    quantity: targetQty
                });
            }

            if (response && onReservationUpdate) {
                onReservationUpdate(response);
            }
        } catch (err) {
            console.error('Failed to mutate F&B item:', err);
            const status = err.status || err.statusCode;
            if (status === 409) {
                toast.error(`Sản phẩm "${product.name}" đã hết hàng hoặc không đủ số lượng.`);
            } else if (status === 401) {
                toast.error('Phiên làm việc hết hạn. Vui lòng đăng nhập lại.');
            } else {
                toast.error(err.message || 'Không thể cập nhật bắp nước. Vui lòng thử lại.');
            }

            // Sync with backend truth
            try {
                const review = await reservationApi.reviewReservation(reservationId);
                if (onReservationUpdate) onReservationUpdate(review);
            } catch (syncErr) {
                console.warn('Sync review after error failed:', syncErr);
            }
        } finally {
            setMutatingProductIds(prev => {
                const next = new Set(prev);
                next.delete(product.id);
                return next;
            });
        }
    };

    // Filter products locally by active tab
    const filteredProducts = activeCategory === 'ALL'
        ? products
        : products.filter(p => (p.category || 'COMBO') === activeCategory);

    // Sorted products by displayOrder
    const sortedProducts = [...filteredProducts].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

    const currentMap = selectedItemsMap();
    const totalSelectedCount = reservationData?.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;

    return (
        <div className="w-full space-y-6">
            
            {/* Header with Title & Context Note */}
            <div className="bg-[#121821] border border-[#2A323E] rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#E50914]/15 border border-[#E50914]/30 flex items-center justify-center flex-shrink-0">
                        <Popcorn className="w-6 h-6 text-[#E50914]" />
                    </div>
                    <div>
                        <div className="flex items-center space-x-2">
                            <h2 className="text-xl font-bold text-[#F8FAFC]">Combo & Bắp Nước Rạp</h2>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E50914]/10 border border-[#E50914]/30 text-[#E50914] font-semibold uppercase tracking-wider">
                                Tùy chọn
                            </span>
                        </div>
                        <p className="text-xs text-[#94A3B8] mt-0.5">
                            Thưởng thức bắp rang bơ nóng giòn & nước ngọt mát lạnh trong suốt bộ phim
                        </p>
                    </div>
                </div>

                {/* Selected Counter & Note */}
                <div className="flex items-center space-x-3 self-start md:self-auto">
                    {totalSelectedCount > 0 && (
                        <div className="px-3.5 py-1.5 rounded-xl bg-[#E50914]/15 border border-[#E50914]/40 text-[#E50914] text-xs font-bold flex items-center space-x-1.5 shadow-sm">
                            <Check className="w-3.5 h-3.5" />
                            <span>Đã chọn {totalSelectedCount} món</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center space-x-2 sm:space-x-3 overflow-x-auto pb-1 scrollbar-none">
                {CATEGORIES.map(cat => {
                    const Icon = cat.icon;
                    const isActive = activeCategory === cat.key;
                    const count = cat.key === 'ALL'
                        ? products.length
                        : products.filter(p => (p.category || 'COMBO') === cat.key).length;

                    return (
                        <button
                            key={cat.key}
                            type="button"
                            onClick={() => setActiveCategory(cat.key)}
                            className={`
                                px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center space-x-2 transition-all duration-200 border whitespace-nowrap cursor-pointer
                                ${isActive
                                    ? 'bg-[#E50914] text-white border-[#E50914] shadow-md shadow-[#E50914]/25 ring-1 ring-[#E50914]/50'
                                    : 'bg-[#121821] text-[#94A3B8] border-[#2A323E] hover:border-[#3E4A5C] hover:text-[#F8FAFC]'
                                }
                            `}
                        >
                            <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#94A3B8]'}`} />
                            <span>{cat.label}</span>
                            <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-mono ${isActive ? 'bg-white/20 text-white' : 'bg-[#1A222D] text-[#64748B]'}`}>
                                {count}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Loading State */}
            {isLoadingProducts && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="bg-[#121821] border border-[#2A323E] rounded-2xl p-4 space-y-4 animate-pulse">
                            <div className="w-full aspect-[16/10] bg-[#1A222D] rounded-xl" />
                            <div className="space-y-2">
                                <div className="h-4 bg-[#1A222D] rounded w-3/4" />
                                <div className="h-3 bg-[#1A222D] rounded w-full" />
                            </div>
                            <div className="flex justify-between items-center pt-2">
                                <div className="h-5 bg-[#1A222D] rounded w-20" />
                                <div className="h-8 bg-[#1A222D] rounded w-16" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Error State */}
            {!isLoadingProducts && loadError && (
                <div className="bg-[#121821] border border-[#7F1D1D]/40 rounded-2xl p-8 text-center space-y-4 max-w-md mx-auto">
                    <AlertCircle className="w-10 h-10 text-[#E50914] mx-auto" />
                    <h3 className="text-base font-bold text-[#F8FAFC]">Không thể tải bắp nước</h3>
                    <p className="text-xs text-[#94A3B8]">{loadError}</p>
                    <button
                        type="button"
                        onClick={fetchProducts}
                        className="px-5 py-2 rounded-xl bg-[#E50914] hover:bg-[#F5222D] text-white text-xs font-bold transition cursor-pointer"
                    >
                        Thử lại
                    </button>
                </div>
            )}

            {/* Empty State */}
            {!isLoadingProducts && !loadError && sortedProducts.length === 0 && (
                <div className="bg-[#121821] border border-[#2A323E] rounded-2xl p-10 text-center space-y-3 max-w-lg mx-auto">
                    <ShoppingBag className="w-10 h-10 text-[#64748B] mx-auto opacity-70" />
                    <h3 className="text-sm font-bold text-[#F8FAFC]">Chưa có sản phẩm trong danh mục này</h3>
                    <p className="text-xs text-[#94A3B8]">
                        Bạn có thể chọn danh mục khác hoặc bấm <span className="text-white font-semibold">Tiếp tục</span> để chuyển sang bước thanh toán vé.
                    </p>
                </div>
            )}

            {/* Product Grid */}
            {!isLoadingProducts && !loadError && sortedProducts.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                    {sortedProducts.map(product => {
                        const item = currentMap[product.id];
                        const qty = item?.quantity || 0;
                        const isMutating = mutatingProductIds.has(product.id);
                        const isSoldOut = product.availableQuantity != null && product.availableQuantity <= 0;
                        const isMaxed = product.availableQuantity != null && qty >= product.availableQuantity;
                        const categoryMeta = CATEGORY_META[product.category] || CATEGORY_META.COMBO;
                        const CategoryIcon = categoryMeta.icon;

                        return (
                            <div
                                key={product.id}
                                className={`
                                    group relative flex flex-col justify-between bg-[#121821] border rounded-2xl p-4 transition-all duration-300 shadow-lg overflow-hidden
                                    ${qty > 0
                                        ? 'border-[#E50914] bg-[#161115] shadow-[0_0_20px_rgba(229,9,20,0.18)] ring-1 ring-[#E50914]/40'
                                        : 'border-[#2A323E] hover:border-[#3E4A5C] hover:shadow-xl'
                                    }
                                    ${isSoldOut ? 'opacity-60' : ''}
                                    ${disabled ? 'pointer-events-none opacity-60' : ''}
                                `}
                            >
                                {/* Top Image & Badges */}
                                <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-[#0B0F14] flex items-center justify-center border border-[#1F2733]">
                                    {product.imagePath ? (
                                        <img
                                            src={product.imagePath}
                                            alt={product.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                    ) : null}

                                    {/* Fallback Graphic */}
                                    <div 
                                        style={{ display: product.imagePath ? 'none' : 'flex' }}
                                        className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#1E2633]/60 to-[#0B0F14]"
                                    >
                                        <CategoryIcon className={`w-12 h-12 ${categoryMeta.color} opacity-80 mb-1`} />
                                        <span className="text-[11px] text-[#64748B] font-medium tracking-wider uppercase">Cinemind Concession</span>
                                    </div>

                                    {/* Category Tag (Top-Left) */}
                                    <div className="absolute top-2.5 left-2.5">
                                        <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold border backdrop-blur-md ${categoryMeta.badgeBg}`}>
                                            {categoryMeta.label}
                                        </span>
                                    </div>

                                    {/* Quantity Badge (Top-Right) */}
                                    {qty > 0 && (
                                        <div className="absolute top-2.5 right-2.5">
                                            <span className="px-2.5 py-0.5 rounded-md bg-[#E50914] text-white text-xs font-bold font-mono shadow-md flex items-center space-x-1">
                                                <span>×</span>
                                                <span>{qty}</span>
                                            </span>
                                        </div>
                                    )}

                                    {/* Sold Out Overlay */}
                                    {isSoldOut && (
                                        <div className="absolute inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center">
                                            <span className="px-3 py-1 rounded-md bg-red-950/80 border border-red-500/50 text-red-400 text-xs font-bold tracking-wider uppercase">
                                                Hết hàng
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Content Info */}
                                <div className="mt-3.5 space-y-1.5 flex-1 flex flex-col justify-between">
                                    <div className="space-y-1">
                                        <h4 className="text-sm sm:text-base font-bold text-[#F8FAFC] tracking-wide line-clamp-1 group-hover:text-white transition-colors" title={product.name}>
                                            {product.name}
                                        </h4>
                                        <p className="text-xs text-[#94A3B8] line-clamp-2 leading-relaxed min-h-[2rem]">
                                            {product.description || 'Combo rạp chiếu phim chất lượng cao phục vụ suốt buổi chiếu.'}
                                        </p>
                                    </div>

                                    {/* Price & Quantity Controls */}
                                    <div className="pt-3 border-t border-[#1F2733] flex items-center justify-between mt-2">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-[#64748B] uppercase tracking-wider font-semibold">Đơn giá</span>
                                            <span className="text-base sm:text-lg font-black font-mono text-[#F59E0B] tracking-tight">
                                                {Number(product.price || 0).toLocaleString('vi-VN')} đ
                                            </span>
                                        </div>

                                        {/* Action Buttons */}
                                        {isSoldOut ? (
                                            <span className="text-xs text-[#64748B] italic">Tạm ngưng</span>
                                        ) : (
                                            <div className="flex items-center space-x-1.5">
                                                {qty === 0 ? (
                                                    <button
                                                        type="button"
                                                        disabled={isMutating || disabled}
                                                        onClick={() => handleQuantityChange(product, 1)}
                                                        className="px-3.5 py-1.5 rounded-xl bg-[#1A222D] hover:bg-[#E50914] text-[#CBD5E1] hover:text-white border border-[#2A323E] hover:border-[#E50914] text-xs font-bold transition-all duration-200 flex items-center space-x-1 shadow-sm cursor-pointer disabled:opacity-50"
                                                    >
                                                        {isMutating ? (
                                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                        ) : (
                                                            <>
                                                                <Plus className="w-3.5 h-3.5" />
                                                                <span>Chọn</span>
                                                            </>
                                                        )}
                                                    </button>
                                                ) : (
                                                    <div className="flex items-center space-x-1.5 bg-[#0B0F14] border border-[#2A323E] rounded-xl p-1 shadow-inner">
                                                        <button
                                                            type="button"
                                                            disabled={isMutating || disabled}
                                                            onClick={() => handleQuantityChange(product, qty - 1)}
                                                            className="w-7 h-7 rounded-lg bg-[#1A222D] hover:bg-[#252E3D] text-white flex items-center justify-center transition-colors disabled:opacity-40 cursor-pointer"
                                                            title="Giảm 1 phần"
                                                        >
                                                            {isMutating ? (
                                                                <Loader2 className="w-3 h-3 animate-spin text-[#E50914]" />
                                                            ) : (
                                                                <Minus className="w-3.5 h-3.5" />
                                                            )}
                                                        </button>

                                                        <span className="w-6 text-center text-sm font-black text-white font-mono select-none">
                                                            {qty}
                                                        </span>

                                                        <button
                                                            type="button"
                                                            disabled={isMutating || disabled || isMaxed}
                                                            onClick={() => handleQuantityChange(product, qty + 1)}
                                                            className="w-7 h-7 rounded-lg bg-[#E50914] hover:bg-[#F5222D] text-white flex items-center justify-center transition-colors disabled:opacity-40 cursor-pointer shadow-sm shadow-[#E50914]/30"
                                                            title={isMaxed ? 'Đã đạt giới hạn tối đa' : 'Thêm 1 phần'}
                                                        >
                                                            {isMutating ? (
                                                                <Loader2 className="w-3 h-3 animate-spin text-white" />
                                                            ) : (
                                                                <Plus className="w-3.5 h-3.5" />
                                                            )}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Bottom Reminder Note */}
            <div className="p-4 rounded-xl bg-[#121821]/60 border border-[#2A323E]/70 text-center">
                <p className="text-xs text-[#94A3B8]">
                    💡 <span className="text-[#CBD5E1] font-medium">Lưu ý:</span> Bắp nước là phần mua kèm không bắt buộc. Bạn có thể nhấn <span className="text-white font-bold">Tiếp tục</span> ở thanh bên dưới bất kỳ lúc nào để chuyển sang bước Xác nhận & Thanh toán.
                </p>
            </div>
        </div>
    );
};

export default ComboSelection;
