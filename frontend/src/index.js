import 'babel-core/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';
import { Router, Route, Redirect, IndexRoute, IndexRedirect } from 'react-router';
import { ApolloProvider } from 'react-apollo';
import Cookies from 'cookies-js';

import history from './router/history';
import App from './components/App';
import store from './store/store';
import client from './store/client';

import {promptLogin} from './actions/auth';

import AdminContainer from './components/AdminContainer';
import AuthContainer from './components/AuthContainer';

import HomePage from './components/pages/HomePage';
import LoginPage from './components/pages/LoginPage';
import LogoutPage from './components/pages/LogoutPage';
import CampaignComposerPage from './components/pages/CampaignComposerPage';

const requireLogin = (nextState, replaceState, cb) => {
  const {auth: {logged_in}} = store.getState();

  if (logged_in || Cookies.get("BB_AUTH_TOKEN")) {
    cb();
  } else {
    store.dispatch(promptLogin(nextState.location.pathname));
  }
}

ReactDOM.render(
	<ApolloProvider client={client} store={store}>
		<Router history={history}>
			<Route path="/" component={App}>
				<Route component={AuthContainer}>
					<Route path="login" component={LoginPage} />
					<Route path="logout" component={LogoutPage} />
				</Route>
				<Route component={AdminContainer} onEnter={requireLogin}>
					<IndexRoute component={HomePage} />
					<Route path="compose" component={CampaignComposerPage} />
				</Route>
			</Route>
		</Router>
	</ApolloProvider>,
	document.getElementById('root')
);
