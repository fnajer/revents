import React, { Component } from 'react'
import { Form, Label } from 'semantic-ui-react'
import Script from 'react-load-script'
import PlaceAutocomplete from 'react-places-autocomplete'

const styles = {
  autocompleteContainer: {
    zIndex: 1000,
  },
};

export class PlaceInput extends Component {
  state = {
    scriptLoaded: false,
  }

  handleLoadScript = () => {
    this.setState({
      scriptLoaded: true,
    });
  }

  render() {
    const { input, width, onSelect, placeholder, options, meta: { touched, error } } = this.props;
    return (
      <Form.Field error={touched && !!error} width={width}>
        <Script
          url="https://maps.googleapis.com/maps/api/js?key=AIzaSyBIUMtNKi--L8PYXBBpizvclGZdIpzZ6Qg&libraries=places"
          onLoad={this.handleLoadScript}
        />
        {
          this.state.scriptLoaded &&
          <PlaceAutocomplete
            inputProps={{...input, placeholder}}
            options={options}
            onSelect={onSelect}
            styles={styles}
          />
        }
        {
          touched && error &&
          <Label basic color="red">{error}</Label>
        }
      </Form.Field>
    )
  }
}

export default PlaceInput
