import React from "react";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import { mockLineData as data } from "../data/mockData";
import Chart from "react-apexcharts";

const LineChart = ({ isCustomLineColors = false, isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Convert your mock data to the format ApexCharts expects
  const series = data.map(d => ({
    name: d.id,
    data: d.data.map(point => point.y)
  }));

  const options = {
    chart: {
      id: 'basic-line',
      toolbar: {
        show: false,
      },
    },
    theme: {
      mode: theme.palette.mode,
      palette: 'palette1',
      monochrome: {
        enabled: false,
      },
    },
    xaxis: {
      categories: data[0].data.map(point => point.x),
      labels: {
        style: {
          colors: colors.grey[100],
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: colors.grey[100],
        },
      },
    },
    tooltip: {
      theme: theme.palette.mode,
    },
    stroke: {
      curve: 'smooth',
    },
  };

  return (
    <Chart
      options={options}
      series={series}
      type="line"
      height="100%"
    />
  );
};

export default LineChart;
