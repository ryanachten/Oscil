import allVisualData from '../store/visuals';

export default ({currentVisual, visualSettings}) => {
  const visualInit = allVisualData[currentVisual].init;
  const visualDraw = allVisualData[currentVisual].draw;
  return {visualSettings, visualInit, visualDraw};
};
