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


const CATEGORY_COLORS = {
  Groceries: "#ef4444",   
  Utilities: "#3b82f6",   
  Gas: "#f59e0b",   
  Rent: "#10b981",     
};

const PALETTE = ["#ef4444", "#3b82f6", "#f59e0b", "#10b981"]; 

export default function ByCategoryChart({ chartData }) {
  return (
    <div className="mt-6 bg-gray-900 rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-3">By Category</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="name" stroke="#cbd5e1" />
            <YAxis stroke="#cbd5e1" />
            <Tooltip
              wrapperStyle={{ outline: "none" }}
              contentStyle={{
                background: "#111827",
                border: "1px solid #374151",
                color: "#e5e7eb",
              }}
              itemStyle={{ color: "#e5e7eb" }}
              labelStyle={{ color: "#e5e7eb" }}
            />
            <Bar dataKey="value">
              {chartData.map((entry, index) => {
                const color =
                  CATEGORY_COLORS[entry.name] ??
                  PALETTE[index % PALETTE.length];
                return (
                  <Cell key={`cell-${entry.name}-${index}`} fill={color} />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
