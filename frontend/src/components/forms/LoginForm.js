import React, {Component, PropTypes} from 'react';
import {reduxForm} from 'redux-form';
import classNames from 'classnames';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { Link } from 'react-router';
import * as actions from '../../actions/auth';
import { showError, showMessage } from '../../actions/messages';
import MessageBox from '../partials/MessageBox';
import history from '../../router/history';

class LoginForm extends Component {
	static propTypes = {
		fields: PropTypes.object.isRequired,
		handleSubmit: PropTypes.func.isRequired,
		dispatch: PropTypes.func.isRequired
	}

	handleLogin(data) {
		const { dispatch, login } = this.props;

		return login({email: data.email, password: data.password}).then((result) => {
			if (!result.data.loginUser.ok) {
				var problems = {
					password: 'Incorrect password'
				};
				throw problems;
			}

			const user = result.data.loginUser.user;
			const hasLoggedIn = user.hasLoggedIn;
			const key = user.token;
			dispatch(actions.login(key, !hasLoggedIn));
			dispatch(actions.remember(key, 'month'));
			dispatch(actions.storePassword(data.password));
		}).catch((err) => {
			console.error(err);
			throw err;
		});
	}

	render() {
		const { fields: {email, password}, submitFailed, dispatch, reset } = this.props;
		const handleSubmit = this.props.handleSubmit(this.handleLogin.bind(this));
		const loading = this.props.asyncValidating || this.props.submitting;

		console.log("fields", this.props);

		const resetPassword = (event) => {
			event.stopPropagation();
			const emailValue = email.value;
			if (!emailValue || emailValue === '') {
				dispatch(showError("Please enter your email to trigger a password reset."));
				return;
			}
			reset({email: emailValue}).then((result) => {
				dispatch(showMessage("A password reset email has been sent."));
			});
		};

		return (
				<div className="container fullpage vcenter">    
					<div className="container">
						<MessageBox />
						<div className="row">
							<div className="col-lg-12">
								<form onSubmit={handleSubmit} className="form-styled">
									<div className={classNames("form-group", "email", {"has-error": email.error && email.touched})}>
										<input
											className="text-field col-lg-12 form-control"
											label="Email"
											id="email"
											type="text"
											placeholder="Email"
											{...email} />
										{ email.error && submitFailed && (
											<span className="help-block error">{ email.error }</span>
										) }
										{ !email.error && submitFailed && (
											<span className="help-block good">Good</span>
										) }
									</div>
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
									<input
										className="login-button btn btn-primary"
										type="submit"
										onClick={handleSubmit}
										value="Login" />
									<div className={'forgot-password'}>
										<a href="#" onClick={resetPassword}>Forgot Password?</a>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
		);
	}
}

const loginMutation = gql`
	mutation loginUser($email: String!, $password: String!) {
		loginUser(input: {
			email: $email
			password: $password
		}) {
			ok
			user {
				id
				email
				token
				hasLoggedIn
			}
		}
	}
`;

const LoginFormWithLogin = graphql(loginMutation, {
	props: ({ mutate }) => ({
		login: (variables) => mutate({ variables: variables }),
	}),
})(LoginForm);

const resetMutation = gql`
	mutation loginUser($email: String!) {
		resetPasswordRequest(input: {
			email: $email
		}) {
			ok
		}
	}
`;

const LoginFormWithMutations = graphql(resetMutation, {
	props: ({ mutate }) => ({
		reset: (variables) => mutate({ variables: variables }),
	}),
})(LoginFormWithLogin);

const LoginFormWithForm = reduxForm({
	form: 'login',
	fields: ['email', 'password'],
	destroyOnUnmount: true,
	validate: (values) => {
		const errors = {}
		if (!values.email || values.email === '') {
			errors.email = 'Please enter an email address.';
		}
		if (!values.password || values.password === '') {
			errors.password = 'Please enter a password.';
		}
		return errors;
	}
})(LoginFormWithMutations);

// export the wrapped component
export default LoginFormWithForm;
