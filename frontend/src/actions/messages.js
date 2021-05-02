import uuid from 'uuid';
import { createAction } from 'redux-actions';

export const showMessage = createAction('SHOW_MESSAGE', (message, level = 'info') => ({
    id: uuid.v4(),
	message,
    level
}));

export const removeMessage = createAction('REMOVE_MESSAGE', (id) => ({
    id
}));

export const clearMessages = createAction('CLEAR_MESSAGES');

export const showError = (message) => {
    return showMessage(message);
};
