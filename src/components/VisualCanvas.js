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

    this.drawVisual = this.drawVisual.bind(this);
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

  componentWillReceiveProps(nextProps){

    // // Sets store after first load for url requests
    if (nextProps.pathId === this.props.pathId) {
      return;
    }
    this.props.dispatch(setVisual({visual: nextProps.pathId}));
  }

  componentDidUpdate(){
    if (this._isMounted && this.props.visualInit) {
      console.log('cancel');
      cancelAnimationFrame(this.frameId);
      this.initVisual();
    }
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

      this.initVisual();
      this._isMounted = true;
    }).catch( (reason) => {
        // Do something
        console.log(reason);
      }
    );
  }

  componentWillUnmount(){
    cancelAnimationFrame(this.frameId);
    $('#visdat-gui').remove();
    window.removeEventListener("resize", this.resize);
    this._isMounted = false;
  }

  resize(){
    this.setState({
      canvWidth: $(window).width(),
      canvHeight: $(window).height()
    });
  }

  initVisual(){

    if (this.props.visualInit === undefined) {
      this.drawVisual();
    }
    else{
      this.ownSettings = this.props.visualInit({
        canvasCtx: this.canvasCtx,
        visualSettings: this.props.visualSettings,
        canvWidth: this.state.canvWidth,
        canvHeight: this.state.canvHeight,
      });
      console.log('ownSettings', this.ownSettings);
      this.drawVisual();
    }
  }

  drawVisual(){
    this.frameId = requestAnimationFrame(this.drawVisual);

    this.analyser.getByteTimeDomainData(this.dataArray);
    // console.log(this.dataArray[0]);
    this.ownSettings = this.props.visualDraw({
      canvasCtx: this.canvasCtx,
      visualSettings: this.props.visualSettings,
      canvWidth: this.state.canvWidth,
      canvHeight: this.state.canvHeight,
      bufferLength: this.bufferLength,
      dataArray: this.dataArray,
      ownSettings: this.ownSettings
    });
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
  const {visualInit, visualDraw, visualSettings} = selectVisual(visual);
  return {visualInit, visualDraw, visualSettings};
};

export default connect(mapStateToProps)(VisualCanvas);
