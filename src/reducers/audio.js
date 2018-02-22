const audioReducerDefaultState = { setupStatus: 'pending', bufferLength: 0, dataArray: [] };

export default (state = audioReducerDefaultState, action) => {
  switch (action.type) {

    case 'RESOLVE_AUDIO':
      return {
        ...state,
        setup: 'resolved',
        bufferLength: action.bufferLength,
        dataArray: action.dataArray
      };
    break;

    case 'REJECT_AUDIO':
      return {
        ...state,
        setup: 'rejected',
        errorMessage: action.error
      };
    break;

    case 'UPDATE_AUDIO':
      return {
        ...state,
        setup: 'rejected',
        errorMessage: action.error
      };
    break;

    default:
      return state;
  }
};
