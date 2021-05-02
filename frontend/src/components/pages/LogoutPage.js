import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { logout } from '../../actions/auth';

class LogoutPage extends Component {
    componentDidMount() {
        const { dispatch } = this.props;

        dispatch(logout());
    }
	render() {
		return (
			<div className="page">
				<p>Logging out...</p>
			</div>
		);
	}
}

export default connect(
	(state) => {
		return {};
	}
)(LogoutPage);
