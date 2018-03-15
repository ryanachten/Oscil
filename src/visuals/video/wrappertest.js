import $ from 'jquery';

export default function sketch (p) {
  let rotation = 0;

  p.setup = function () {
    p.createCanvas($(window).width(), $(window).height(), p.WEBGL);
  };

  p.myCustomRedrawAccordingToNewPropsHandler = function (props) {

    if (props.rotation){
      rotation = props.rotation * Math.PI / 180;
    }
  };

  p.draw = function () {
    p.background(100);
    p.noStroke();
    p.push();
    p.rotateY(rotation);
    p.box(100);
    p.pop();
  };
};
