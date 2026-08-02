import React from 'react';
import HeroSlider from '../components/home/HeroSlider';
import NowShowingSection from '../components/home/NowShowingSection';
import UpcomingSection from '../components/home/UpcomingSection';

const Home = () => {
  return (
    <div className="space-y-4 pb-16 bg-slate-50 min-h-screen">
      {/* Section 1: Hero Banner Slider (Chỉ ảnh Backdrop + Nút Prev/Next) */}
      <HeroSlider />

      {/* Section 2: Phim Đang Chiếu (Poster, Thể loại, Tên, Ngày công chiếu) */}
      <NowShowingSection />

      {/* Section 3: Phim Sắp Chiếu (Poster, Tên, Ngày khởi chiếu) */}
      <UpcomingSection />
    </div>
  );
};

export default Home;
