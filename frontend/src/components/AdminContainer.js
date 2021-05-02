import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import classNames from 'classnames';

class AdminContainer extends Component {
	render() {
		const { children, location: { pathname } } = this.props;

		var contents = children;
		return (
			<div className="admin">
				<div className="contents">
					{contents}
				</div>
			</div>
		);
	}
}

AdminContainer.propTypes = {
	children: PropTypes.node
};

export default AdminContainer;
