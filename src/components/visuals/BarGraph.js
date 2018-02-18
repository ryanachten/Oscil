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
    const {canvWidth, canvHeight, canvasCtx} = setupCanvas();
    this.canvasCtx = canvasCtx;

    this.setState({
      canvWidth,
      canvHeight
    });

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

    this.analyser.getByteTimeDomainData(this.dataArray);
    canvasCtx.fillStyle = 'white';
    canvasCtx.fillRect(0,0, canvWidth, canvHeight);
    canvasCtx.lineWidth = 2;

    canvasCtx.beginPath();
    const sliceWidth = canvWidth * 1.0 / this.bufferLength;
		let x = 0;

		for(let i = 0; i < this.bufferLength; i++){
			const v = this.dataArray[i] / 128.0;
			canvasCtx.strokeStyle = 'hsl('+ this.dataArray[i]*5 +',80%,70%)';
			const y = v * canvHeight/2;

			if(i===0){
				canvasCtx.moveTo(x,y);
			}else{
				canvasCtx.lineTo(x,y);
			}
			x += sliceWidth;
		}

		canvasCtx.lineTo(canvWidth, canvWidth/2);
			canvasCtx.stroke();

  }

  componentWillUnmount(){
    cancelAnimationFrame(this.frameId);
    $('#visualiser').remove();
  }

  render(){
    return(
      <div>
        Waveform
      </div>
    );
  }
}

export default Waveform;
