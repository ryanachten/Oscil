import React from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import setupCanvas from '../utilities/setupCanvas';
import selectVisual from '../selectors/visual';
import {setupAudio, getAudioBuffer} from '../utilities/setupAudio';

import { setVisual } from '../actions/visual';

class VisualCanvas extends React.Component{

  constructor(props){
    super(props);

    this.draw = this.draw.bind(this);
    this.resize = this.resize.bind(this);

    this.state = {
      canvWidth: undefined,
      canvHeight: undefined,
    }
  }

  componentWillMount(){
    // Sets store on first load if url request
    this.props.dispatch(setVisual({visual: this.props.pathId}));
  }

  componentWillReceiveProps({pathId}){
    // Sets store after first load for url requests
    this.props.dispatch(setVisual({visual: pathId}));

  }

  componentDidMount(){
    const {canvWidth, canvHeight, canvasCtx} = setupCanvas(this.canvas);
    this.canvasCtx = canvasCtx;

    this.setState(() => ({ canvWidth, canvHeight }));

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

  resize(){
    this.setState({
      canvWidth: $(window).width(),
      canvHeight: $(window).height()
    });
  }

  draw(){
    this.frameId = requestAnimationFrame(this.draw);

    this.analyser.getByteTimeDomainData(this.dataArray);
    this.props.visualDraw({
      canvasCtx: this.canvasCtx,
      visualSettings: this.props.visualSettings,
      canvWidth: this.state.canvWidth,
      canvHeight: this.state.canvHeight,
      bufferLength: this.bufferLength,
      dataArray: this.dataArray
    });
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

const mapStateToProps = ({visual}) => {
  const {visualDraw, visualSettings} = selectVisual(visual);
  return {visualDraw, visualSettings};
};

export default connect(mapStateToProps)(VisualCanvas);
