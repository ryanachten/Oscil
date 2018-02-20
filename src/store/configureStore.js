import { createStore, combineReducers } from 'redux';


const visualReducerDefaultState = {
  currentVisual: 'waveForm',
  visualSettings: undefined,
};

const visualReducer = (state = visualReducerDefaultState, action) => {
  switch (action.type) {
    case 'SET_VISUAL':
        return {
          ...state,
          currentVisual: action.visual,
          visualSettings: action.settings
        };
      break;

    case 'UPDATE_VISUAL_SETTINGS':
        return {
          ...state,
          visualSettings: action.settings
        };
      break;

    default:
      return state;
  }
};

const audioReducerDefaultState = {};

const audioReducer = (state = audioReducerDefaultState, action) => {
  switch (action.type) {

    case 'SETUP_AUDIO':
      return {
        ...state,
        bufferLength: action.bufferLength,
        dataArray: action.dataArray
      };
    break;

    default:
      return state;
  }
};


// Store Creation
const store = createStore(
  combineReducers({
    visual: visualReducer,
    audio: audioReducer,
  })
);


store.subscribe( () => {
  console.log(store.getState());
});


// Action generators
const setVisual = ({ visual, settings = {} }) => ({
  type: 'SET_VISUAL',
  visual,
  settings
});

const updateVisualSettings = ({ settings }) => ({
  type: 'UPDATE_VISUAL_SETTINGS',
  settings
});

const setupAudio = ({ bufferLength, dataArray }) => ({
  type: 'SETUP_AUDIO',
  bufferLength,
  dataArray
});

// Test dispatches
store.dispatch(
  setVisual({
    visual:'one',
    settings: {
      gradMode: 'one'
    }
  })
);

store.dispatch(
  updateVisualSettings({
    settings: {
      gradMode: 'two'
    }
  })
);

store.dispatch(
  setVisual({
    visual:'three',
    settings: {
      gradMode: 'three'
    }
  })
);

store.dispatch(
  setupAudio({
    bufferLength: 128,
    dataArray: [128]
  })
);
