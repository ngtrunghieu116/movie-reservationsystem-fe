import React from 'react';
import { PageContainer, PageHeader } from '../components/ui/PageContainer';
import EmptyState from '../components/ui/EmptyState';
import { Ticket } from 'lucide-react';

const MyBookings = () => {
  return (
    <PageContainer>
      <PageHeader title="Vé Của Tôi" subtitle="Quản lý vé đã đặt và lịch sử xem phim của bạn" />
      <EmptyState
        title="Bạn chưa có vé nào"
        description="Lịch sử vé đã đặt và mã QR check-in sẽ hoàn thiện ở Sprint 7."
        icon={Ticket}
      />
    </PageContainer>
  );
};

export default MyBookings;
