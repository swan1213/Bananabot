import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link , Router} from 'react-router';

import ResetForm from '../forms/ResetPasswordForm';

export default class ResetPasswordPage extends Component {
	render() {
        const { params: {id, key} } = this.props;

		return (
			<ResetForm id={id} token={key} />
		);
	}
}
