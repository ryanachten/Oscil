import React from 'react';
import $ from 'jquery';
import setupCanvas from '../../utilities/setupCanvas';

class Waveform extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      canvWidth: undefined,
      canvHeight: undefined,
      canvasCtx: undefined
    }
  }

  componentDidMount(){
    const {canvWidth, canvHeight, canvasCtx} = setupCanvas();
    this.setState({
      canvWidth,
      canvHeight,
      canvasCtx
    });
  }

  componentWillUnmount(){
    $('#visualiser').remove();
  }

  render(){
    return(
      <div>
        Waveform
      </div>
    );
  }
}

export default Waveform;
