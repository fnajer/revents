import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import EventDashboard from '../../features/event/EventDashoard/EventDashboard';

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>Re-events</h1>
        <EventDashboard />
      </div>
    );
  }
}

export default App;
