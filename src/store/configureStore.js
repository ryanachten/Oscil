import { createStore, combineReducers } from 'redux';
import visualReducer from '../reducers/visual';
import audioReducer from '../reducers/audio';

// Store Creation
export default () => {
  const store = createStore(
    combineReducers({
      visual: visualReducer,
      audio: audioReducer,
    })
  );
  return store;
}
