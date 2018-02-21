import allVisualData from '../store/visuals';
import setupVisualSettings from '../utilities/setupVisualSettings';

export const setVisual = ({ visual }) => ({
  type: 'SET_VISUAL',
  visual,
  settings: setupVisualSettings(allVisualData[visual].settings),
});

export const updateVisualSettings = ({ settings }) => ({
  type: 'UPDATE_VISUAL_SETTINGS',
  settings
});
