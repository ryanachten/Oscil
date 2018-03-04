import allVisualData from '../store/visuals';

export default ({currentVisual, visualSettings, requiresInit}) => {
  const visualInit = allVisualData[currentVisual].init;
  const visualDraw = allVisualData[currentVisual].draw;
  return {visualSettings,
          visualInit, visualDraw,
          requiresInit
        };
};
