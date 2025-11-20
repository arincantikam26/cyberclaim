// components/tarif/TarifGridView.tsx
'use client';

import { InacbgsTarif } from '@/types/inacbgs';
import { DataGrid } from '@/components/common/DataGrid';
import TarifCard from './TarifCard';

interface TarifGridViewProps {
  tarif: InacbgsTarif[];
  onViewDetail: (tarif: InacbgsTarif) => void;
  loading?: boolean;
}

export default function TarifGridView({ 
  tarif, 
  onViewDetail, 
  loading = false 
}: TarifGridViewProps) {
  return (
    <DataGrid
      data={tarif}
      renderItem={(item) => (
        <TarifCard
          tarif={item}
          onViewDetail={onViewDetail}
          viewType="grid"
        />
      )}
      loading={loading}
      columns={3}
      gap="lg"
    />
  );
}