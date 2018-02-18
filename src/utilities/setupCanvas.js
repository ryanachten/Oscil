import $ from 'jquery';

export default (canvas) => {

  let canvWidth, canvHeight, canvasCtx;

  if(canvas.getContext){
  	canvas.width = $(window).width();
  	canvas.height = $(window).height();
  	canvWidth = canvas.width;
  	canvHeight = canvas.height;
  	canvasCtx = canvas.getContext('2d');
  	// canvasCtx.fillStyle = bgColor;
  	canvasCtx.fillRect(0,0, canvWidth, canvHeight);
  }

  return {canvWidth, canvHeight, canvasCtx};
}
