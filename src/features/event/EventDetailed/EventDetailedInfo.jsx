import React, { Component } from "react";
import { Segment, Grid, Icon, Button } from "semantic-ui-react";
import format from 'date-fns/format';

import EventDetailedMap from "./EventDetailedMap";

export class EventDetailedInfo extends Component {
  state = {
    showMap: false
  };

  toogleShowMap = () => {
    this.setState(prevProps => ({
      showMap: !prevProps.showMap
    }));
  };

  render() {
    const { event } = this.props;
    return (
      <Segment.Group>
        <Segment attached="top">
          <Grid>
            <Grid.Column width={1}>
              <Icon size="large" color="teal" name="info" />
            </Grid.Column>
            <Grid.Column width={15}>
              <p>{event.description}</p>
            </Grid.Column>
          </Grid>
        </Segment>
        <Segment attached>
          <Grid verticalAlign="middle">
            <Grid.Column width={1}>
              <Icon name="calendar" size="large" color="teal" />
            </Grid.Column>
            <Grid.Column width={15}>
              <span>{format(event.date, 'dddd do MMMM')} at {format(event.date, 'HH:mm')}</span>
            </Grid.Column>
          </Grid>
        </Segment>
        <Segment attached>
          <Grid verticalAlign="middle">
            <Grid.Column width={1}>
              <Icon name="marker" size="large" color="teal" />
            </Grid.Column>
            <Grid.Column width={11}>
              <span>{event.venue}</span>
            </Grid.Column>
            <Grid.Column width={4}>
              <Button
                onClick={this.toogleShowMap}
                color="teal"
                size="tiny"
                content={this.state.showMap ? "Hide Map" : "Show Map"}
              />
            </Grid.Column>
          </Grid>
        </Segment>
        {this.state.showMap && <EventDetailedMap lat={event.venueLatLng.lat} lng={event.venueLatLng.lng} />}
      </Segment.Group>
    );
  }
}

export default EventDetailedInfo;
