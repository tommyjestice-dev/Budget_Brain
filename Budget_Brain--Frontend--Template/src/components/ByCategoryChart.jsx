import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

export default function ByCategoryChart({ chartData }) {
  const safe = Array.isArray(chartData) ? chartData : [];
  const data = safe.map((d, i) => ({
    category: d.category ?? d.name ?? `Cat ${i + 1}`,
    total: Number(d.total ?? d.amount ?? d.value) || 0,
  }));

  if (!data.length) {
    return (
      <div className="w-full h-72 grid place-items-center text-gray-400">
        No category data to display.
      </div>
    );
  }

  // Define colors in the order of your categories
  const colors = ["#7C3AED", "#22D3EE", "#EF4444", "#22C55E"];

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
          <XAxis
            dataKey="category"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#cbd5e1", fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#cbd5e1", fontSize: 12 }}
          />
          <Tooltip
            cursor={{ fill: "rgba(255,255,255,0.04)" }}
            contentStyle={{
              background: "#0f172a",
              border: "1px solid #1f2937",
              color: "#e5e7eb",
            }}
            labelStyle={{ color: "#e5e7eb" }}
          />
          <Bar dataKey="total" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]} // cycle through colors
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
