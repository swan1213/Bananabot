import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link , Router} from 'react-router';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

import { storePassword, continueAfterAuth } from '../../actions/auth';
import ResetForm from '../forms/ResetPasswordForm';

class ChangePasswordPage extends Component {
	render() {
		const { dispatch, current_password, loading, changePassword } = this.props;

		console.log("props", this.props);

		if (loading || !current_password) {
			return null;
		}

		const doChange = (data) => {
			const payload = {
				currentPassword: current_password,
				password: data.password
			};

			return changePassword(payload).then((result) => {
				if (!result.data.updateUser.ok) {
					var problems = {
						password: 'Bad password'
					};
					throw problems;
				}

				console.log("password changed", data);

				dispatch(storePassword(data.password));
				dispatch(continueAfterAuth());
			}).catch((err) => {
				console.log("err", err);
			});
		};

		return (
			<ResetForm
				doChange={doChange} />
		);
	}
}

ChangePasswordPage.propTypes = {
};

const MeQuery = gql`query Me {
	me {
		id
		email
	}
}`;

const ChangePasswordPageWithQuery = graphql(MeQuery, {
    props: ({ ownProps, data }) => {
        return {
            loading: data.loading,
            me: data.loading ? {} : data.me
        };
    },
})(ChangePasswordPage);

const changeMutation = gql`
	mutation changePassword($password: String!, $currentPassword: String!) {
		updateUser(input: {
			password: $password
			currentPassword: $currentPassword
		}) {
			ok
			result {
				id
				email
			}
		}
	}
`;

const ChangePasswordPageWithMutation = graphql(changeMutation, {
	props: ({ mutate }) => ({
		changePassword: (variables) => mutate({ variables: variables }),
	}),
})(ChangePasswordPageWithQuery);

export default connect(
	(state) => {
		return {
			current_password: state.auth.password
		};
	}
)(ChangePasswordPageWithMutation);
