import React from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import visuals from '../store/visuals';

class HomePage extends React.Component{

  render(){
    return(
      <div className="HomePage">
        <Header currentPage="home" />
        <div className="thumbnail--grid">
          { Object.keys(visuals).map((visual) => {
            const currentVis = visuals[visual];
            return(
              <Link className="thumbnail--item" key={visual} to={`/${visual}`}>
                <div className="thumbnail--background"
                  style={{backgroundImage: `url(${currentVis.thumbImg})`}}>
                  <p className="thumbnail--label">{visual}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    )
  }
}

export default HomePage;
