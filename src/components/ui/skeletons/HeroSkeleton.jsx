import React from 'react';

const HeroSkeleton = () => {
    return (
        <div className="w-full h-[480px] md:h-[520px] bg-slate-100 animate-pulse relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-white via-slate-50/60 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 lg:p-16">
                <div className="max-w-2xl flex flex-col gap-4">
                    <div className="flex gap-2">
                        <div className="h-6 w-16 bg-slate-200 rounded-full"></div>
                        <div className="h-6 w-12 bg-slate-200 rounded-full"></div>
                    </div>
                    <div className="h-10 bg-slate-200 rounded-lg w-3/4"></div>
                    <div className="h-5 bg-slate-200 rounded w-full"></div>
                    <div className="h-5 bg-slate-200 rounded w-2/3"></div>
                    <div className="flex gap-4 mt-4">
                        <div className="h-12 w-36 bg-slate-200 rounded-lg"></div>
                        <div className="h-12 w-36 bg-slate-200 rounded-lg"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSkeleton;
