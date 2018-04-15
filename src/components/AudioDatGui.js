import React from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import dat from 'dat.gui';
import { updateAnalyserSettings } from '../actions/audio';

class AudioDatGui extends React.Component{

  constructor(props){
    super(props);

    this.updateAudioSettings = this.updateAudioSettings.bind(this);
  }

  componentDidMount(){
    const audioGui = new dat.GUI({ autoPlace: false });
    audioGui.domElement.id = 'audiodat-gui';
    audioGui.close();
    $(this.container).append(audioGui.domElement);
    this.audioGui = audioGui;
    this.addSettings(this.props.analyserSettings);
  }

  addSettings(defaultSettings){
    const audioGuiSettings = defaultSettings;

    // this.audioGui.add(audioGuiSettings, 'fftsize', [256]).onChange(
    //   () => {
    //     this.updateAudioSettings(audioGuiSettings)
    //   });

    this.audioGui.add(audioGuiSettings, 'minDb').min(-150).max(-50).onChange(
      ()=> {
        this.updateAudioSettings(audioGuiSettings)
      });

    this.audioGui.add(audioGuiSettings, 'maxDb').min(-80).max(20).onChange(
      () => {
    	 this.updateAudioSettings(audioGuiSettings)
     });

    this.audioGui.add(audioGuiSettings, 'smoothing').min(0).max(100).onChange(
      () => {
        this.updateAudioSettings(audioGuiSettings)
      });
  }

  updateAudioSettings(newSettings){
    this.props.dispatch(
      updateAnalyserSettings({
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

const mapStateToProps = ({audio: {analyserSettings}}) => {
  return {analyserSettings};
}

export default connect(mapStateToProps)(AudioDatGui);
