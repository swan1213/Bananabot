import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { clearMessages } from '../actions/messages';

var styles = require("../../styles/main.scss");

class App extends Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate() {
    const { dispatch } = this.props;
    dispatch(clearMessages());
  }

  render() {
    // Injected by React Router
    const { location, children } = this.props;
    const { pathname } = location;
    const value = pathname.substring(1);

    var contents = children;
    return (
      <div className="app">
        {contents}
      </div>
    );
  }
}

App.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired
  }),
  children: PropTypes.node
};

function mapStateToProps(state) {
  return {
  };
}

export default connect(
  mapStateToProps
)(App);
