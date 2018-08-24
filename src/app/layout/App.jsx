import React, { Component, Fragment } from 'react';
import { Container } from 'semantic-ui-react';

import NavBar from '../../features/nav/NavBar/NavBar';
import EventDashboard from '../../features/event/EventDashoard/EventDashboard';

class App extends Component {
  render() {
    return (
      <Fragment>
        <NavBar />
        <Container className="main">
          <EventDashboard />
        </Container>
      </Fragment>
    );
  }
}

export default App;
