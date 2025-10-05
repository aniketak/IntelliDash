// frontend/src/apolloClient.js
import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:8000/graphql', // The URL of our FastAPI GraphQL endpoint
  cache: new InMemoryCache(),
});

export default client;