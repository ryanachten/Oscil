import allVisualData from '../store/visuals';

export default ({currentVisual, visualSettings, requiresInit}) => {
  const visualInit = allVisualData[currentVisual].init;
  const visualDraw = allVisualData[currentVisual].draw;
  const frameRate = allVisualData[currentVisual].frameRate;
  return {visualSettings,
          visualInit, visualDraw,
          requiresInit, frameRate
        };
};

export const getVisualInfo = ({currentVisual}) => {
  const title = currentVisual;
  const type = allVisualData[currentVisual].type;
  const renderer = allVisualData[currentVisual].renderer;
  const description = allVisualData[currentVisual].description;
  return {
    title, type, renderer, description
  }
};
