import React from 'react';
import { connect } from 'react-redux';

import { setVisual } from '../actions/visual';

import AudioAnalyser from './AudioAnalyser';
import VisualControlPanel from './VisualControlPanel';
import HtmlCanvas from '../components/HtmlCanvas';
import P5Canvas from '../components/P5Canvas';
import ThreeCanvas from '../components/ThreeCanvas';

class VisualPage extends React.Component{

  constructor(props){
    super(props);
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

  render(){
    return(
      <div id="VisualPage">
        <VisualControlPanel />
        <AudioAnalyser />
        {this.props.renderer === 'html' && (
          <HtmlCanvas pathId={this.props.visual} />
        )}
        {this.props.renderer === 'p5' && (
          <P5Canvas pathId={this.props.visual} />
        )}
        {this.props.renderer === 'three' && (
          <ThreeCanvas pathId={this.props.visual} />
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
