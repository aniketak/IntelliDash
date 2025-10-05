// frontend/src/components/AIFeature.jsx
import React, { useState, useEffect } from 'react';
import { useLazyQuery, gql } from '@apollo/client';
import SmartChart from './SmartChart';
import History from './History';
import './AIFeature.css'; // We'll create this CSS file

// GraphQL Query (same as before)
const NATURAL_LANGUAGE_QUERY = gql`
  query QueryNaturalLanguage($prompt: String!) {
    queryNaturalLanguage(prompt: $prompt)
  }
`;

// ResultDisplay Component (moved inside here for encapsulation)
function ResultDisplay({ data }) {
    if (data?.error) return <div className="error-message">Error from AI Agent: {data.error}</div>;
    const result = data?.result;
    if (result === undefined || result === null) return <p className="placeholder-text">Ask a question to see the results.</p>;
    if (typeof result !== 'object') return <div className="result-scalar">{result}</div>;
    if (Array.isArray(result) && result.length > 0 && Object.keys(result[0]).length > 0) {
      const headers = Object.keys(result[0]);
      return (
        <table className="result-table">
          <thead><tr>{headers.map(h => <th key={h}>{h}</th>)}</tr></thead>
          <tbody>{result.map((row, i) => <tr key={i}>{headers.map(h => <td key={h}>{String(row[h])}</td>)}</tr>)}</tbody>
        </table>
      );
    }
    if (Array.isArray(result) && result.length === 0) return <p className="placeholder-text">The query returned no results.</p>;
    return <p className="placeholder-text">No data returned, or format is not recognized.</p>;
}

const AIFeature = () => {
    const [prompt, setPrompt] = useState('');
    const [viewMode, setViewMode] = useState('table');
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const storedHistory = localStorage.getItem('intellidash_history_ai');
        if (storedHistory) setHistory(JSON.parse(storedHistory));
    }, []);

    const [executeQuery, { loading, error, data }] = useLazyQuery(NATURAL_LANGUAGE_QUERY, {
        onCompleted: (queryData) => {
            setViewMode('table');
            if (prompt && queryData?.queryNaturalLanguage?.result && !history.includes(prompt)) {
                const newHistory = [prompt, ...history].slice(0, 20);
                setHistory(newHistory);
                localStorage.setItem('intellidash_history_ai', JSON.stringify(newHistory));
            }
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (prompt.trim()) executeQuery({ variables: { prompt } });
    };

    const handleHistoryClick = (historyPrompt) => {
        setPrompt(historyPrompt);
        executeQuery({ variables: { prompt: historyPrompt } });
    };

    const handleClearHistory = () => {
        setHistory([]);
        localStorage.removeItem('intellidash_history_ai');
    };

    const isChartAvailable = data?.queryNaturalLanguage?.result && Array.isArray(data.queryNaturalLanguage.result) && data.queryNaturalLanguage.result.length > 0;

    return (
         <div className="page-container">
        <div className="ai-feature-layout">
            <div className="ai-main-panel">
                <div className="query-box">
                    <h2>AI Deep Dive</h2>
                    <p>Use conversational language to explore your data. Ask complex questions, and the AI will find the answer.</p>
                    <form onSubmit={handleSubmit} className="query-form">
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="e.g., 'What is the monthly sales trend for the last 6 months?'"
                            rows="4"
                        />
                        <button type="submit" disabled={loading}>{loading ? 'Thinking...' : 'Ask Question'}</button>
                    </form>
                </div>

                <div className="results-panel">
                    {isChartAvailable && (
                        <div className="view-toggle">
                            <button onClick={() => setViewMode('table')} className={viewMode === 'table' ? 'active' : ''}>Table</button>
                            <button onClick={() => setViewMode('chart')} className={viewMode === 'chart' ? 'active' : ''}>Chart</button>
                        </div>
                    )}
                    {loading && <p className="placeholder-text">Loading...</p>}
                    {error && <div className="error-message">GraphQL Error: {error.message}</div>}
                    {!loading && data && viewMode === 'table' && <ResultDisplay data={data.queryNaturalLanguage} />}
                    {!loading && data && viewMode === 'chart' && <SmartChart data={data.queryNaturalLanguage.result} />}
                </div>
            </div>
            <aside className="ai-sidebar">
                <History historyItems={history} onHistoryClick={handleHistoryClick} onClearHistory={handleClearHistory} />
            </aside>
        </div>
        </div>
    );
};

export default AIFeature;