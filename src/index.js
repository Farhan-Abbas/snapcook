let video;
let stream;

// Start the video stream
function startVideo() {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(function (s) {
        stream = s;
        video = document.getElementById("video");
        video.srcObject = stream;
        video.play();
      })
      .catch(function (err) {
        console.log(err.name + ": " + err.message);
      });
  } else {
    console.log("getUserMedia not supported");
  }
}

// Capture a photo and display it
function snapPhoto() {
  var canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  var context = canvas.getContext("2d");
  context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
  var imgData = canvas.toDataURL("image/png");
  var img = document.getElementById("img");
  img.src = imgData;
  img.style.display = "block";
}

// Call startVideo when the page loads
window.onload = startVideo;

// Add a button to capture a photo
var button = document.getElementById("button");
button.onclick = snapPhoto;