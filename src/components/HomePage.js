import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import $ from "jquery";

import Header from "./Header";
import visuals from "../store/visuals";
import { unsetVisual } from "../actions/visual";

class HomePage extends React.Component {
  componentWillMount() {
    this.props.dispatch(unsetVisual());
    let bgImgs = {};
    Object.keys(visuals).map((visual) => {
      const currentImg = visuals[visual].thumbImg;
      const img = new Image();
      img.src = `./img/thumbs/${currentImg}`;
      img.onload = () => {
        bgImgs[visual] = img;
        if (Object.keys(bgImgs).length === Object.keys(visuals).length) {
          $(`.thumbnail--item`).fadeIn();
        }
      };
    });
  }

  render() {
    return (
      <div className="HomePage">
        <Header currentPage="home" />
        <div className="thumbnail--grid">
          {Object.keys(visuals).map((visual) => {
            const currentVis = visuals[visual];
            return (
              <Link
                className={`thumbnail--item ${visual}`}
                key={visual}
                to={`/${visual}`}
              >
                <div
                  className="thumbnail--background"
                  style={{
                    backgroundImage: `url('./img/thumbs/${currentVis.thumbImg}')`,
                  }}
                >
                  <div className="thumbnail--info">
                    <h3 className="thumbnail--title">
                      {visual[0].toUpperCase() + visual.slice(1)}
                    </h3>
                    <p>{currentVis.description}</p>
                    <div>
                      <div
                        className={`thumbnail--type ${currentVis.type}`}
                      ></div>
                      <div
                        className={`thumbnail--renderer ${currentVis.renderer}`}
                      ></div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    );
  }
}

export default connect()(HomePage);
