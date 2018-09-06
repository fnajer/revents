import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Icon } from 'semantic-ui-react';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import Script from 'react-load-script';
import GoogleMapReact from 'google-map-react';

import { incrementCounter, decrementCounter } from './testActions';

const mapState = (state) => ({
  data: state.test.data,
});

const actions = {
  incrementCounter,
  decrementCounter
};

const Marker = () => <Icon name='marker' size='big' color='red' />

class TestComponent extends Component {
  static defaultProps = {
    center: {
      lat: 59.95,
      lng: 30.33
    },
    zoom: 11
  };

  state = {
    address: '',
    scriptLoaded: false,
  }

  onChange = address => { this.setState({address}) }

  handleFormSubmit = (event) => {
    event.preventDefault()

    geocodeByAddress(this.state.address)
      .then(results => getLatLng(results[0]))
      .then(latLng => console.log('Success', latLng))
      .catch(error => console.error('Error', error))
  }

  handleScriptLoad = () => {
    this.setState({
      scriptLoaded: true,
    });
  }

  render() {
    const inputProps = {
      value: this.state.address,
      onChange: this.onChange,
    }
    const { data, incrementCounter, decrementCounter } = this.props;
    return (
      <div>
        {/* <Script
          url="https://maps.googleapis.com/maps/api/js?key=AIzaSyBIUMtNKi--L8PYXBBpizvclGZdIpzZ6Qg&libraries=places"
          onLoad={this.handleScriptLoad}
        /> */}
        <h1>Test {data}</h1>
        <Button onClick={incrementCounter} color="green" content="Increment" />
        <Button onClick={decrementCounter} color="red" content="Decrement" />
        <br />
        <form onSubmit={this.handleFormSubmit}>
          {
            this.state.scriptLoaded &&
            <PlacesAutocomplete inputProps={inputProps} />
          }
          <button type="submit">Submit</button>
        </form>

        <div style={{ height: '300px', width: '100%' }}>
          <GoogleMapReact
            bootstrapURLKeys={{ key: 'AIzaSyBIUMtNKi--L8PYXBBpizvclGZdIpzZ6Qg' }}
            defaultCenter={this.props.center}
            defaultZoom={this.props.zoom}
          >
            <Marker
              lat={59.955413}
              lng={30.337844}
              text={'Kreyser Avrora'}
            />
          </GoogleMapReact>
        </div>
      </div>
    )
  }
}

export default connect(mapState, actions)(TestComponent)

