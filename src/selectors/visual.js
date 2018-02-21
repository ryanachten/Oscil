import allVisualData from '../store/visuals';

export default ({currentVisual, visualSettings}) => {
  const visualDraw = allVisualData[currentVisual].visual;
  return {visualSettings, visualDraw};
};
