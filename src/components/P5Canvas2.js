import React from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import P5Wrapper from './P5Wrapper';
import 'p5/lib/addons/p5.dom';
import videoFeedback from '../visuals/video/videoFeedback2';
import muybridge from '../visuals/video/muybridge2';

import setupCanvas from '../utilities/setupCanvas';
import selectVisual from '../selectors/visual';
import {checkAudioPermissions} from '../utilities/setupAudio';

import {resolveInit} from '../actions/visual';

class P5Canvas extends React.Component{

  constructor(props){
    super(props);

    this.streamAudio = this.streamAudio.bind(this);

    this.state = {
      canvWidth: undefined,
      canvHeight: undefined,
      dataArray: undefined
    }
  }

  componentDidMount(){

    // FIXME: This promise is technically a duplicate of what takes places in the AudioAnalyser component
    checkAudioPermissions.then( (analyser) => {
      this.streamAudio();

    }).catch( (reason) => {
        // Do something
        console.log(reason);
      }
    );

  }

  streamAudio(){
    requestAnimationFrame(this.streamAudio);
    this.setState({
      dataArray: this.props.dataArray
    });
    // console.log('whole', this.dataArray);
    // console.log('first', this.dataArray[0]);
  }

  render(){
    return(
      <div>
        {this.state.dataArray && (
          <P5Wrapper sketch={this.props.visualDraw}
            dataArray={this.state.dataArray}
            visualSettings={this.props.visualSettings}
          />
        )}
      </div>
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

export default connect(mapStateToProps)(P5Canvas);
