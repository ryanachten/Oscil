import React from 'react';

import AudioAnalyser from './AudioAnalyser';
import VisualControlPanel from './VisualControlPanel';
import VisualCanvas from '../components/VisualCanvas';

class VisualPage extends React.Component{

  constructor(props){
    super(props);
  }

  render(){
    return(
      <div>
        <VisualControlPanel />
        <AudioAnalyser />
        <VisualCanvas pathId={this.props.pathId} />
      </div>
    );
  }
}

export default VisualPage;
