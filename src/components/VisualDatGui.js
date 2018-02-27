import React from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import dat from 'dat.gui';
import { updateVisualSettings } from '../actions/visual';

class VisualDatGui extends React.Component{

  constructor(props){
    super(props);

    this.updateVisualSettings = this.updateVisualSettings.bind(this);
  }

  componentDidMount(){
    const visGui = new dat.GUI({ autoPlace: false });
    visGui.domElement.id = 'visdat-gui';
    $(this.container).append(visGui.domElement);
    this.visGui = visGui;
    this.addSettings(this.props.settings);
  }

  addSettings(settings){
    let visualSettings = {};
    console.log(visualSettings);
    Object.keys(settings).map((setting) => {
      visualSettings[setting] = settings[setting].active;
      this.visGui.add(visualSettings, setting, settings[setting].options).onChange((active) => this.updateVisualSettings({setting, active}));
    });
  }

  updateVisualSettings({setting, active}){
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
