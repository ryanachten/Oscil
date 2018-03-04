import React from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import setupCanvas from '../utilities/setupCanvas';
import selectVisual from '../selectors/visual';
import {checkAudioPermissions} from '../utilities/setupAudio';

import { setVisual, resolveInit } from '../actions/visual';

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
    if (nextProps.pathId !== this.props.pathId) {
      this.props.dispatch(setVisual({visual: nextProps.pathId}));
    }
  }

  componentDidUpdate(prevProps){
    // Resets visual if dat gui sends requiresInit in action
    if (this.props.requiresInit && prevProps.requiresInit !== this.props.requiresInit) {
      cancelAnimationFrame(this.frameId);
      this.initVisual();
    }
  }

  componentDidMount(){
    const {canvWidth, canvHeight, canvasCtx} = setupCanvas(this.canvas);
    this.canvasCtx = canvasCtx;

    this.setState(() => ({ canvWidth, canvHeight }));

    window.addEventListener("resize", this.resize);

    // FIXME: This promise is technically a duplicate of what takes places in the AudioAnalyser component
    checkAudioPermissions.then( (analyser) => {

      this.initVisual();
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
      this.props.dispatch(resolveInit());
    }
  }

  drawVisual(){
    this.frameId = requestAnimationFrame(this.drawVisual);
    this.ownSettings = this.props.visualDraw({
      canvasCtx: this.canvasCtx,
      visualSettings: this.props.visualSettings,
      canvWidth: this.state.canvWidth,
      canvHeight: this.state.canvHeight,
      bufferLength: this.props.bufferLength,
      dataArray: this.props.dataArray,
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

const mapStateToProps = ({visual, audio}) => {
  const {dataArray, bufferLength} = audio;
  const {visualInit, visualDraw, visualSettings, requiresInit} = selectVisual(visual);
  return {
    visualInit, visualDraw, visualSettings,
    requiresInit,
    dataArray, bufferLength,
  };
};

export default connect(mapStateToProps)(VisualCanvas);
