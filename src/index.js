let video;
let stream;

// Start the video stream
function startVideo() {
	if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
		navigator.mediaDevices
			.getUserMedia({
				video: true, // Request video without specifying an aspect ratio
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

// Assuming you have an HTML element with the ID 'loadingContainer' for the loading animation
// <div id="loadingContainer" style="display:none;">Loading...</div>

async function getFoodItemsAndRecipes(data) {
    const backendEndpoint = "http://127.0.0.1:5000/api/foodItemsAndRecipesFinder";
    document.getElementById("loadingContainer").style.display = "flex";
    try {
        const response = await fetch(backendEndpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ data: data }),
        });
        if (response.ok && response.headers.get("Content-Type").includes("application/json")) {
            const jsonData = await response.json();
            console.log("Message received successfully!");
            return jsonData["data"];
        } else {
            // Improved error handling for non-JSON responses or server errors
            console.error("Error receiving message or non-JSON response!");
            const text = await response.text(); // Log the raw response for debugging
            console.error("Response status:", response.status, "Response body:", text);
            // Consider adding user-friendly error handling here
            return null; // Return null or a default value to handle this case gracefully
        }
    } catch (error) {
        console.error("Error sending data!", error);
        // Handle fetch errors (network issues, etc.)
        // Consider showing a user-friendly message or retry mechanism
    } finally {
        document.getElementById("loadingContainer").style.display = "none";
    }
}
async function onButtonClick() {
	var base64ImgData = snapPhoto();
	var response = await getFoodItemsAndRecipes(base64ImgData); // Wait for the promise to resolve
	// var response = ["Apple, Banana, Orange", "Apple Pie, Banana Bread, Orange Juice"]; // Mock response

	// Ensure response is not undefined before attempting to access its properties
	if (response && response.length > 0) {
		var foodItemsElement = document.getElementById("foodItems");
		var h2FoodItems = document.createElement("h2"); // Create an <h2> element for food items
		h2FoodItems.textContent = "Food Items Found:"; // Set the text content of the <h2>
		h2FoodItems.style.textDecoration = "underline";
		foodItemsElement.appendChild(h2FoodItems); // Append the <h2> to the foodItems element
	
		var foodItemsParagraph = document.createElement("p");
		foodItemsParagraph.textContent = response[0]; // Assuming response[0] contains food items
		foodItemsElement.appendChild(foodItemsParagraph);

		var recipesElement = document.getElementById("recipes");
		var h2Recipes = document.createElement("h2"); // Create an <h2> element for recipes
		h2Recipes.textContent = "Recipes:"; // Set the text content of the <h2>
		h2Recipes.style.textDecoration = "underline";
		recipesElement.appendChild(h2Recipes); // Append the <h2> to the recipes element

		for(var i = 0; i < response[1].length; i++) {
			var recipesParagraph = document.createElement("p");
			recipesParagraph.textContent = response[1][i]; // Assuming response[1] contains recipes
			recipesElement.appendChild(recipesParagraph); // Append the paragraph to the recipes element

			var breakElement = document.createElement("br"); // Create a break element
			recipesElement.appendChild(breakElement); // Append the break after each paragraph
		}

	}
	else {
		var foodItemsElement = document.getElementById("foodItems");
		var errorMsg = document.createElement("p");
		errorMsg.textContent = "An Error Occured. Please try again!";
		foodItemsElement.appendChild(errorMsg);
	}

	var output = document.getElementById("output");
	output.style.display = "block"; // Display the output element
}

// Call startVideo when the page loads
window.onload = startVideo;

// Add a button to capture a photo
var button = document.getElementById("button");
button.addEventListener("click", onButtonClick);

var snapNewPhoto = document.getElementById("snapNewPhoto");
snapNewPhoto.addEventListener("click", function () {
	// Clear the inner HTML of foodItems and recipes
	var foodItems = document.getElementById("foodItems");
	var recipes = document.getElementById("recipes");
	foodItems.innerHTML = ""; // Clear previous items
	recipes.innerHTML = ""; // Clear previous recipes

	var videoContainer = document.getElementById("video-container");
	videoContainer.style.display = "block";
	var output = document.getElementById("output");
	output.style.display = "none";
});
