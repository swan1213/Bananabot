import { combineReducers } from 'redux';

import form from './form';
import auth from './auth';
import messages from './messages';

import client from '../store/client';

const rootReducer = combineReducers({
	form: form,   
    apollo: client.reducer(),
    auth: auth,
    messages
});

export default rootReducer;
