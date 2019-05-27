import React, { useState, Fragment } from 'react';
import { ApolloProvider } from 'react-apollo';
import ApolloClient from 'apollo-boost';
import './App.css';
import Launches from './Launches';
import Editor from './Editor';

const client = new ApolloClient({uri: 'http://localhost:4000/'})

const displayIf = (show) => ({ display: show? 'block' : 'none'});

function App() {
  const [editing, setEditing] = useState(false);

  return (
    <div className="App">
      <ApolloProvider client={client}> {
        <Fragment>
          <div style={displayIf(!editing)}>
          <Launches  setEditing={setEditing}/>
          </div>
          <div style={displayIf(editing)}>
          <Editor  setEditing={setEditing}/>
          </div>
        </Fragment>
      }
      </ApolloProvider>

    </div>
  );
}

export default App;
