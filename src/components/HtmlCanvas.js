import React from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import setupCanvas from '../utilities/setupCanvas';
import selectVisual from '../selectors/visual';
import {checkAudioPermissions} from '../utilities/setupAudio';

import {resolveInit} from '../actions/visual';

class HtmlCanvas extends React.Component{

  constructor(props){
    super(props);

    this.drawVisual = this.drawVisual.bind(this);
    this.resize = this.resize.bind(this);

    this.state = {
      canvWidth: undefined,
      canvHeight: undefined,
    }
  }

  componentDidUpdate(prevProps){
    // Resets visual if dat gui sends requiresInit in action
    if (this.props.requiresInit && this.canvIsMounted
        // prevents executing visual during render transitions
        && this.props.renderer === 'html') {
      cancelAnimationFrame(this.frameId);
      this.initVisual();
    }
  }

  componentDidMount(){
    const {canvWidth, canvHeight, canvasCtx} = setupCanvas(this.canvas);
    this.canvasCtx = canvasCtx;
    console.log('componentDidMount', canvasCtx);

    this.setState(() => ({ canvWidth, canvHeight }));

    window.addEventListener("resize", this.resize);

    // FIXME: This promise is technically a duplicate of what takes places in the AudioAnalyser component
    checkAudioPermissions.then( (analyser) => {

      this.initVisual();
      this.canvIsMounted = true;
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
    this.canvIsMounted = false;
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
      this.props.dispatch(resolveInit());
      this.props.visualInit({
        canvasCtx: this.canvasCtx,
        visualSettings: this.props.visualSettings,
        canvWidth: this.state.canvWidth,
        canvHeight: this.state.canvHeight,
      }).then((ownSettings) => {

        this.ownSettings = ownSettings;

        this.drawVisual();

      });

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
  const renderer = visual.renderer;
  const {dataArray, bufferLength} = audio;
  const {visualInit, visualDraw, visualSettings, requiresInit} = selectVisual(visual);
  return {
    renderer,
    visualInit, visualDraw, visualSettings,
    requiresInit,
    dataArray, bufferLength,
  };
};

export default connect(mapStateToProps)(HtmlCanvas);
