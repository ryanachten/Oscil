import { createStore, combineReducers } from 'redux';
import visualReducer from '../reducers/visual';
import audioReducer from '../reducers/audio';

// Store Creation
export default () => {
  const store = createStore(
    combineReducers({
      visual: visualReducer,
      audio: audioReducer,
    }),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );
  return store;
}
