import $ from 'jquery';

export default () => {
  const canvas = document.createElement("canvas");
  canvas.id = 'visualiser';
  document.body.appendChild(canvas);

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
