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

    this.state = {
      activeMenu: 'settings'
    };
  }

  onMenuChange = (e) => {
    const clickedButton = e.target;
    let activeMenu = undefined;
    if ($(clickedButton).hasClass('settings')) {
      activeMenu = 'settings';
    }
    else if ($(clickedButton).hasClass('select')) {
      activeMenu = 'select';
    }
    this.setState( () => ({activeMenu}));
  };


  render(){

    return(
      <div id="VisualControlPanel">

        {this.state.activeMenu === undefined && (
          <div>
            <button className="viscontrol--menubuttons exterior settings"
              onClick={this.onMenuChange}></button>
            <button className="viscontrol--menubuttons exterior select"
              onClick={this.onMenuChange}></button>
          </div>
        )}

        {this.state.activeMenu === 'settings' && (
          //TODO: remove ui-section class
          <div className="viscontrol--menu settings ui-section">

            <div className="viscontrol--menubuttoncontainer">
              <button className="viscontrol--menubuttons interior select"
                onClick={this.onMenuChange}></button>
              <button className="viscontrol--menubuttons interior close"
              onClick={this.onMenuChange}></button>
            </div>

            <h1>{this.props.title}</h1>
            <hr />
            <div className={`viscontrol--typeicon ${this.props.type}`}></div>
            <div className={`viscontrol--renderericon ${this.props.renderer}`}></div>
            <p>{this.props.description}</p>

            { this.props.settings && (
              <div>
                <div className="viscontrol--settingsheader">
                  <div className="viscontrol--settingsicon visual"></div>
                  <h3 className="viscontrol--settingstitle">Settings</h3>
                </div>
                <VisualDatGui />
              </div>
            )}

            <div className="viscontrol--settingsheader">
              <div className="viscontrol--settingsicon audio"></div>
              <h3 className="viscontrol--settingstitle">Settings</h3>
            </div>
            <AudioDatGui />

          </div>
        )}

        {this.state.activeMenu === 'select' && (
          <div className="viscontrol--menu select">

            <div className="viscontrol--menubuttoncontainer">
              <button className="viscontrol--menubuttons interior settings"
                onClick={this.onMenuChange}></button>
              <button className="viscontrol--menubuttons interior close"
              onClick={this.onMenuChange}></button>
            </div>

            <VisualSelection type={this.props.type}/>
          </div>
        )}

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
