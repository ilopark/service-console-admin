"use client";

import LineChart from "../../../_components/charts/LineChart";

type Props = {
  data: {
    date: string;
    value: number;
  }[];
};

export default function LineChartSection({ data }: Props) {
  const chartData = data.map((d) => ({
    label: d.date,
    value: d.value,
  }));

  return (
    <section>
      <LineChart
        title="Login Trend"
        subtitle="Last 7 days"
        data={chartData}
      />
    </section>
  );
}
