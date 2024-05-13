import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

let video;
let stream;

// Start the video stream
function startVideo() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
            .getUserMedia({
                video: {
                    aspectRatio: 0.5625, // Requesting a 9:16 aspect ratio
                },
            })
            .then(function (stream) {
                video = document.getElementById("video"); // Assign to the global variable
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
	var videoContainer = document.getElementById("video-container");
	videoContainer.style.display = "none";
	img.style.display = "block";
}

async function getMessages() {
	const backendEndpoint = "https://mike-tyson-chatbot..app/ap";
	try {
		const response = await fetch(backendEndpoint, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ message: message }),
		});
		const text = await response.text();
		const data = JSON.parse(text);
		if (response.ok) {
			console.log(data["message"]);
			console.log("Message received successfully!");
			return data["message"];
		} else {
			console.error("Error receiving message!.");
		}
	} catch (error) {
		console.error("Error sending data!", error);
	}
}

function onButtonClick() {
	snapPhoto();
	// var response = getMessages();
}

// Call startVideo when the page loads
window.onload = startVideo;

// Add a button to capture a photo
var button = document.getElementById("button");
button.addEventListener("click", onButtonClick);

// ------------------------------------------
function base64ToBlob(base64, mimeType) {
  const byteCharacters = atob(base64.split(',')[1]);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], {type: mimeType});
}

// Assuming imgData is a base64 encoded string of the image
const imageBlob = base64ToBlob(imgData, 'image/jpeg'); // Adjust the MIME type if necessary

const storage = getStorage();
const storageRef = ref(storage, 'images/myImage.jpg'); // Customize the path as needed

uploadBytes(storageRef, imageBlob).then((snapshot) => {
  console.log('Uploaded a blob or file!', snapshot);
  // After upload, retrieve the file URL
  retrieveAndDeleteFile(storageRef);
});

function retrieveAndDeleteFile(storageRef) {
  getDownloadURL(storageRef)
    .then((url) => {
      console.log('File URL:', url);
      // Use the URL as needed, then delete the file
      deleteFile(storageRef);
    })
    .catch((error) => {
      console.error("Error getting file URL", error);
    });
}

function deleteFile(storageRef) {
  deleteObject(storageRef)
    .then(() => {
      console.log('File deleted successfully');
    })
    .catch((error) => {
      console.error("Error deleting file", error);
    });
}