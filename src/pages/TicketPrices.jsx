import React from 'react';
import { PageContainer, PageHeader } from '../components/ui/PageContainer';
import EmptyState from '../components/ui/EmptyState';
import { Tag } from 'lucide-react';

const TicketPrices = () => {
  return (
    <PageContainer>
      <PageHeader title="Bảng Giá Vé" subtitle="Quy định giá vé xem phim theo khung giờ và loại ghế" />
      <EmptyState
        title="Bảng Giá Vé"
        description="Thông tin chi tiết bảng giá vé và ưu đãi sẽ được hiển thị tại đây."
        icon={Tag}
      />
    </PageContainer>
  );
};

export default TicketPrices;
