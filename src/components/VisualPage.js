import React from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';

import { setVisual } from '../actions/visual';

import Header from './Header';
import AudioAnalyser from './AudioAnalyser';
import VisualControlPanel from './VisualControlPanel';
import HtmlCanvas from '../components/HtmlCanvas';
import P5Canvas from '../components/P5Canvas';
import ThreeCanvas from '../components/ThreeCanvas';

class VisualPage extends React.Component{

  constructor(props){
    super(props);

    this.state = {
      bgColour: '#ede6e0'
    }
  }

  componentWillMount(){
    // Sets store on first load if url request
    this.props.dispatch(setVisual({visual: this.props.pathId}));

    $('body').addClass('visual-page');
  }

  componentWillReceiveProps(nextProps){
    // // Sets store after first load for url requests
    if (nextProps.pathId !== this.props.pathId) {
      this.props.dispatch(setVisual({visual: nextProps.pathId}));
    }
  }

  componentWillUnmount(){
    $('body').removeClass('visual-page');
  }

  render(){
    return(
      <div id="VisualPage">
        <div id="visualPage--overlay">
          <Header currentPage="visual" />
          <VisualControlPanel />
        </div>
        <AudioAnalyser />
        {this.props.renderer === 'html' && (
          <HtmlCanvas
            pathId={this.props.visual}
            bgColour={this.state.bgColour}/>
        )}
        {this.props.renderer === 'p5' && (
          <P5Canvas
            pathId={this.props.visual}
            bgColour={this.state.bgColour}/>
        )}
        {this.props.renderer === 'three' && (
          <ThreeCanvas
            pathId={this.props.visual}
            bgColour={this.state.bgColour}/>
        )}
      </div>
    );
  }
}

const mapStateToProps = ({visual}) => {
  return {
    visual: visual.currentVisual,
    renderer: visual.renderer
  };
};

export default connect(mapStateToProps)(VisualPage);
