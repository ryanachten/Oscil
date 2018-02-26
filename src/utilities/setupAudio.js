const checkAudioPermissions = new Promise((resolve, reject) => {

  navigator.getUserMedia (
    {
      audio: true
    },
    function(stream) {
      resolve();
    },
    function(err) {
      reject('The following gUM error occured: ' + err);
    }
  );
});

export{checkAudioPermissions};
