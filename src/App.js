import React from 'react';
import { ApolloProvider } from 'react-apollo';
import ApolloClient from 'apollo-boost';
import './App.css';
import Launches from './Launches';

const client = new ApolloClient({uri: 'http://localhost:4000/'})

function App() {
  return (
    <div className="App">
      <ApolloProvider client={client}> {
        <Launches/>
      }
      </ApolloProvider>

    </div>
  );
}

export default App;
