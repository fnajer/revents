import React, { Component } from "react";
import { connect } from "react-redux";
import { firestoreConnect, isEmpty, isLoaded } from 'react-redux-firebase'
import { Grid } from "semantic-ui-react";
import LoadingComponent from '../../../app/layout/LoadingComponent';
import EventActivity from '../EventActivity/EventActivity'

import EventList from "../EventList/EventList";
import { getEventsForDashboard } from '../eventsActions';

const mapState = state => ({
  events: state.events,
  loading: state.async.loading,
});

const actions = {
  getEventsForDashboard
};

class EventDashboard extends Component {

  componentDidMount() {
    this.props.getEventsForDashboard();
  }

  render() {
    const { events, loading } = this.props;
    if (loading) return <LoadingComponent inverted={true} />
    return (
      <Grid>
        <Grid.Column width={10}>
          <EventList
            events={events}
          />
        </Grid.Column>
        <Grid.Column width={6}>
          <EventActivity/>
        </Grid.Column>
      </Grid>
    );
  }
}

export default connect(mapState, actions)(
  firestoreConnect([{collection: 'events'}])(EventDashboard)
);
