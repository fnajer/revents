import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button } from 'semantic-ui-react';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import Script from 'react-load-script';

import { incrementCounter, decrementCounter } from './testActions';
import { openModal } from '../modal/modalActions'

const mapState = (state) => ({
  data: state.test.data,
});

const actions = {
  incrementCounter,
  decrementCounter,
  openModal,
};

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
    const { data, incrementCounter, decrementCounter, openModal } = this.props;
    return (
      <div>
        {/* <Script
          url="https://maps.googleapis.com/maps/api/js?key=AIzaSyBIUMtNKi--L8PYXBBpizvclGZdIpzZ6Qg&libraries=places"
          onLoad={this.handleScriptLoad}
        /> */}
        <h1>Test {data}</h1>
        <Button onClick={incrementCounter} color="green" content="Increment" />
        <Button onClick={decrementCounter} color="red" content="Decrement" />
        <Button onClick={() => openModal('TestModal', {data: 33})} color="blue" content="TestModal" />
        <br />
        <form onSubmit={this.handleFormSubmit}>
          {
            this.state.scriptLoaded &&
            <PlacesAutocomplete inputProps={inputProps} />
          }
          <button type="submit">Submit</button>
        </form>
      </div>
    )
  }
}

export default connect(mapState, actions)(TestComponent)

