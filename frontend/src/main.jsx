// frontend/src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import { ApolloProvider } from '@apollo/client';
import client from './apolloClient.js'; // Import our client

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ApolloProvider client={client}> {/* Wrap the App component */}
      <App />
    </ApolloProvider>
  </React.StrictMode>,
)