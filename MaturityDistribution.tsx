import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export function MaturityDistribution({ kpis }: { kpis: any }) {
  const data = [
    { name: 'L0 (Inexistente)', count: kpis?.maturityCounts?.L0 || 0, color: '#f43f5e' },
    { name: 'L1 (Inicial)', count: kpis?.maturityCounts?.L1 || 0, color: '#fb923c' },
    { name: 'L2 (Gestionado)', count: kpis?.maturityCounts?.L2 || 0, color: '#facc15' },
    { name: 'L3 (Definido)', count: kpis?.maturityCounts?.L3 || 0, color: '#4ade80' },
    { name: 'L4 (Controlado)', count: kpis?.maturityCounts?.L4 || 0, color: '#2dd4bf' },
    { name: 'L5 (Optimizado)', count: kpis?.maturityCounts?.L5 || 0, color: '#0ea5e9' },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">Distribución de Madurez</h2>
          <p className="text-sm text-slate-500">Controles por nivel de madurez</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-slate-800">{kpis?.totalApplicableControls || 0}</p>
          <p className="text-xs text-slate-500 uppercase font-semibold">Controles Aplicables</p>
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip 
              cursor={{ fill: '#f8fafc' }}
              contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
