import React from 'react';
import $ from 'jquery';
import setupCanvas from '../utilities/setupCanvas';
import {setupAudio, getAudioBuffer} from '../utilities/setupAudio';
import setupVisSettings from '../utilities/setupVisualSettings';

class VisualCanvas extends React.Component{

  constructor(props){
    super(props);

    this.draw = this.draw.bind(this);

    this.state = {
      canvWidth: undefined,
      canvHeight: undefined,
      visualDraw: props.visualDraw,
      visualSettings: undefined
    }
  }

  componentDidMount(){
    const {canvWidth, canvHeight, canvasCtx} = setupCanvas(this.canvas);
    this.canvasCtx = canvasCtx;

    this.setState(() => ({ canvWidth, canvHeight }));

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

      if (this.props.visualSettings) {
        this.state.visualSettings = setupVisSettings(this.props.visualSettings);
      }

      this.draw();
    }).catch( (reason) => {
        // Do something
        console.log(reason);
      }
    );
  }

  draw(){
    this.frameId = requestAnimationFrame(this.draw);

    this.analyser.getByteTimeDomainData(this.dataArray);
    this.state.visualDraw(this.canvasCtx,
                          this.state.canvWidth, this.state.canvHeight,
                          this.bufferLength, this.dataArray);
  }

  componentWillUnmount(){
    cancelAnimationFrame(this.frameId);
    $('#visdat-gui').remove();
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

export default VisualCanvas;
