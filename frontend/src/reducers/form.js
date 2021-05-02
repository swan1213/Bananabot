import {combineReducers} from 'redux';
import { actionTypes, reducer as formReducer } from 'redux-form';

var _ = require('lodash');
var moment = require('moment');

const normalizer = formReducer.normalize({
});

const mainReducer = formReducer.plugin({
});

export default function reducer(state, action) {
	return normalizer(mainReducer(state, action), action);
}
