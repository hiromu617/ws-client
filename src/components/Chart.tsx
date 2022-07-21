import React, { VFC } from 'react';
import ApexChart from 'react-apexcharts';
import { voltageState } from '../recoil/atoms';
import { useRecoilValue } from 'recoil';

type Props = {
  index: number;
};

export const Chart: VFC<Props> = ({ index }) => {
  const voltages = useRecoilValue(voltageState);
  const data = voltages[index];

  return (
    <ApexChart
      title={{
        text: 'voltage1',
      }}
      series={[
        {
          name: 'Series 1',
          data: data,
        },
      ]}
      options={{
        chart: {
          height: '100%',
          type: 'line',
          zoom: {
            enabled: false,
          },
          animations: {
            enabled: false,
            easing: 'linear',
            // dynamicAnimation: {
            //   speed: 1000,
            // },
            animateGradually: {
              enabled: true,
              delay: 150,
            },
          },
          toolbar: {
            show: false,
          },
        },
        xaxis: {
          type: 'datetime',
          labels: {
            datetimeUTC: false, //表示をJSTにする
          },
          range: 10000,
        },
        yaxis: {
          min: 0,
          max: 3,
        },
      }}
      height={'100%'}
      type="line"
    />
  );
};
