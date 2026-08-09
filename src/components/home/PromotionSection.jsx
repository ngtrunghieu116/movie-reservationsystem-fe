import React from 'react';
import Button from '../ui/Button';
import { mockPromotions } from '../../config/promotions';

const PromotionSection = () => {
    return (
        <section>
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                    <div className="w-1 h-7 bg-primary rounded-full"></div>
                    <h2 className="text-xl font-bold text-slate-900">Khuyến Mãi & Sự Kiện</h2>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {mockPromotions.map((promo) => (
                    <div key={promo.id} className="group bg-white rounded-xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all cursor-pointer">
                        <div className="aspect-[16/9] overflow-hidden relative">
                            <img 
                                src={promo.imageUrl} 
                                alt={promo.title} 
                                loading="lazy"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-slate-700 shadow-sm">
                                {promo.date}
                            </div>
                        </div>
                        <div className="p-4 flex flex-col gap-2">
                            <h3 className="text-base font-bold text-slate-900 group-hover:text-primary transition-colors">{promo.title}</h3>
                            <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">{promo.description}</p>
                            <div className="mt-1">
                                <Button variant="ghost" size="sm">Xem chi tiết →</Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default PromotionSection;
