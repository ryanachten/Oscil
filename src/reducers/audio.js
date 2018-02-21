const audioReducerDefaultState = {};

export default (state = audioReducerDefaultState, action) => {
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
