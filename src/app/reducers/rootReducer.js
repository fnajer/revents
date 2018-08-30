import { combineReducers } from 'redux';
import testReducer from '../../features/testarea/testReducer';
import eventReducer from '../../features/event/eventReducer';

const rootReducer = combineReducers({
  test: testReducer,
  event: eventReducer,
});

export default rootReducer;