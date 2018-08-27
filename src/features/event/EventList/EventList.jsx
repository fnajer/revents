import React, { Component, Fragment } from 'react'
import EventListItem from './EventListItem';

class EventList extends Component {
  render() {
    const { events, onOpenEvent } = this.props;
    return (
      <Fragment>
        <h1>Events list</h1>
        {
          events.map(event => (
            <EventListItem key={event.id} event={event} onOpenEvent={onOpenEvent} />
          ))
        }
      </Fragment>
    )
  }
}

export default EventList;
