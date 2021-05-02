import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import * as _ from 'lodash';

import { removeMessage } from '../../actions/messages';

class MessageBox extends Component {
	getMessage() {
		const { messages } = this.props;

		if (messages.length < 1) {
            return null;
        }

		const message = _.last(messages);

		return message;
	}

	render() {
		const { dispatch } = this.props;
        const message = this.getMessage();

		if (!message) {
			return null;
		}

		const hide = () => {
			dispatch(removeMessage(message.id));
		};

		return (
			<div className="messages">
                <div className="alert alert-info">
					<button
						type="button"
						className="close"
						data-dismiss="alert"
						onClick={hide}
						aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
					{message.message}
				</div>
			</div>
		);
	}
}

MessageBox.propTypes = {
};

export default connect(
	(state) => {
		return {
            messages: state.messages.messages
        };
	}
)(MessageBox);
