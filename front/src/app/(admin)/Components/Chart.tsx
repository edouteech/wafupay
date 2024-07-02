// components/CustomLineChart.tsx
import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ChartData, ChartOptions } from 'chart.js';

type ChartProp = {
  types?: 'Journalière' | 'Hebdomadaire' | 'Mensuelle';
  infos : number[],
};

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const CustomLineChart: React.FC<ChartProp> = ({types = 'Journalière', infos =  []}) => {
  const colors = {'Journalière' : '#4318ff', 'Hebdomadaire' : '#fe6927', 'Mensuelle' : '#355c66'}
  const LABELS = {'Journalière' : [0, 4, 8, 12, 16, 20, 24], 'Hebdomadaire' : ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'], 'Mensuelle' : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']}
    const data: ChartData<'line'> = {
    labels: LABELS[types],
    datasets: [
      {
        label: 'Dataset 1',
        data:infos,
        fill: 'start',
        backgroundColor: colors[types],
        borderColor: colors[types],
        tension: 0.5,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.raw}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return `${value}`;
          },
        },
        grid : {
          color : 'rgba(200,200,200,0.2)',
        }
      },
      x : {
        grid : {
          color : 'rgba(0,0,0,0)'
        }
      }
    },
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-3xl font-bold">$682.5</h2>
          <p className="text-green-500">+2.45%</p>
        </div>
        <div className="bg-blue-100 text-blue-500 px-2 py-1 rounded-full">
          <span>📈</span>
        </div>
      </div>
      <Line data={data} options={options} />
    </div>
  );
};

export default CustomLineChart;
