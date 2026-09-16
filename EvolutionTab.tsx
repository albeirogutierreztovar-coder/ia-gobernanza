import React from 'react';
import { DashboardData } from '../../types';
import { EvolutionChart } from '../dashboard/EvolutionChart';

export function EvolutionTab({ data, standard }: { data: DashboardData, standard: string }) {
  return (
    <div className="space-y-6">
      <EvolutionChart snapshots={data.healthSnapshots} />
    </div>
  );
}
