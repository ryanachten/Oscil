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
    $(this.container).append(audioGui.domElement);
    this.audioGui = audioGui;
    this.addSettings();
  }

  addSettings(){
    const audioGuiSettings = {
    	fftsize : 256,
    	minDb : -100,
    	maxDb : 20,
    	smoothing : 80
    };

    this.audioGui.add(audioGuiSettings, 'fftsize', [256]).onChange(
      () => {
        this.updateAudioSettings(audioGuiSettings)
      }
    		// window.cancelAnimationFrame(drawVisual);
    		// visualise(visualisationMode.value);
    	);
    this.audioGui.add(audioGuiSettings, 'minDb').min(-150).max(-50).onChange(
      ()=> {
        this.updateAudioSettings(audioGuiSettings)
        }
    		// analyser.minDecibels = audioGuiSettings.minDb;
    	);
    this.audioGui.add(audioGuiSettings, 'maxDb').min(-80).max(20).onChange(
      () => {
    	 this.updateAudioSettings(audioGuiSettings)}
    		// analyser.maxDecibels = audioGuiSettings.maxDb;
    	);
    this.audioGui.add(audioGuiSettings, 'smoothing').min(0).max(100).onChange(
      () => {
        this.updateAudioSettings(audioGuiSettings)
      }
    		// analyser.smoothingTimeConstant = audioGuiSettings.smoothing/100;
    	);
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

export default connect()(AudioDatGui);
