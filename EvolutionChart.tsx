import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { HealthSnapshot } from "../../types";

export function EvolutionChart({ snapshots }: { snapshots: HealthSnapshot[] }) {
  const data = (snapshots || []).map((s) => ({
    name: format(parseISO(s.date), "MMM yyyy", { locale: es }),
    Implementación: s.implementation,
    Evidencia: s.evidence,
    Eficacia: s.effectiveness,
    "Audit Readiness": s.auditReadiness,
    "Salud Global": s.globalHealth,
  }));

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm h-[320px] flex flex-col">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          Evolución del Sistema (Últimos 6 meses)
        </h2>
        <div className="flex-1 flex items-center justify-center text-slate-400">
          Sin datos históricos
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-800 mb-4">
        Evolución del Sistema (Últimos 6 meses)
      </h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 20, left: -20, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e2e8f0"
            />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
              domain={[0, 100]}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
              itemStyle={{ fontSize: "13px" }}
              labelStyle={{
                fontSize: "13px",
                color: "#64748b",
                marginBottom: "4px",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
            <Line
              type="monotone"
              dataKey="Implementación"
              stroke="#0ea5e9"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="Evidencia"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="Eficacia"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="Salud Global"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
