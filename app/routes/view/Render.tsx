import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js";

const LineChart = ({ countryData }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");
      new Chart(ctx, {
        type: "line",
        data: {
          labels: countryData.Year, // X-axis labels (years)
          datasets: [
            {
              label: "NYT Z-Score",
              data: countryData["NYT Z-Score"], // Y-axis data for NYT Z-Score
              borderColor: "blue",
              fill: false,
            },
            {
              label: "Guardian Z-Score",
              data: countryData["Guardian Z-Score"], // Y-axis data for Guardian Z-Score
              borderColor: "red",
              fill: false,
            },
            {
              label: "All Z-Score",
              data: countryData["All Z-Score"], // Y-axis data for All Z-Score
              borderColor: "green",
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              title: {
                display: true,
                text: "Year",
              },
            },
            y: {
              title: {
                display: true,
                text: "Z-Score",
              },
            },
          },
        },
      });
    }
  }, [countryData]);

  return (
    <div className="chart-container">
      <canvas ref={chartRef} />
    </div>
  );
};

export default LineChart;
