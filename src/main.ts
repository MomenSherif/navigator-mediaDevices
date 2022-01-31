const video = document.getElementById('video') as HTMLVideoElement;
const videoToggleBtn = document.getElementById(
  'video-toggle',
) as HTMLButtonElement;

const constraints: MediaStreamConstraints = {
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    sampleRate: 44100, // 44.1kHZ
  },
  video: true,
  // video: { width: 1280, height: 720 },
};

// User Media
// async function app() {
//   let streaming = true;
//   const stream = await navigator.mediaDevices.getUserMedia(constraints);
//   const [videoTrack] = stream.getVideoTracks();
//   console.log('Got stream with constraints:', constraints);
//   console.log(`Using video device ${videoTrack.label}`);
//   // videoTrack.stop();
//   // stream.removeTrack(videoTrack);
//   stream.onremovetrack = () => {
//     console.log('Stream ended');
//   };

//   video.srcObject = stream;

//   videoToggleBtn.onclick = () => {
//     video.srcObject = streaming ? null : stream;
//     streaming = !streaming;
//   };
// }

// Display -> for share screen

const startSharingBtn = document.getElementById(
  'start-sharing',
) as HTMLButtonElement;
const stopSharingBtn = document.getElementById(
  'stop-sharing',
) as HTMLButtonElement;

let streaming = false;

startSharingBtn.addEventListener('click', e => {
  if (streaming) return;
  startCapture();
  streaming = true;
});

stopSharingBtn.addEventListener('click', e => {
  stopCapture();
  streaming = false;
});

async function startCapture() {
  let captureStream: MediaStream | null = null;

  try {
    captureStream = await navigator.mediaDevices.getDisplayMedia(constraints);
    video.srcObject = captureStream;
  } catch (error) {
    console.error('Error', error);
  }

  return captureStream;
}

function stopCapture() {
  const tracks = (video.srcObject as MediaStream)?.getTracks();
  tracks?.forEach(track => track.stop());
  video.srcObject = null;
}

// app().catch(error => {
//   console.dir(error);
//   /**
//    * |- error.name
//    *  |-- PermissionDeniedError
//    *  |-- NotAllowedError
//    *  |-- etc
//    * |- error.message
//    */
// });
