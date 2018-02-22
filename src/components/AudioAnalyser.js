import React from 'react';
import {connect} from 'react-redux';
import { resolveAudio, rejectAudio, updateAudioData } from '../actions/audio';

class AudioAnalyser extends React.Component{

  constructor(props){
    super(props);

    this.streamAudio = this.streamAudio.bind(this);
  }

  componentWillMount(){
    console.log(this.props);
    setupAudio.then( (analyser) => {

      var bufferLength = analyser.frequencyBinCount;
    	var dataArray = new Uint8Array(bufferLength);

      // send action to switch boolean and resolve visual promise
      this.props.dispatch(
        resolveAudio({bufferLength, dataArray})
      );

      this.analyser = analyser;
      this.bufferLength = bufferLength;
      this.dataArray = dataArray;
      this.streamAudio();

    }).catch( (reason) => {
        // send action to switch boolean and reject visual promise
        this.props.dispatch(
          rejectAudio({error: reason})
        );
        console.log(reason);
      }
    );
  }

  streamAudio(){
    this.frameId = requestAnimationFrame(this.streamAudio);
    this.analyser.getByteTimeDomainData(this.dataArray);
    // console.log(this.dataArray);
    // send action to update dataArray and bufferLength
    this.props.dispatch(
      updateAudioData({
        bufferLength: this.bufferLength,
        dataArray: this.dataArray
      })
    );
  }

  render(){
    return(
      <div></div>
    );
  }
}

export default connect()(AudioAnalyser);


const setupAudio = new Promise((resolve, reject) => {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const analyser = audioCtx.createAnalyser();

  navigator.getUserMedia (
    {
      audio: true
    },
    function(stream) {
      const source = audioCtx.createMediaStreamSource(stream);
      analyser.fftSize = 256; //1024
      source.connect(analyser);
      // setupAudioDatGui(analyser);

      resolve(analyser);
    },
    function(err) {
      reject('The following gUM error occured: ' + err);
    }
  );
});
