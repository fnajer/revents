import React, { Component } from 'react'
import { connect } from 'react-redux'

const mapState = (state) => ({
  data: state.test.data,
});

class TestComponent extends Component {
  render() {
    return (
      <div>
        <h1>Test {this.props.data}</h1>
      </div>
    )
  }
}

export default connect(mapState)(TestComponent)

