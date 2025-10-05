// frontend/src/components/History.jsx
import React from 'react';
import './History.css';

const History = ({ historyItems, onHistoryClick, onClearHistory }) => {
  return (
    <div className="history-container">
      <div className="history-header">
        <h4>Query History</h4>
        <button onClick={onClearHistory} className="clear-button">Clear</button>
      </div>
      <ul className="history-list">
        {historyItems.length === 0 ? (
          <li className="history-empty">No history yet.</li>
        ) : (
          historyItems.map((item, index) => (
            <li 
              key={index} 
              className="history-item" 
              onClick={() => onHistoryClick(item)}
              title="Click to re-run query"
            >
              {item}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default History;