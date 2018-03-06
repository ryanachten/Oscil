import React from 'react';
import { connect } from 'react-redux';

import VisualSelection from './VisualSelection';
import VisualDatGui from './VisualDatGui';
import AudioDatGui from './AudioDatGui';

class VisualControlPanel extends React.Component{

  constructor(props){
    super(props);

    this.state = {
      currentType: 'shape',
      allTypes: [
        {value: 'shape', label: 'Shape'},
        {value: 'image', label: 'Image'},
        {value: 'video', label: 'Video'},
        {value: '3D', label: '3D'}
      ]
    }
  }

  render(){

    return(
      <div id="ui-panel">
        <h1>Oscil</h1>
  			<hr />
        <div className="ui-section">
          <h2>Visualisation:</h2>

          { this.state.allTypes.map((type) => {
            return(
              <button
                key={type.value}
                className="visual-type-toggle"
                onClick={() => this.setState(() => ({
                  currentType: type.value
                }))}>{type.label}</button>
            );
          })}

          <VisualSelection type={this.state.currentType}/>

          { this.props.settings && (
              <VisualDatGui />
          )}

          <AudioDatGui />
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({visual}) => {
  return{
    settings: visual.visualSettings
  }
}

export default connect(mapStateToProps)(VisualControlPanel);
