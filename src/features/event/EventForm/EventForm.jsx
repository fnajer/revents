/* global google */

import React, { Component } from "react";
import { connect } from "react-redux";
import { reduxForm, Field } from "redux-form";
import { Segment, Form, Button, Grid, Header } from "semantic-ui-react";
import { createValidators, composeValidators, combineValidators, isRequired, hasLengthGreaterThan } from 'revalidate';
import moment from 'moment';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import Script from 'react-load-script';
import cuid from "cuid";

import { createEvent, updateEvent } from "../eventsActions";

import TextInput from "../../../app/common/form/TextInput";
import TextArea from "../../../app/common/form/TextArea";
import SelectInput from "../../../app/common/form/SelectInput";
import DateInput from "../../../app/common/form/DateInput";
import PlaceInput from "../../../app/common/form/PlaceInput";

const mapState = (state, ownProps) => {
  const eventId = ownProps.match.params.id;

  let event = {};

  if (eventId && state.events.length > 0) {
    event = state.events.filter(event => event.id === eventId)[0];
  }

  return {
    initialValues: event
  };
};

const actions = {
  createEvent,
  updateEvent
};

const validate = combineValidators({
  title: isRequired({ message: 'The title is required' }),
  category: isRequired({ message: 'Please provide a category' }),
  description: composeValidators(
    isRequired({ message: 'Please enter a description'}),
    hasLengthGreaterThan(4)({ message: 'Description needd to be at least 5 characters'} )
  )(),
  city: isRequired('City'),
  venue: isRequired('Venue'),
  date: isRequired('Date'),
});

const category = [
    {key: 'drinks', text: 'Drinks', value: 'drinks'},
    {key: 'culture', text: 'Culture', value: 'culture'},
    {key: 'film', text: 'Film', value: 'film'},
    {key: 'food', text: 'Food', value: 'food'},
    {key: 'music', text: 'Music', value: 'music'},
    {key: 'travel', text: 'Travel', value: 'travel'},
];

class EventForm extends Component {
  state = {
    cityLatLng: {},
    vanueLatLng: {},
    scriptLoaded: false,
  }

  handleLoadScript = () => {
    this.setState({
      scriptLoaded: true,
    });
  }

  handleSelectCity = selectedCity => {
    geocodeByAddress(selectedCity)
      .then(results => getLatLng(results[0]))
      .then(latLng => {
        this.setState({
          cityLatLng: latLng,
        });
      })
      .then(() => {
        this.props.change('city', selectedCity);
      });
  }

  onSubmitForm = values => {
    values.date = moment(values.date).format();

    if (this.props.initialValues.id) {
      this.props.updateEvent(values);
      this.props.history.goBack();
    } else {
      const newEvent = {
        ...values,
        id: cuid(),
        hostPhotoURL: "/assets/user.png",
        hostedBy: 'Bob',
      };

      this.props.createEvent(newEvent);
      this.props.history.push("/events");
   }
  };

  render() {
    const { invalid, submitting, pristine } = this.props;
    return (
      <Grid>
        <Script
          url="https://maps.googleapis.com/maps/api/js?key=AIzaSyBIUMtNKi--L8PYXBBpizvclGZdIpzZ6Qg&libraries=places"
          onLoad={this.handleLoadScript}
        />
        <Grid.Column width={10}>
          <Segment>
            <Form onSubmit={this.props.handleSubmit(this.onSubmitForm)}>
              <Header sub color="teal" content="Event Details" />
              <Field
                name="title"
                type="text"
                component={TextInput}
                placeholder="Give your event a name"
              />
              <Field
                name="category"
                component={SelectInput}
                options={category}
                placeholder="What is your event about"
              />
              <Field
                name="description"
                rows="3"
                component={TextArea}
                placeholder="Tell us about your event"
              />
              <Header sub color="teal" content="Event Location Details" />
              <Field
                name="city"
                component={PlaceInput}
                options={{ types: ['(cities)']}}
                placeholder="Event City"
                onSelect={this.handleSelectCity}
              />
              {
                this.state.scriptLoaded &&
                <Field
                  name="venue"
                  component={PlaceInput}
                  options={{ 
                    types: ['establishment'],
                    location: new google.maps.LatLng(this.state.cityLatLng),
                    radius: 1000,
                  }}
                  placeholder="Event Venue"
                />
              }
              <Field
                name="date"
                component={DateInput}
                placeholder="Date and Time start event"
                dateFormat="YYYY-MM-DD HH:mm"
                timeFormat="HH:mm"
                showTimeSelect
              />
              <Button disabled={invalid || submitting || pristine} positive type="submit">
                Submit
              </Button>
              <Button onClick={this.props.history.goBack} type="button">
                Cancel
              </Button>
            </Form>
          </Segment>
        </Grid.Column>
      </Grid>
    );
  }
}

export default connect(
  mapState,
  actions
)(
  reduxForm({
    form: "eventForm",
    enableReinitialize: true,
    validate,
  })(EventForm)
);
