const visualReducerDefaultState = {
  currentVisual: 'waveForm'
};

export default (state = visualReducerDefaultState, action) => {
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
