import React from 'react';
import Chart from 'apexcharts';
export default function LineChart() {
  const series = [
    {
      name: "Temperature in Fahrenheit", //will be displayed on the y-axis
      data: [43, 53, 50, 57]
    }
  ];
  const options = {
    chart: {
      id: "simple-bar"
    },
    xaxis: {
      categories: [1, 2, 3, 4] //will be displayed on the x-asis
    }
  };
  return (
    <div>
      <Chart options={options} type="bar" series={series} width="80%" />
    </div>
  );
}
