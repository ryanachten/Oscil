import allVisualData from '../store/visuals';

export const setVisual = ({ visual }) => {
  let requiresInit = false;
  if (allVisualData[visual].init) {
    requiresInit = true;
  }
  return{
    type: 'SET_VISUAL',
    visual,
    visualType: allVisualData[visual].type,
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

// Used by HomePage to reset visual store to avoid component conflicts
export const unsetVisual = () => ({
  type: 'UNSET_VISUAL'
});
