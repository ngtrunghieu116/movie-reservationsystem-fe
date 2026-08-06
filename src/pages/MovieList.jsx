import React from 'react';
import { PageContainer, PageHeader } from '../components/ui/PageContainer';
import EmptyState from '../components/ui/EmptyState';
import { Film } from 'lucide-react';

const MovieList = () => {
  return (
    <PageContainer>
      <PageHeader title="Danh Sách Phim Chiếu" subtitle="Tất cả các phim đang chiếu và sắp chiếu tại rạp" />
      <EmptyState
        title="Danh Sách Phim"
        description="Tính năng tìm kiếm và hiển thị danh sách phim sẽ hoàn thiện ở Sprint 3."
        icon={Film}
      />
    </PageContainer>
  );
};

export default MovieList;
