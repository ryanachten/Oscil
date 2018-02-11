import React from 'react';
import visuals from '../store/visuals';

class HomePage extends React.Component{

  constructor(props){
    super(props);

    this.state = {
      type: 'shape'
    }
  }

  render(){
    return(
      <div id="ui-panel">
        <h1>Oscil</h1>
  			<hr />
        <div className="ui-section">
          <h2>Visualisation:</h2>

          { Object.keys(visuals).map((type) => (
            <button key={type} className="visual-type-toggle" onClick={() => {
              this.setState({ type });
            }}>{type}</button>
          ))}

          <div className="visual-selection active">
            { Object.keys(visuals[this.state.type]).map((visual) => {
              const currentVis = visuals[this.state.type][visual];
              return(
                <div className="visual-mode" key={visual}
                  style={{backgroundImage: `url(${currentVis.thumbImg})`}} onClick={() => {
                    // currentVis.visual();
                    console.log(this.props.history);
                    this.props.history.push(`/${visual}`);
                  }}>
                  <p>{visual}</p>
                </div>
              )
            })}
          </div>

        </div>
      </div>
    )
  }
}

export default HomePage;
