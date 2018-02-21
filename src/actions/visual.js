import allVisualData from '../store/visuals';

export const setVisual = ({ visual }) => ({
  type: 'SET_VISUAL',
  visual,
  settings: allVisualData[visual].settings,
});

export const updateVisualSettings = ({ settings }) => ({
  type: 'UPDATE_VISUAL_SETTINGS',
  settings
});
