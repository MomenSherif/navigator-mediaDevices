// JUST TRYING
// check https://github.com/wmik/use-media-recorder

const video = document.getElementById('video') as HTMLVideoElement;
const videoToggleBtn = document.getElementById(
  'video-toggle',
) as HTMLButtonElement;

const constraints: MediaStreamConstraints = {
  audio: false,
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

startSharingBtn.addEventListener('click', async e => {
  if (streaming) return;
  const stream = await startCapture();
  if (!stream) return;
  streaming = true;

  let recordedChunks: Blob[] = [];

  const options = {
    mimeType: 'video/webm',
  };
  const mediaRecorder = new MediaRecorder(stream!, options);

  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.start();

  function handleDataAvailable(event: BlobEvent) {
    console.log('data-available', event.data);
    if (event.data.size > 0) {
      recordedChunks.push(event.data);
    }
  }

  mediaRecorder.onstop = function () {
    console.log('stop');
    download(recordedChunks);
    recordedChunks = [];
  };

  // const recorder = new MediaRecorder(stream, {
  //   mimeType: 'video/webm; codecs=vp9',
  // });
  // const data: Blob[] = [];

  // recorder.ondataavailable = e => data.push(e.data);

  // recorder.onerror = e => console.error(e.error.name);

  // recorder.onstop = e => {
  //   const video = document.createElement('video');
  //   video.controls = true;
  //   video.width = 700;
  //   video.src = URL.createObjectURL(new Blob(data));
  //   document.body.appendChild(video);
  // };

  // recorder.start();
  // setTimeout(() => {
  //   recorder.stop();
  // }, 5000);
});

stopSharingBtn.addEventListener('click', e => {
  stopCapture();
  streaming = false;
});

async function startCapture() {
  let captureStream: MediaStream | null = null;

  try {
    captureStream = await navigator.mediaDevices.getDisplayMedia(constraints);
    const audioStream = await navigator.mediaDevices
      .getUserMedia({ audio: true })
      .catch(e => {
        throw e;
      });
    const [audioTrack] = audioStream.getAudioTracks();
    captureStream.addTrack(audioTrack);
    video.srcObject = captureStream;

    // Listen for video track ended to capture stop sharing
    captureStream.getVideoTracks()[0].onended = stopCapture;
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

function download(chunks: Blob[]) {
  const blob = new Blob(chunks, {
    type: 'video/webm',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'test.webm';
  a.click();
  URL.revokeObjectURL(url);
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
