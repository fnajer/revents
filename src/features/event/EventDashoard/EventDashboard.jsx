import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';

class EventDashboard extends Component {
  render() {
    return (
      <Grid>
        <Grid.Column width={10}>
          Left side
        </Grid.Column>
        <Grid.Column width={6}>
          Right side
        </Grid.Column>
      </Grid>
    )
  }
}

export default EventDashboard;