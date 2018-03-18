import $ from 'jquery';
import * as THREE from 'three';
import Stats from 'stats.js';

export const setupHtmlCanvas = (canvas) => {

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


export const setupThreeCanvas = () => {
  // Stats performance visualiser
  const stats = Stats();
  stats.domElement.id = 'stats-graph';
  stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
  document.body.appendChild( stats.domElement );
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.right = 0;

  const canvWidth = $(window).width();
  const canvHeight = $(window).height();

  // Renderer setup
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  document.body.appendChild( renderer.domElement );
  renderer.domElement.id = 'threed-canvas';
  renderer.setClearColor( new THREE.Color(0x000000));
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  return {
    stats, renderer, canvWidth, canvHeight
  }
}
