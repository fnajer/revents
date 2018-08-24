import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>Re-events</h1>
        <button className="ui icon button">
          <i className="smile icon"></i>
          React button
        </button>
        <Button icon="smile" content="React button" />
      </div>
    );
  }
}

export default App;
