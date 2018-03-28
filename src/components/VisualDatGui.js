import React from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import dat from 'dat.gui';
import { updateVisualSettings } from '../actions/visual';

class VisualDatGui extends React.Component{

  constructor(props){
    super(props);

  }

  componentWillReceiveProps({currentVisual, settings}){
    if (currentVisual !== this.props.currentVisual) {
      this.removeSettings();
      this.addSettings(settings);
    }
  }

  componentDidMount(){
    const visGui = new dat.GUI({ autoPlace: false });
    visGui.domElement.id = 'visdat-gui';
    $(this.container).append(visGui.domElement);
    this.visGui = visGui;
    this.addSettings(this.props.settings);
  }

  addSettings(settings){
    let refSettings = {}; //used simply for dat gui adding api
    let visualSettings = []; //used to store controllers for removal

    Object.keys(settings).map((setting) => {
      refSettings[setting] = settings[setting].active;
      let curSetting = this.visGui.add(refSettings, setting, settings[setting].options);

      // Applies max and min sliders if applicable
      if (typeof settings[setting].min === "number") {
        curSetting = curSetting.min(settings[setting].min);
      }
      if (typeof settings[setting].max === "number") {
        curSetting = curSetting.max(settings[setting].max);
      }
      // On change listener
      curSetting.onChange(
        (active) => {
          this.updateStateSettings({setting, active});
        }
      );
      visualSettings.push(curSetting);
    });
    this.visualSettings = visualSettings;
  }

  removeSettings(){
    this.visualSettings.map((setting) => {
      this.visGui.remove(setting);
    });
  }

  updateStateSettings({setting, active}){
    let newSettings = this.props.settings;
    newSettings[setting].active = active;

    // If the setting being updated requires init to be called,
    // add to action
    let requiresInit = false;
    if (newSettings[setting].requiresInitOnChange) {
      requiresInit = true;
    }
    this.props.dispatch(
      updateVisualSettings({
        settings: newSettings,
        requiresInit
      })
    );
  };

  render(){
    return(
      <div
        id="VisualDatGui"
        ref={(div) => {this.container = div}}></div>
    );
  }
}

const mapStateToProps = ({visual}) => {
  return{
    currentVisual: visual.currentVisual,
    settings: visual.visualSettings
  }
};

export default connect(mapStateToProps)(VisualDatGui);
