import update from 'immutability-helper';

const initial_state = {
	messages: []
};

export default function messages(state = initial_state, action) {
	switch (action.type) {
		case "SHOW_MESSAGE":
			return update(state, {
                messages: {
                    $set: [action.payload]
                }
            });
		case "REMOVE_MESSAGE":
			return update(state, {
                messages: {
                    $set: _.filter(state.messages, (message) => {
						return message.id !== action.payload.id;
					})
                }
            });
		case "CLEAR_MESSAGES":
			return update(state, {
				messages: {
					$set: []
				}
			});
		default:
			return state;
	}
}
