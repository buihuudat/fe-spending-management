import { combineReducers } from 'redux';

import userRedux from './userRedux';
import statictiscRedux from './statictiscRedux';
import modalRedux from './modalRedux';
import calendarRedux from './calendarRedux';
import adminRedux from './adminRedux';

export default combineReducers({
    user: userRedux,
    statistics: statictiscRedux,
    modal: modalRedux,
    calendar: calendarRedux,
    admin: adminRedux
})