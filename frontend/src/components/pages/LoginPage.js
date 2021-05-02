import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link , Router} from 'react-router';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import FacebookLogin from 'react-facebook-login';

import { login } from '../../actions/auth';

class LoginPage extends Component {
	render() {
        const { login, doLogin } = this.props;

        const appId = "1874690812801985";
        console.log("props", this.props);

        const handleFacebook = (response) => {
            const fbToken = response.accessToken;
            if (fbToken) {
                login({token: fbToken}).then((result) => {
                    const data = result.data.loginFacebookUser;
                    if (!data.ok) {
                        throw new Error("Login unsuccessful");
                    } else {
                        const bbToken = data.user.token;
                        doLogin(bbToken);
                    }
                });
            }
        };

		return (
			<div>
                <p>This is a Facebook login.</p>
                <FacebookLogin
                    appId={appId}
                    autoLoad={true}
                    fields="email,public_profile,manage_pages,read_page_mailboxes,ads_management,ads_read"
                    callback={handleFacebook} />
            </div>
		);
	}
}

LoginPage.propTypes = {
};

const loginMutation = gql`
	mutation facebookLogin($token: String!) {
		loginFacebookUser(input: {
			fbToken: $token
		}) {
			ok
			user {
				id
				token
			}
		}
	}
`;

const LoginPageWithMutation = graphql(loginMutation, {
	props: ({ mutate }) => ({
		login: (variables) => mutate({ variables: variables }),
	}),
})(LoginPage);

export default connect(
    (state) => {
        return {}
    },
    (dispatch) => {
        return {
            doLogin: (token) => {
                dispatch(login(token))
            }
        };
    }
)(LoginPageWithMutation);