import React from 'react';
import { Link } from 'react-router-dom';
import visuals from '../store/visuals';

class VisualSelection extends React.Component{

  constructor(props){
    super(props);

    this.state = {
      openPanelType: this.props.type,
      allTypes: [
        {value: 'shape', label: 'Shape'},
        {value: 'image', label: 'Image'},
        {value: 'video', label: 'Video'},
        {value: 'three', label: '3D'}
      ]
    }
  }

  onTypeChange = (e) => {
    let newType = e.target.value;
    this.setState( (prevState) => {
      if (newType === prevState.openPanelType) {
        newType = undefined;
      }
      return {
        openPanelType: newType
      }
    });
  }

  render(){
    return(
      <div>

        {this.state.allTypes.map((type) => {
          return (
            <div key={type.value}>
              <div className="visselect--info">
                <div className={`visselect--typeicon ${type.value}`}></div>
                <h3 className="visselect--title">{type.label}</h3>
                <button className={type.value === this.state.openPanelType ? "visselect--toggle active" : "visselect--toggle"}
                  value={type.value}
                  onClick={this.onTypeChange}></button>
              </div>

              {type.value === this.state.openPanelType && (
                <div className="visselect--thumbcontainer">
                  {Object.keys(visuals).map((visual) => {
                   const currentVis = visuals[visual];
                   if (currentVis.type === type.value) {
                     return(
                       <Link key={visual} to={`/${visual}`}
                       className="visselect--thumbitem"
                       style={{backgroundImage: `url(${currentVis.thumbImg})`}}>
                          <h3>{visual}</h3>
                       </Link>
                     )
                   }})}
                </div>
              )}

              <hr></hr>
            </div>
        )})}
      </div>
    );
  }
}

export default VisualSelection;
