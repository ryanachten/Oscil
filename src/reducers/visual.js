const visualReducerDefaultState = {
  // currentVisual: 'waveform',
  requiresInit: false
};

export default (state = visualReducerDefaultState, action) => {
  switch (action.type) {

    case 'SET_VISUAL':
        return {
          ...state,
          currentVisual: action.visual,
          visualType: action.visualType,
          renderer: action.renderer,
          visualSettings: action.settings,
          requiresInit: action.requiresInit
        };
      break;

    case 'UNSET_VISUAL':
      return {
        requiresInit: false
      }
      break;

    case 'UPDATE_VISUAL_SETTINGS':
        return {
          ...state,
          visualSettings: action.settings,
          requiresInit: action.requiresInit
        };
      break;

    case 'RESOLVE_INIT':
      return{
        ...state,
        requiresInit: false
      }
      break;

    default:
      return state;
  }
};
