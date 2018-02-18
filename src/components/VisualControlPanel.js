import React from 'react';
import { Link } from 'react-router-dom';
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

          <button className="visual-type-toggle" onClick={() =>
            this.setState({
              type: 'shape'
            })}>Shape</button>

          <button className="visual-type-toggle" onClick={() =>
            this.setState({
              type: 'image'
            })}>Image</button>

          <button className="visual-type-toggle" onClick={() =>
            this.setState({
              type: 'video'
            })}>Video</button>

          <button className="visual-type-toggle" onClick={() =>
            this.setState({
              type: '3D'
            })}>3D</button>

          <div className="visual-selection active">
            { Object.keys(visuals).map((visual) => {
              const currentVis = visuals[visual];
              return(
                <Link key={visual} to={`/${visual}`}>
                  <div className="visual-mode"
                    style={{backgroundImage: `url(${currentVis.thumbImg})`}}>
                    <p>{visual}</p>
                  </div>
                </Link>
              )
            })}
          </div>

        </div>
      </div>
    )
  }
}

export default HomePage;
