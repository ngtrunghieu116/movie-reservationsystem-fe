import React from 'react';

const HeroSkeleton = () => {
    return (
        <div className="w-full px-2 sm:px-2.5 pt-2">
            <div className="w-full h-[calc(100vh-64px)] min-h-[700px] max-h-[850px] bg-slate-900 rounded-2xl animate-pulse relative overflow-hidden" />
        </div>
    );
};

export default HeroSkeleton;
