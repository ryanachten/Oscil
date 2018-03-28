import React from 'react';
import { Link } from 'react-router-dom';
import visuals from '../store/visuals';

/*



allTypes: [	+    //   allTypes: [
-        	+    //     {value: 'shape', label: 'Shape'},
-        	+    //     {value: 'image', label: 'Image'},
-        	+    //     {value: 'video', label: 'Video'},
-        	+    //     {value: 'three', label: '3D'}
-      ]	+    //   ]
-    }
*/

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
    const newType = e.target.value;
    this.setState( () => ({
      openPanelType: newType
    }));
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
                <button className="visselect--toggle"
                  value={type.value}
                  onClick={this.onTypeChange}></button>
              </div>

              {type.value === this.state.openPanelType && (
                <div>
                  {Object.keys(visuals).map((visual) => {
                   const currentVis = visuals[visual];
                   if (currentVis.type === type.value) {
                     return(
                       <Link key={visual} to={`/${visual}`}>
                         <div className="visual-mode"
                           style={{backgroundImage: `url(${currentVis.thumbImg})`}}>
                           <p>{visual}</p>
                         </div>
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
