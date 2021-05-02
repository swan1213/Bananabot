const initial_state = {
	logged_in: false,
	token: {},
	user_id: null,
	after_login: null,
	password: null
};

export default function auth(state = initial_state, action) {
	switch (action.type) {
		case "STORE_PASSWORD":
			return {
				...state,
				password: action.payload.password
			};
		case "PROMPT_LOGIN":
			return {
				...state,
				after_login: action.payload.afterLogin
			};
		case "RECEIVE_CURRENT_USER":
			return _.extend({}, state, {
				user_id: action.data.id
			});
		case "SET_TOKEN":
			return _.extend({}, state, {
				logged_in: true,
				token: {
					access_token: action.payload.token
				}
			});
		case "LOGOUT":
			return _.extend({}, state, initial_state);
		default:
			return state;
	}
}
