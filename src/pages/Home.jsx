import React from 'react';
import { PageContainer, PageSection } from '../components/ui/PageContainer';
import EmptyState from '../components/ui/EmptyState';
import { Film } from 'lucide-react';

const Home = () => {
  return (
    <PageContainer>
      <PageSection title="Trang Chủ CineMind">
        <EmptyState
          title="Chào mừng đến với CineMind"
          description="Giao diện Trang Chủ và danh sách Phim đang chiếu sẽ được ghép dữ liệu API ở Sprint 2."
          icon={Film}
        />
      </PageSection>
    </PageContainer>
  );
};

export default Home;
