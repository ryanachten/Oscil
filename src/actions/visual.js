import allVisualData from '../store/visuals';

export const setVisual = ({ visual }) => {
  let requiresInit = false;
  console.log(visual);
  if (allVisualData[visual].init) {
    requiresInit = true;
  }
  return{
    type: 'SET_VISUAL',
    visual,
    renderer: allVisualData[visual].renderer,
    settings: allVisualData[visual].settings,
    requiresInit
  }
};

export const updateVisualSettings = ({ settings, requiresInit }) => ({
  type: 'UPDATE_VISUAL_SETTINGS',
  settings,
  requiresInit
});

export const resolveInit = () => ({
  type: 'RESOLVE_INIT'
});
