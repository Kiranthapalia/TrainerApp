import _ from 'lodash';
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell  } from 'recharts';

const Colours = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const renderPieChart = (data) => (
    <PieChart width={600} height={600}>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        labelLine={false}
        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        outerRadius={150}
        fill="#8884d8"
        dataKey="totalDuration"
      >
        {
        data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={Colours[index % Colours.length]} name={entry.activity} />
        ))
      }
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );


const StatisticsPage = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('https://traineeapp.azurewebsites.net/gettrainings')
      .then((response) => response.json())
      .then((data) => {
        const groupedByActivity = _(data)
          .groupBy('activity')
          .map((items, activity) => ({
            activity: activity,
            totalDuration: _.sumBy(items, 'duration')
          }))
          .value();
        setData(groupedByActivity);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <div style ={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}> 
        <h2>Activity Durations - Bar Chart</h2>
        <BarChart
        width={600}
        height={300}
        data={data}
        margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
        }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="activity" />
            <YAxis label={{ value: 'Duration (min)', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="totalDuration" stackId="a" fill="#8884d8" />
        </BarChart>
        <h2>Activity Durations - Pie Chart</h2>
        {renderPieChart(data)}

    </div>
  );
};

export default StatisticsPage;
