import React from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';

import { getVisualInfo } from '../selectors/visual';

import VisualSelection from './VisualSelection';
import VisualDatGui from './VisualDatGui';
import AudioDatGui from './AudioDatGui';

class VisualControlPanel extends React.Component{

  constructor(props){
    super(props);
    //
    // this.state = {
    //   currentType: props.currentType,
    //   allTypes: [
    //     {value: 'shape', label: 'Shape'},
    //     {value: 'image', label: 'Image'},
    //     {value: 'video', label: 'Video'},
    //     {value: 'three', label: '3D'}
    //   ]
    // }
    this.state = {
      activeMenu: 'settings'
    };
  }

  onMenuChange = (e) => {
    const buttonClasses = e.target.className;
    let activeMenu = undefined;
    if (buttonClasses === 'viscontrol--menubuttons settings') {
      activeMenu = 'settings';
    }
    else if (buttonClasses === 'viscontrol--menubuttons select') {
      activeMenu = 'select';
    }
    this.setState( () => ({activeMenu}));
  };


  render(){

    return(
      <div id="VisualControlPanel">

        <button className="viscontrol--menubuttons settings"
          onClick={this.onMenuChange}></button>
        <button className="viscontrol--menubuttons select"
          onClick={this.onMenuChange}></button>

        {this.state.activeMenu === 'settings' && (
          <div className="viscontrol--settingsmenu ui-section">

            <h1>{this.props.title}</h1>
            <hr />
            <div>{`${this.props.type} | ${this.props.renderer}`}</div>
            <p>{this.props.description}</p>

            { this.props.settings && (
                <VisualDatGui />
            )}

            <AudioDatGui />

          </div>
        )}
          {/* { this.state.allTypes.map((type) => {
            return(
              <button
                key={type.value}
                className={this.state.currentType === type.value ? "visual-type-toggle active" : "visual-type-toggle"}
                onClick={() => this.setState(() => ({
                  currentType: type.value
                }))}>{type.label}</button>
            );
          })} */}

          {/* <VisualSelection type={this.state.currentType}/> */}



      </div>
    )
  }
}

const mapStateToProps = ({visual}) => {
  const {title, type, renderer, description} = getVisualInfo(visual);
  return{
    title, type, renderer, description,
    settings: visual.visualSettings
  }
}

export default connect(mapStateToProps)(VisualControlPanel);
