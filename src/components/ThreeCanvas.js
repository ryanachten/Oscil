import React from 'react';
import { connect } from 'react-redux';
import stats from 'stats.js';
import * as THREE from 'three';

import {setupThreeCanvas} from '../utilities/setupCanvas';
import selectVisual from '../selectors/visual';
import {checkAudioPermissions} from '../utilities/setupAudio';
import {resolveInit} from '../actions/visual';


class ThreeCanvas extends React.Component{

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
        && this.props.renderer === 'three') {
      cancelAnimationFrame(this.frameId);
      this.initVisual();
    }
  }

  componentDidMount(){

    const {stats, renderer, canvWidth, canvHeight} = setupThreeCanvas();
    this.setState(() => ({ canvWidth, canvHeight }));
    this.stats = stats;
    renderer.domElement.id = 'three-canvas';
    this.canvas.appendChild(renderer.domElement);
    this.renderer = renderer;

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
    this.canvIsMounted = false;
  }

  resize(){
    this.setState({
      canvWidth: $(window).width(),
      canvHeight: $(window).height()
    });
  }

  initVisual(){
    this.props.dispatch(resolveInit());
    this.props.visualInit({
      visualSettings: this.props.visualSettings,
      canvWidth: this.state.canvWidth,
      canvHeight: this.state.canvHeight
    }).then((ownSettings) => {

      console.log('init');
      this.ownSettings = ownSettings;

      this.drawVisual();

    });
  }

  drawVisual(){
    this.frameId = requestAnimationFrame(this.drawVisual);
    this.ownSettings = this.props.visualDraw({
      visualSettings: this.props.visualSettings,
      canvWidth: this.state.canvWidth,
      canvHeight: this.state.canvHeight,
      bufferLength: this.props.bufferLength,
      dataArray: this.props.dataArray,
      stats: this.stats,
      renderer: this.renderer,
      ownSettings: this.ownSettings,
    });
  }

  render(){
    return(
      <div
        id="ThreeCanvas"
        width={this.state.canvWidth}
        height={this.state.canvHeight}
        ref={(canvas) => {this.canvas = canvas}}>
      </div>
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

export default connect(mapStateToProps)(ThreeCanvas);
