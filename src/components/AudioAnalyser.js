import React from 'react';
import {connect} from 'react-redux';
import { resolveAudio, rejectAudio, updateAudioData } from '../actions/audio';

class AudioAnalyser extends React.Component{

  constructor(props){
    super(props);

    this.streamAudio = this.streamAudio.bind(this);
  }

  componentWillMount(){
    this.setupAudio.then( (analyser) => {

      analyser.fftSize = 256; //1024
      var bufferLength = analyser.frequencyBinCount;
    	var dataArray = new Uint8Array(bufferLength);

      this.analyser = analyser;
      this.bufferLength = bufferLength;
      this.dataArray = dataArray;
      this.streamAudio();

      // send action to switch boolean and resolve visual promise
      this.props.dispatch(
        resolveAudio({bufferLength, dataArray})
      );

    }).catch( (reason) => {
        // send action to switch boolean and reject visual promise
        this.props.dispatch(
          rejectAudio({error: reason})
        );
        console.log(reason);
      }
    );
  }

  setupAudio = new Promise((resolve, reject) => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioCtx.createAnalyser();

    navigator.getUserMedia (
      {
        audio: true
      },
      function(stream) {
        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);

        resolve(analyser);
      },
      function(err) {
        reject('The following gUM error occured: ' + err);
      }
    );
  });

  updateAudioSettings(){
    this.analyser.minDecibels = this.props.analyserSettings.minDb.toFixed(2);
    this.analyser.maxDecibels = this.props.analyserSettings.maxDb.toFixed(2);
    this.analyser.smoothingTimeConstant = (this.props.analyserSettings.smoothing/100).toFixed(2);
    const {minDecibels, maxDecibels, smoothingTimeConstant} = this.analyser;
  }

  streamAudio(){
    this.frameId = requestAnimationFrame(this.streamAudio);
    this.updateAudioSettings();
    // this.analyser.getByteTimeDomainData(this.dataArray);
    this.analyser.getByteFrequencyData(this.dataArray);
    // console.log(this.dataArray[0]);

    // send action to update dataArray and bufferLength
    // this.props.dispatch(
    //   updateAudioData({
    //     bufferLength: this.bufferLength,
    //     dataArray: this.dataArray
    //   })
    // );
  }

  render(){
    return(
      <div id="AudioAnalyser"></div>
    );
  }
}

const mapStateToProps = ({audio: {analyserSettings}}) => {
  return {analyserSettings};
}

export default connect(mapStateToProps)(AudioAnalyser);
