const video = document.getElementById('video') as HTMLVideoElement;
const videoToggleBtn = document.getElementById(
  'video-toggle',
) as HTMLButtonElement;

const constraints: MediaStreamConstraints = {
  audio: false,
  video: true,
  // video: { width: 1280, height: 720 },
};

async function app() {
  let streaming = true;
  const stream = await navigator.mediaDevices.getUserMedia(constraints);
  const [videoTrack] = stream.getVideoTracks();
  console.log('Got stream with constraints:', constraints);
  console.log(`Using video device ${videoTrack.label}`);
  // videoTrack.stop();
  // stream.removeTrack(videoTrack);
  stream.onremovetrack = () => {
    console.log('Stream ended');
  };

  video.srcObject = stream;

  videoToggleBtn.onclick = () => {
    video.srcObject = streaming ? null : stream;
    streaming = !streaming;
  };
}

app().catch(error => {
  console.dir(error);
  /**
   * |- error.name
   *  |-- PermissionDeniedError
   *  |-- NotAllowedError
   *  |-- etc
   * |- error.message
   */
});
