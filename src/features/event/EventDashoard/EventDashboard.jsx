import React, { Component } from "react";
import { connect } from "react-redux";
import { firestoreConnect, isEmpty, isLoaded } from 'react-redux-firebase'
import { Grid } from "semantic-ui-react";
import LoadingComponent from '../../../app/layout/LoadingComponent';
import EventActivity from '../EventActivity/EventActivity'

import EventList from "../EventList/EventList";
import { deleteEvent } from '../eventsActions';

const mapState = state => ({
  events: state.firestore.ordered.events,
});

const actions = {
  deleteEvent,
};

class EventDashboard extends Component {

  handleDeleteEvent = eventId => () => {
    this.props.deleteEvent(eventId);
  };

  render() {
    const { events } = this.props;
    const loading = !isLoaded(events) || isEmpty(events);
    if (loading) return <LoadingComponent inverted={true} />
    return (
      <Grid>
        <Grid.Column width={10}>
          <EventList
            deleteEvent={this.handleDeleteEvent}
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
