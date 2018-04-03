import React from 'react';
import { connect } from 'react-redux';
import stats from 'stats.js';
import * as THREE from 'three';
import $ from 'jquery';

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
      bgColour: this.props.bgColour
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
      window.addEventListener("resize", this.resize);
      this.canvIsMounted = true;
    }).catch( (reason) => {
        // Do something
        console.log(reason);
      }
    );
  }

  componentWillUnmount(){
    cancelAnimationFrame(this.frameId);
    const statsCanvas = document.getElementById('stats-graph');
    statsCanvas.remove();

    const controls = this.ownSettings.controls;
    if (controls) {
        controls.dispose();
    }

    window.removeEventListener("resize", this.resize);
    this.canvIsMounted = false;
  }

  resize(){
    this.setState({
      canvWidth: $(window).width(),
      canvHeight: $(window).height()
    });
    const camera = this.ownSettings.camera;
    camera.aspect =  this.state.canvWidth / this.state.canvHeight;
    camera.updateProjectionMatrix();
    this.renderer.setSize(this.state.canvWidth, this.state.canvHeight);
  }

  initVisual(){
    this.props.dispatch(resolveInit());
    this.props.visualInit({
      visualSettings: this.props.visualSettings,
      canvWidth: this.state.canvWidth,
      canvHeight: this.state.canvHeight,
      // Converts from hex string to hex int
      bgColour: parseInt(this.state.bgColour.replace('#', '0x'))
    }).then((ownSettings) => {

      this.ownSettings = ownSettings;

      this.drawVisual();

    });
  }

  drawVisual(){
    this.stats.end();
    this.stats.begin();
    this.frameId = requestAnimationFrame(this.drawVisual);
    this.ownSettings = this.props.visualDraw({
      visualSettings: this.props.visualSettings,
      canvWidth: this.state.canvWidth,
      canvHeight: this.state.canvHeight,
      bufferLength: this.props.bufferLength,
      dataArray: this.props.dataArray,
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
