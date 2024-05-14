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
// Capture photo and return the base64 image data
function snapPhoto() {
	var canvas = document.createElement("canvas");
	canvas.width = video.videoWidth;
	canvas.height = video.videoHeight;
	var context = canvas.getContext("2d");
	context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
	var imgData = canvas.toDataURL("image/png");

	var videoContainer = document.getElementById("video-container");
	videoContainer.style.display = "none";

	// Return the base64 image data
	return imgData.split(",")[1];
}

async function getItemsList(data) {
	const backendEndpoint = "http://127.0.0.1:5000/api/foodItemsFinder";
	try {
		const response = await fetch(backendEndpoint, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ data: data }),
		});
		const text = await response.text();
		const parsedData = JSON.parse(text);
		if (response.ok) {
			console.log(parsedData.choices[0].message);
			console.log("Message received successfully!");
			return parsedData.choices[0].message;
		} else {
			console.error("Error receiving message!");
		}
	} catch (error) {
		console.error("Error sending data!", error);
	}
}

function onButtonClick() {
	var base64ImgData = snapPhoto();
	// var response = getItemsList(base64ImgData);
	var response = [
		"tomatoes, apples, chicken, eggs, milk",
		"chicken salad, tomato soup, apple pie, scrambled eggs, milkshake",
	];
	var foodItems = response[0].split(", "); // Split the string into an array of items
	var recipeItems = response[1].split(", ");

	var ol = document.getElementById("foodItemsList"); // Create an ordered list
	foodItems.forEach(function (item) {
		var li = document.createElement("li"); // Create a list item for each element
		li.textContent = item; // Set the text of the list item
		ol.appendChild(li); // Append the list item to the ordered list
	});

	var foodItems = document.getElementById("foodItems");
	foodItems.appendChild(ol); // Append the ordered list to the output element

	var ol = document.getElementById("recipeList"); // Create an ordered list
	recipeItems.forEach(function (item) {
		var li = document.createElement("li"); // Create a list item for each element
		li.textContent = item; // Set the text of the list item
		ol.appendChild(li); // Append the list item to the ordered list
	});

	var recipes = document.getElementById("recipes");
	recipes.appendChild(ol); // Append the ordered list to the output element

	var output = document.getElementById("output");
	output.style.display = "block"; // Display the output element
}

// Call startVideo when the page loads
window.onload = startVideo;

// Add a button to capture a photo
var button = document.getElementById("button");
button.addEventListener("click", onButtonClick);
var snapNewPhoto = document.getElementById("snapNewPhoto");
snapNewPhoto.addEventListener("click", function() {
	var videoContainer = document.getElementById("video-container");
	videoContainer.style.display = "block";
	var output = document.getElementById("output");
	output.textContent = "";
	output.style.display = "none";
});
