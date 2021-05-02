import { createAction } from 'redux-actions';

export const login = createAction('LOGIN', (token) => ({
	token
}));

export const storePassword = createAction('STORE_PASSWORD', (password) => ({
	password
}));

export const logout = createAction('LOGOUT');

export const continueAfterAuth = createAction('CONTINUE_AFTER_AUTH');

export const setToken = createAction('SET_TOKEN', (token) => ({
	token
}));

export const remember = createAction("AUTH_REMEMBER", (token, memory) => ({
	token,
	memory
}));

export const checkMemory = createAction("AUTH_CHECK_MEMORY");

export const promptLogin = createAction("PROMPT_LOGIN", (afterLogin) => ({
	afterLogin
}));
