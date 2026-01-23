"use client";

import ReactECharts from "echarts-for-react";

export type LineChartPoint = {
  label: string;
  value: number;
};

type Props = {
  title: string;
  subtitle?: string;
  data: LineChartPoint[];
};

export default function LineChart({ title, subtitle, data }: Props) {
  const option = {
    tooltip: { trigger: "axis" },
    grid: { left: 10, right: 10, top: 40, bottom: 10, containLabel: true },
    xAxis: {
      type: "category",
      data: data.map((d) => d.label),
      axisLabel: { color: "#a1a1aa" },
      axisLine: { lineStyle: { color: "#27272a" } },
    },
    yAxis: {
      type: "value",
      axisLabel: { color: "#a1a1aa" },
      splitLine: { lineStyle: { color: "#27272a" } },
    },
    series: [
      {
        type: "line",
        data: data.map((d) => d.value),
        smooth: true,
        showSymbol: false,
        lineStyle: { width: 2 },
        areaStyle: { opacity: 0.08 },
      },
    ],
  };

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
      <div className="mb-2">
        <div className="text-sm font-medium">{title}</div>
        {subtitle && (
          <div className="text-xs text-zinc-500">{subtitle}</div>
        )}
      </div>

      <ReactECharts option={option} style={{ height: 260, width: "100%" }} />
    </div>
  );
}
