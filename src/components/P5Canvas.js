import React from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import p5 from 'p5';
import 'p5/lib/addons/p5.dom';

import selectVisual from '../selectors/visual';
import {checkAudioPermissions} from '../utilities/setupAudio';

import {resolveInit} from '../actions/visual';

class P5Canvas extends React.Component{

  constructor(props){
    super(props);

    this.initVisual = this.initVisual.bind(this);
    this.drawVisual = this.drawVisual.bind(this);
    this.resize = this.resize.bind(this);

    this.state = {
      canvWidth: undefined,
      canvHeight: undefined,
      bgColour: this.props.bgColour
    }
  }

  componentDidUpdate(prevProps){
    // Prevents execution on page load
    if (this.canvIsMounted &&
      // prevents executing visual during render transitions
       this.props.renderer === 'p5') {
      this.initVisual();
    }
  }

  componentDidMount(){

    const canvWidth = $(window).width();
    const canvHeight = $(window).height();
    this.setState(() => ({ canvWidth, canvHeight }));

    window.addEventListener("resize", this.resize);

    // FIXME: This promise is technically a duplicate of what takes places in the AudioAnalyser component
    checkAudioPermissions.then( (analyser) => {

      // Hide that annoying image() friendly error msg
      p5.disableFriendlyErrors = true;

      const myP5 = new p5( (p) => {
        return p;
      }, this.container);

      // for retina displays
      myP5.pixelDensity(1);

      this.myP5 = myP5;
      const video = myP5.createCapture( myP5.VIDEO );
      video.id('videoCapture');
      video.size(320, 240);
      video.hide();
      this.video = video;

      this.initVisual();
      this.canvIsMounted = true;

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
    this.myP5.resizeCanvas(
      this.state.canvWidth, this.state.canvHeight
    );
  }

  componentWillUnmount(){
    this.myP5.noLoop();
    this.myP5.remove();
    $('#videoCapture').remove();
    window.removeEventListener("resize", this.resize);
  }


  initVisual(){
    this.props.visualInit({
      p: this.myP5,
      video: this.video,
      visualSettings: this.props.visualSettings,
      canvWidth: this.state.canvWidth,
      canvHeight: this.state.canvHeight,
      bgColour: this.state.bgColour,
    }).then((ownSettings) => {
      this.ownSettings = ownSettings;
      this.drawVisual();
    });
  }

  drawVisual(){
    this.myP5.draw = () => {
      this.ownSettings = this.props.visualDraw({
        p: this.myP5,
        visualSettings: this.props.visualSettings,
        canvWidth: this.state.canvWidth,
        canvHeight: this.state.canvHeight,
        bufferLength: this.props.bufferLength,
        dataArray: this.props.dataArray,
        ownSettings: this.ownSettings,
        bgColour: this.state.bgColour,
      });
    }

  }

  render(){
    return(
      <div
        id="P5Canvas"
        width={this.state.canvWidth}
        height={this.state.canvHeight}
        ref={(container) => {this.container = container}}></div>
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

export default connect(mapStateToProps)(P5Canvas);
