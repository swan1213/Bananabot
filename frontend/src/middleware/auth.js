import Cookies from 'cookies-js';
import { some } from 'lodash';

import {login, setToken, logout, continueAfterAuth} from '../actions/auth';
import history from '../router/history';

import client from '../store/client';

const authMiddleware = store => next => action => {
	const state = store.getState();
	switch (action.type) {
		case "LOGIN":
			console.log("payload", action);
			store.dispatch(continueAfterAuth());
			store.dispatch(setToken(action.payload.token));
			return next(action);
		case "CONTINUE_AFTER_AUTH":
			setTimeout(() => {
				history.pushState({}, state.auth.after_login || "/");
			}, 1);
			return next(action);
		case "LOGOUT":
			history.replaceState({}, "/login");
			Cookies.expire("BB_AUTH_TOKEN");
			location.reload();
			return next(action);
		case "SET_TOKEN":
			Cookies.set("BB_AUTH_TOKEN", action.payload.token, {
				expires: (action.payload.memory === "month") ? 60 * 60 * 24 * 31 : undefined
			});
			return next(action);
		case "AUTH_CHECK_MEMORY":
			const cookie = Cookies.get("BB_AUTH_TOKEN");
			if (cookie) {
				store.dispatch(setToken(cookie));
			}
			return next(action);
		case "PROMPT_LOGIN":
			history.replaceState({}, "/login");
			return next(action);
		default:
			if (action.type === "APOLLO_QUERY_RESULT") {
				const { result: { errors } } = action;

                if (some(errors || [], (error) => error.message === "Signature has expired.")) {
                    store.dispatch(logout());
                }
			}

			return next(action);
	}
};

export default authMiddleware;
