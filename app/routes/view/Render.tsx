// LineChart.tsx
import React, { useEffect, useRef } from "react";
import { Chart, LineController, LineElement, CategoryScale } from "chart.js";

Chart.register(LineController, LineElement, CategoryScale);

export const LineChart = ({ keyProp, data }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) {
      // Destroy the previous chart instance if it exists
      chartInstance.current.destroy();
    }

    if (chartRef.current && data) {
      const ctx = chartRef.current.getContext("2d");

      // Replace this with your actual data fetching and processing logic
      const chartData = {
        labels: data.years
          ? Array.from(
              { length: data.years[1] - data.years[0] + 1 },
              (_, i) => data.years[0] + i,
            )
          : [],
        datasets: [
          {
            label: `Line Chart for ${data.country}`,
            data: data.years
              ? Array.from(
                  { length: data.years[1] - data.years[0] + 1 },
                  () => Math.random() * 100,
                )
              : [],
            borderColor: "rgb(75, 192, 192)",
            borderWidth: 2,
          },
        ],
      };

      chartInstance.current = new Chart(ctx, {
        type: "line",
        data: chartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    }
  }, [keyProp, data]);

  return <canvas ref={chartRef}></canvas>;
};

export default LineChart;
