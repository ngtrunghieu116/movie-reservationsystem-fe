export const movieFormatter = {
    formatDuration: (minutes) => {
        if (!minutes) return 'N/A';
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return `${h}h${m.toString().padStart(2, '0')}'`;
    },

    formatRating: (rating) => {
        if (!rating) return 'Chưa có đánh giá';
        return `⭐ ${Number(rating).toFixed(1)}/10`;
    }
};
