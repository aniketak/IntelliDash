// frontend/src/components/Dashboard.jsx
import React from 'react';
import { useQuery, gql } from '@apollo/client';
import KPICard from './KPICard';
// This is the corrected import line
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell 
} from 'recharts';
import './Dashboard.css';

const DASHBOARD_DATA_QUERY = gql`
  query GetDashboardData {
    totalRevenue
    totalOrders
    totalCustomers
    averageOrderValue
    salesPerCategory {
      category
      totalSales
    }
    monthlyRevenueTrend {
      month
      revenue
    }
  }
`;

// Define a color palette for the chart
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F'];

const Dashboard = () => {
  const { loading, error, data } = useQuery(DASHBOARD_DATA_QUERY);

  // A more robust way to handle the chart data
  const salesData = data?.salesPerCategory || [];
  const trendData = data?.monthlyRevenueTrend || [];

  if (error) return <div className="dashboard-error">Error loading dashboard: {error.message}</div>;

  return (
    <div className="page-container">
      <div className="dashboard-page">
        <div className="dashboard-header">
          <h2>Executive Dashboard</h2>
          <p>A high-level overview of your e-commerce performance.</p>
        </div>
        
        <div className="kpi-grid">
          <KPICard title="Total Revenue" value={data?.totalRevenue} isLoading={loading} />
          <KPICard title="Total Orders" value={data?.totalOrders} isLoading={loading} />
          <KPICard title="Total Customers" value={data?.totalCustomers} isLoading={loading} />
          <KPICard title="Average Order Value" value={data?.averageOrderValue} isLoading={loading} />
        </div>

        <div className="charts-grid">
          <div className="chart-container">
            <div className="chart-header">
              <h3>Sales by Category</h3>
              <p>Total revenue generated per product category.</p>
            </div>
            <div className="chart-content">
              {loading ? <p className="loading-text">Loading Chart...</p> : (
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={salesData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="category" tick={{ fontSize: 12 }} angle={-10} textAnchor="end" />
                    <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                    <Tooltip cursor={{ fill: 'rgba(240, 242, 245, 0.5)' }} formatter={(value) => `$${value.toLocaleString()}`} />
                    <Bar dataKey="totalSales" radius={[4, 4, 0, 0]}>
                      {salesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
          
          <div className="chart-container">
            <div className="chart-header">
              <h3>Monthly Revenue Trend</h3>
              <p>Revenue from completed orders over time.</p>
            </div>
            <div className="chart-content">
              {loading ? <p className="loading-text">Loading Chart...</p> : (
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={trendData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#82ca9d" strokeWidth={2} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;