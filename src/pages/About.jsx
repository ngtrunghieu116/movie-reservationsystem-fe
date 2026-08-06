import React from 'react';
import { PageContainer, PageHeader } from '../components/ui/PageContainer';
import EmptyState from '../components/ui/EmptyState';
import { Info } from 'lucide-react';

const About = () => {
  return (
    <PageContainer>
      <PageHeader title="Về Chúng Tôi" subtitle="Giới thiệu về hệ thống rạp chiếu phim CineMind" />
      <EmptyState
        title="Giới Thiệu CineMind"
        description="Thông tin giới thiệu về thương hiệu rạp phim CineMind."
        icon={Info}
      />
    </PageContainer>
  );
};

export default About;
