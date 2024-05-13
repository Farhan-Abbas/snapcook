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

	// Convert Data URL to Blob
	fetch(imgData)
		.then((res) => res.blob())
		.then((blob) => {
			// Initialize Firebase Storage and create a reference
			const storageRef = firebase.storage().ref();
			const imgRef = storageRef.child("snapcook images/" + Date.now() + ".png");

			// Upload the Blob
			imgRef.put(blob).then((snapshot) => {
				console.log("Uploaded the image!");

				// Optional: Get the download URL
				snapshot.ref.getDownloadURL().then((downloadURL) => {
					console.log("File available at", downloadURL);
				});
			});
		});

	// Display the captured image in an <img> element
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
