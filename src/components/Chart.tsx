import React, { VFC } from 'react';
import ApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

type Props = {
  data: [number, number][];
};

export const Chart: VFC<Props> = ({ data }) => {
  return (
    <ApexChart
      series={[
        {
          name: 'Series 1',
          data: data,
        },
      ]}
      options={{
        chart: {
          height: 350,
          type: 'line',
          zoom: {
            enabled: false,
          },
          animations: {
            enabled: true,
            easing: 'linear',
            dynamicAnimation: {
              speed: 1000,
            },
          },
          toolbar: {
            show: false
          },
        },
        xaxis: {
          type: 'datetime',
          labels: {
            datetimeUTC: false, //表示をJSTにする
          },
          range: 10000
        },
      }}
      height={350}
      type="line"
    />
  );
};
