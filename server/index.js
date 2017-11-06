let portAudio = require('naudiodon');

let pr = new portAudio.AudioReader({
  deviceId: 0,
  sampleFormat: portAudio.SampleFormat16Bit,
  sampleRate: 44100
});

console.log(pr);

// pr.once('audio_ready', pa => {
//   pr.pipe(process.stdout);
//   pr.pa.start();
// });
