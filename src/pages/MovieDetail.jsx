import React from 'react';
import { useParams } from 'react-router-dom';
import { PageContainer } from '../components/ui/PageContainer';
import EmptyState from '../components/ui/EmptyState';
import { Film } from 'lucide-react';

const MovieDetail = () => {
  const { id } = useParams();

  return (
    <PageContainer>
      <EmptyState
        title={`Chi Tiết Phim #${id}`}
        description="Giao diện thông tin phim, trailer và lịch chiếu chi tiết sẽ hoàn thiện ở Sprint 4."
        icon={Film}
      />
    </PageContainer>
  );
};

export default MovieDetail;
