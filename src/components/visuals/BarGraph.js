import React from 'react';
import $ from 'jquery';
import setupCanvas from '../../utilities/setupCanvas';
import {setupAudio, getAudioBuffer} from '../../utilities/setupAudio';

class Waveform extends React.Component{

  constructor(props){
    super(props);

    this.draw = this.draw.bind(this);

    this.state = {
      canvWidth: undefined,
      canvHeight: undefined
    }
  }

  componentDidMount(){
    const {canvWidth, canvHeight, canvasCtx} = setupCanvas(this.canvas);
    this.canvasCtx = canvasCtx;

    this.setState({ canvWidth, canvHeight });

    this.resize = () => {
      this.setState({
        canvWidth: $(window).width(),
        canvHeight: $(window).height()
      });
    };
    window.addEventListener("resize", this.resize);

    setupAudio.then( (analyser) => {

      const {bufferLength, dataArray} = getAudioBuffer(analyser);

      this.analyser = analyser;
      this.bufferLength = bufferLength;
      this.dataArray = dataArray;
      this.draw();
    }).catch( (reason) => {
      // Do something
      console.log(reason);
    }
  );
}

draw(){
  this.frameId = requestAnimationFrame(this.draw);

  const canvasCtx = this.canvasCtx;
  const {canvWidth, canvHeight} = this.state;
  const bufferLength = this.bufferLength;
  const dataArray = this.dataArray;

  this.analyser.getByteTimeDomainData(this.dataArray);
  canvasCtx.fillStyle = 'white';
  canvasCtx.fillRect(0, 0, canvWidth, canvHeight);

  const barWidth = (canvWidth / bufferLength) * 2;
  let barHeight;
  let x = 0;

  for(let i = 0; i < bufferLength; i++) {
    barHeight = dataArray[i]*3;

    const y = canvHeight/2-barHeight/2;

    canvasCtx.fillStyle = 'hsl('+ barHeight +',50%,70%)';
    canvasCtx.fillRect(x,y,barWidth,barHeight);

    x += barWidth;
  }
}

componentWillUnmount(){
  cancelAnimationFrame(this.frameId);
  window.removeEventListener("resize", this.resize);
}

render(){
  return(
    <canvas
      width={this.state.canvWidth}
      height={this.state.canvHeight}
      ref={(canvas) => {this.canvas = canvas}}></canvas>
  );
}
}

export default Waveform;
