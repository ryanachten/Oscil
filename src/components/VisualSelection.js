import React from 'react';
import { Link } from 'react-router-dom';
import visuals from '../store/visuals';

const VisualSelection = (props) => (
    <div className="visual-selection active">
      { Object.keys(visuals).map((visual) => {
        const currentVis = visuals[visual];
        if (currentVis.type === props.type) {
          return(
            <Link key={visual} to={`/${visual}`}>
              <div className="visual-mode"
                style={{backgroundImage: `url(${currentVis.thumbImg})`}}>
                <p>{visual}</p>
              </div>
            </Link>
          )
        }
      })}
    </div>
);

export default VisualSelection;
