import $ from 'jquery';
import dat from 'dat.gui';

export default (settings) => {
  if (!settings) {
    return;
  }
  // const visGui = new dat.GUI({ autoPlace: false });
  // visGui.domElement.id = 'visdat-gui';
  // $('#ui-panel').append(visGui.domElement);

  // let visualSettings = {};
  // Object.keys(settings).map((setting) => {
  //   visualSettings[setting] = settings[setting].default;
  // });

  // Object.keys(settings).map((setting) => {
  //   visGui.add(visualSettings, setting, settings[setting].options);
  // });

  return settings;
}
