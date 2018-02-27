import React from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import dat from 'dat.gui';
import { updateVisualSettings } from '../actions/visual';

class VisualDatGui extends React.Component{

  constructor(props){
    super(props);

    this.updateStateSettings = this.updateStateSettings.bind(this);
  }

  componentWillReceiveProps({settings}){
    if (settings !== this.props.settings) {
      console.log('VisualDatGui newprops');
      console.log('New settings', settings);
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
      const curSetting = this.visGui.add(refSettings, setting, settings[setting].options).onChange((active) => this.updateStateSettings({setting, active}));

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
    let newSettings = {};
    newSettings[setting] = active;
    this.props.dispatch(
      updateVisualSettings({
        settings: newSettings
      })
    );
  };

  render(){
    return(
      <div ref={(div) => {this.container = div}}></div>
    );
  }
}

const mapStateToProps = (state) => {
  return{
    settings: state.visual.visualSettings
  }
};

export default connect(mapStateToProps)(VisualDatGui);
