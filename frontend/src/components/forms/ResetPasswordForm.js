import React, {Component, PropTypes} from 'react';
import {reduxForm} from 'redux-form';
import classNames from 'classnames';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { Link } from 'react-router';
import { showMessage } from '../../actions/messages';
import history from '../../router/history';

class ResetForm extends Component {
	static propTypes = {
		fields: PropTypes.object.isRequired,
		handleSubmit: PropTypes.func.isRequired,
		dispatch: PropTypes.func.isRequired
	}

	handleSubmit(data) {
		if (this.props.doChange) {
			return this.props.doChange(data);
		}

		const { dispatch, reset, id, token } = this.props;

		const payload = {
			id,
			token,
			password: data.password
		};

        console.log('reset', data, payload, this.props);

		return reset(payload).then((result) => {
			if (!result.data.resetPassword.ok) {
				var problems = {
					password: 'Incorrect password'
				};
				throw problems;
			}

			dispatch(showMessage("You can now log in with your new password."));
			history.pushState({}, "/login");
		});
	}

	render() {
		const { fields: {password, password2}, submitFailed } = this.props;
		const handleSubmit = this.props.handleSubmit(this.handleSubmit.bind(this));
		const loading = this.props.asyncValidating || this.props.submitting;

		console.log("fields", this.props);

		return (
				<div className="container fullpage vcenter">    
					<div className="container">
						<div className="row">
                            <h2>Please set a new password</h2>
						</div>
						<div className="row">
							<div className="col-lg-12">
								<form onSubmit={handleSubmit} className="form-styled">
									<div className={classNames("form-group", "password", {"has-error": password.error && password.touched})}>
										<input
											className="text-field col-lg-12 form-control"
											label="Password"
											id="password"
											type="password"
											placeholder="Password"
											{...password} />
										{ password.error && submitFailed && (
											<span className="help-block error">{ password.error }</span>
										) }
										{ !password.error && submitFailed && (
											<span className="help-block good">Good</span>
										) }
									</div>
                                    <div className={classNames("form-group", "password2", {"has-error": password2.error && password2.touched})}>
										<input
											className="text-field col-lg-12 form-control"
											label="Confirm Password"
											id="password2"
											type="password"
											placeholder="Confirm Password"
											{...password2} />
										{ password2.error && submitFailed && (
											<span className="help-block error">{ password2.error }</span>
										) }
										{ !password2.error && submitFailed && (
											<span className="help-block good">Good</span>
										) }
									</div>
									<input
										className="login-button btn btn-primary"
										type="submit"
										onClick={handleSubmit}
										value="Reset" />
								</form>
							</div>
						</div>
					</div>
				</div>
		);
	}
}

const resetMutation = gql`
	mutation resetPassword($token: String!, $id: String!, $password: String!) {
		resetPassword(input: {
			token: $token
			id: $id
			password: $password
		}) {
			ok
			user {
				id
				email
				token
			}
		}
	}
`;

const ResetFormWithMutations = graphql(resetMutation, {
	props: ({ mutate }) => ({
		reset: (variables) => mutate({ variables: variables }),
	}),
})(ResetForm);

const ResetFormWithForm = reduxForm({
	form: 'reset',
	fields: ['password', 'password2'],
	destroyOnUnmount: false,
	validate: (values) => {
		const errors = {};
        if (!values.password || values.password === '') {
			errors.password = 'Please enter a password.';
		}
		if (!values.password2 || values.password2 === '') {
			errors.password2 = 'Please confirm the password.';
		}
        if (values.password !== values.password2) {
            errors.password2 = 'Passwords must match';
        }
		return errors;
	}
})(ResetFormWithMutations);

// export the wrapped component
export default ResetFormWithForm;
