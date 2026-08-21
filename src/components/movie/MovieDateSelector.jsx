import React, { useMemo } from 'react';

/**
 * Generates an array of dates starting from today in DD-MM-YYYY format.
 * @param {number} daysCount 
 */
const generateDates = (daysCount = 7) => {
    const dates = [];
    const today = new Date();

    for (let i = 0; i < daysCount; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);

        const dayNum = String(d.getDate()).padStart(2, '0');
        const monthNum = String(d.getMonth() + 1).padStart(2, '0');
        const yearNum = d.getFullYear();

        const dateStr = `${yearNum}-${monthNum}-${dayNum}`;
        const displayDate = `${dayNum}-${monthNum}-${yearNum}`;

        dates.push({
            dateStr,
            displayDate,
            rawDate: d
        });
    }
    return dates;
};

const MovieDateSelector = ({ selectedDateStr, onSelectDate }) => {
    const datesList = useMemo(() => generateDates(7), []);

    return (
        <div className="w-full flex items-center justify-center py-4">
            <div className="flex items-center gap-2.5 overflow-x-auto pb-2 max-w-full scrollbar-thin scrollbar-thumb-slate-300 px-2">
                {datesList.map((d) => {
                    const isSelected = d.dateStr === selectedDateStr;
                    return (
                        <button
                            key={d.dateStr}
                            onClick={() => onSelectDate(d.dateStr)}
                            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm border transition duration-200 flex items-center justify-center min-w-[7.5rem] cursor-pointer shadow-xs ${
                                isSelected
                                    ? 'bg-red-600 text-white border-red-600 shadow-md shadow-red-600/30'
                                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                        >
                            <span className="tracking-wider font-extrabold text-xs sm:text-sm">
                                {d.displayDate}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default MovieDateSelector;
