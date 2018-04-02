import React from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';

import {setupHtmlCanvas} from '../utilities/setupCanvas';
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
      bgColour: this.props.bgColour
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
    const {canvWidth, canvHeight, canvasCtx} = setupHtmlCanvas(this.canvas);
    this.canvasCtx = canvasCtx;

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
    window.removeEventListener("resize", this.resize);
    $('#hiddenHtmlCanvas').remove();
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
        bgColour: this.state.bgColour
      }).then((ownSettings) => {

        this.ownSettings = ownSettings;

        // Use framerate if defined
        if (this.props.frameRate) {
          const fps = this.props.frameRate;
          this.fpsInterval = 1000/fps;
          this.then = Date.now();
        }
        this.drawVisual();

      });

    }
  }

  drawVisual(){
    this.frameId = requestAnimationFrame(this.drawVisual);

    // Use framerate if defined
    if (this.props.frameRate) {
      const now = Date.now();
      const elapsed = now - this.then;
      if (elapsed > this.fpsInterval) {
        this.then = now - (elapsed % this.fpsInterval);
      }
      else{
        return;
      }
    }

    this.ownSettings = this.props.visualDraw({
      canvasCtx: this.canvasCtx,
      visualSettings: this.props.visualSettings,
      canvWidth: this.state.canvWidth,
      canvHeight: this.state.canvHeight,
      bufferLength: this.props.bufferLength,
      dataArray: this.props.dataArray,
      ownSettings: this.ownSettings,
      bgColour: this.state.bgColour
    });
  }

  render(){
    return(
      <canvas
        id="HtmlCanvas"
        width={this.state.canvWidth}
        height={this.state.canvHeight}
        ref={(canvas) => {this.canvas = canvas}}></canvas>
    );
  }
}

const mapStateToProps = ({visual, audio}) => {
  const renderer = visual.renderer;
  const {dataArray, bufferLength} = audio;
  const {visualInit, visualDraw, visualSettings, requiresInit, frameRate} = selectVisual(visual);
  return {
    renderer,
    visualInit, visualDraw, visualSettings,
    requiresInit, frameRate,
    dataArray, bufferLength,
  };
};

export default connect(mapStateToProps)(HtmlCanvas);
