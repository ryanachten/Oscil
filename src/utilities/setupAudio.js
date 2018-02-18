import $ from 'jquery';
import dat from 'dat.gui';

const setupAudio = new Promise((resolve, reject) => {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const analyser = audioCtx.createAnalyser();

  navigator.getUserMedia (
    {
      audio: true
    },
    function(stream) {
      const source = audioCtx.createMediaStreamSource(stream);
      analyser.fftSize = 256; //1024
      source.connect(analyser);
      setupAudioDatGui(analyser);
      resolve(analyser);
    },
    function(err) {
      reject('The following gUM error occured: ' + err);
    }
  );
});


const getAudioBuffer = (analyser) => {

	var bufferLength = analyser.frequencyBinCount;
	var dataArray = new Uint8Array(bufferLength);

	return {bufferLength, dataArray};
}

export{setupAudio, getAudioBuffer};


const setupAudioDatGui = (analyser) => {
  const audioGui = new dat.GUI({ autoPlace: false });
  audioGui.domElement.id = 'audiodat-gui';
  $('#ui-panel').append(audioGui.domElement);
  const audioGuiSettings = {
  	fftsize : 256,
  	minDb : -100,
  	maxDb : 20,
  	smoothing : 80
  };
  audioGui.add(audioGuiSettings, 'fftsize', [256]).onChange(
  	() => {
  		window.cancelAnimationFrame(drawVisual);
  		visualise(visualisationMode.value);
  	});
  audioGui.add(audioGuiSettings, 'minDb').min(-150).max(-50).onChange(
  	() => {
  		analyser.minDecibels = audioGuiSettings.minDb;
  	});
  audioGui.add(audioGuiSettings, 'maxDb').min(-80).max(20).onChange(
  	() => {
  		analyser.maxDecibels = audioGuiSettings.maxDb;
  	});
  audioGui.add(audioGuiSettings, 'smoothing').min(0).max(100).onChange(
  	() => {
  		analyser.smoothingTimeConstant = audioGuiSettings.smoothing/100;
  	});
};
