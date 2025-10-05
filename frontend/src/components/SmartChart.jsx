// frontend/src/components/SmartChart.jsx
import React from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// A helper function to determine the best chart type
const getChartType = (data) => {
  if (!Array.isArray(data) || data.length === 0) {
    return null;
  }

  const keys = Object.keys(data[0]);
  if (keys.length !== 2) {
    return null; // We'll only auto-chart simple two-column data for now
  }

  const [keyA, keyB] = keys;
  const firstRow = data[0];

  // Check if one column is a number and the other is a string (good for BarChart)
  const isStringAndNumber = (typeof firstRow[keyA] === 'string' && typeof firstRow[keyB] === 'number') ||
                           (typeof firstRow[keyA] === 'number' && typeof firstRow[keyB] === 'string');

  if (isStringAndNumber) {
    return 'BarChart';
  }

  // A simple check for time-series data (good for LineChart)
  // This looks for date-like strings (e.g., YYYY-MM-DD)
  const isTimeSeries = (typeof firstRow[keyA] === 'string' && firstRow[keyA].match(/^\d{4}-\d{2}-\d{2}/)) ||
                       (typeof firstRow[keyB] === 'string' && firstRow[keyB].match(/^\d{4}-\d{2}-\d{2}/));

  if (isTimeSeries && (typeof firstRow[keyA] === 'number' || typeof firstRow[keyB] === 'number')) {
    return 'LineChart';
  }

  return null; // Fallback for data structures we don't recognize
};


const SmartChart = ({ data }) => {
  const chartType = getChartType(data);

  if (!chartType) {
    return null; // Don't render anything if we can't determine a chart type
  }

  const keys = Object.keys(data[0]);
  const [keyA, keyB] = keys;
  
  // Assign axes based on data type
  const categoryKey = typeof data[0][keyA] === 'string' ? keyA : keyB;
  const valueKey = typeof data[0][keyA] === 'number' ? keyA : keyB;

  const renderChart = () => {
    switch (chartType) {
      case 'BarChart':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={categoryKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={valueKey} fill="#3498db" />
          </BarChart>
        );
      case 'LineChart':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={categoryKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey={valueKey} stroke="#3498db" activeDot={{ r: 8 }} />
          </LineChart>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};

export default SmartChart;