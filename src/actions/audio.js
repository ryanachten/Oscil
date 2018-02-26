export const resolveAudio = ({ bufferLength, dataArray }) => ({
  type: 'RESOLVE_AUDIO',
  bufferLength,
  dataArray
});

export const rejectAudio = ({error}) => ({
  type: 'REJECT_AUDIO',
  error
});

export const updateAudioData = ({ bufferLength, dataArray }) => ({
  type: 'UPDATE_AUDIO',
  bufferLength,
  dataArray
});

export const updateAnalyserSettings = ({settings}) => ({
  type: 'UPDATE_ANALYSER_SETTINGS',
  settings
});
