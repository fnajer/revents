import React, { Component, Fragment } from 'react'
import EventListItem from './EventListItem';

class EventList extends Component {
  render() {
    return (
      <Fragment>
        <h1>Events list</h1>
        <EventListItem />
        <EventListItem />
        <EventListItem />
      </Fragment>
    )
  }
}

export default EventList;
