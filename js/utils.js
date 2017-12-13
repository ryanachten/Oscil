// Utility function for removing p5 video canvases
function removeP5Canvas(newVisual){
  $('#p5-canvas').remove();
  $('#videoCapture').remove();
  switch (newVisual) {
    // If the new visual is a p5video visual do not show the html canvas
    //(event occurs after visual is loaded)
    // p5 visuals whitelisted via cases, html canvas is default
    case 'DrosteVideo':
    case 'Muybridge':
    case 'RippleTank':
    case 'Tesserae':
    case 'ParticlePainting':
    case 'SlitScan':
    case 'Julia8bit': //FIXME: doesn't use video - function might need to be altered accordingly
    case 'FractalTree':
    case 'Lsystem':
      break;
    default:
      $('#visualiser').show();
  }
}
