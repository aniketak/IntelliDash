// frontend/src/components/KPICard.jsx
import React from 'react';
import './KPICard.css';

const KPICard = ({ title, value, isLoading }) => {
  
  const formatValue = (val) => {
    if (isLoading) return '...';
    if (typeof val === 'number') {
      // Format currency for titles like 'Revenue' or 'AOV'
      if (title.toLowerCase().includes('revenue') || title.toLowerCase().includes('aov')) {
        return `$${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      }
      // Format as a whole number for counts
      return val.toLocaleString();
    }
    return val;
  };

  return (
    <div className="kpi-card">
      <h3 className="kpi-title">{title}</h3>
      <p className={`kpi-value ${isLoading ? 'loading' : ''}`}>
        {formatValue(value)}
      </p>
    </div>
  );
};

export default KPICard;