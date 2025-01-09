// // This js is to create preview video and to connect api with frontend for your video
 
// document.addEventListener("DOMContentLoaded", () => {
//     const form = document.getElementById("video-upload-form");
//     const fileInput = document.getElementById("file-input");
//     const promptInput = document.getElementById("prompt-text");
//     const intervalInput = document.getElementById("interval");
//     const videoPreview = document.getElementById("video-preview");
//     const thresholdInput = document.getElementById("accuracy-threshold");
//     const thresholdValue = document.getElementById("threshold-value");
//     const saveAnalysisButton = document.querySelector(".save-analysis");
//     const thumbnailsContainer = document.getElementById("thumbnails-container");
//     const loadingIndicator = document.createElement("div");  // Create loading indicator

//     // Add loading indicator styles dynamically
//     loadingIndicator.style.position = 'fixed';
//     loadingIndicator.style.top = '50%';
//     loadingIndicator.style.left = '50%';
//     loadingIndicator.style.transform = 'translate(-50%, -50%)';
//     loadingIndicator.style.fontSize = '20px';
//     loadingIndicator.style.fontWeight = 'bold';
//     loadingIndicator.style.color = '#ff9900';
//     loadingIndicator.style.display = 'none';  // Hide initially
//     loadingIndicator.textContent = "Processing...";
//     document.body.appendChild(loadingIndicator);

//     // Update threshold value dynamically
//     thresholdInput.addEventListener("input", () => {
//         thresholdValue.textContent = thresholdInput.value;
//     });

//     // Preview video on file selection
//     fileInput.addEventListener("change", () => {
//         const file = fileInput.files[0];
//         if (file) {
//             const fileURL = URL.createObjectURL(file);
//             videoPreview.src = fileURL;
//             videoPreview.style.display = "block";
//         } else {
//             videoPreview.style.display = "none";
//         }
//     });

//     // Create zoom overlay
//     const zoomOverlay = document.createElement("div");
//     zoomOverlay.className = "image-zoom-overlay";

//     const zoomedImage = document.createElement("img");
//     zoomOverlay.appendChild(zoomedImage);

//     const closeButton = document.createElement("span");
//     closeButton.className = "close-btn";
//     closeButton.innerHTML = "&times;";
//     zoomOverlay.appendChild(closeButton);

//     document.body.appendChild(zoomOverlay);

//     // Event listener to zoom in on image click
//     thumbnailsContainer.addEventListener("click", (event) => {
//         if (event.target.tagName === "IMG") {
//             zoomedImage.src = event.target.src;
//             zoomOverlay.style.display = "flex";
//         }
//     });

//     // Event listener to close the zoom overlay
//     closeButton.addEventListener("click", () => {
//         zoomOverlay.style.display = "none";
//     });

//     // Close overlay when clicking outside the image
//     form.addEventListener("submit", async (event) => {
//         event.preventDefault();

//         // Validate file input
//         if (!fileInput.files.length) {
//             alert("Please select a video file to upload.");
//             return;
//         }

//         // Show loading indicator
//         loadingIndicator.style.display = 'block';

//         // Create FormData object
//         const formData = new FormData();
//         formData.append("video", fileInput.files[0]);
//         formData.append("prompt", promptInput.value);
//         formData.append("interval", intervalInput.value);
//         formData.append("threshold", thresholdInput.value);

//         try {
//             // Send POST request to the backend API
//             const response = await fetch(
//                 "https://895e-2405-201-d01d-b80c-b0e2-bc53-5538-f7cb.ngrok-free.app/process_video/",
//                 {
//                     method: "POST",
//                     body: formData,
//                 }
//             );

//             if (!response.ok) {
//                 throw new Error(`Server responded with status ${response.status}`);
//             }

//             const data = await response.json();
//             console.log("Response data:", data);

//             // Clear previous thumbnails
//             thumbnailsContainer.innerHTML = "";

//             // Display thumbnails with timestamp and accuracy
//             data.matches.forEach((match) => {
//                 // Create a container for the thumbnail and caption
//                 const thumbnailWrapper = document.createElement("div");
//                 thumbnailWrapper.className = "thumbnail-wrapper";

//                 // Create the thumbnail image
//                 const img = document.createElement("img");
//                 img.src = `data:image/png;base64,${match.image_base64}`;
//                 img.alt = `Thumbnail at ${match.time} seconds with ${match.accuracy} accuracy`;
//                 img.title = `Time: ${match.time}s, Accuracy: ${match.accuracy}`;

//                 // Create a caption for timestamp and accuracy
//                 const caption = document.createElement("div");
//                 caption.textContent = `Time: ${match.time}s, Accuracy: ${match.accuracy}`;

//                 // Append image and caption to the wrapper
//                 thumbnailWrapper.appendChild(img);
//                 thumbnailWrapper.appendChild(caption);

//                 // Append the wrapper to the thumbnails container
//                 thumbnailsContainer.appendChild(thumbnailWrapper);
//             });

//             // Optionally show the save analysis button
//             saveAnalysisButton.style.display = "block";
//             alert("Video uploaded and frames generated successfully!");

//             // Clear form and video preview
//             form.reset();
//             videoPreview.style.display = "none";

//         } catch (error) {
//             console.error("Error uploading video:", error);
//             alert("Failed to process the video. Please try again.");
//         } finally {
//             // Hide loading indicator after the process is complete
//             loadingIndicator.style.display = 'none';
//         }
//     });
// });






// // This code to proceess videoo

 
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("video-upload-form");
    const fileInput = document.getElementById("file-input");
    const promptInput = document.getElementById("prompt-text"); // Added this
    const intervalInput = document.getElementById("interval"); // Added this
    const videoPreview = document.getElementById("video-preview");
    const thresholdInput = document.getElementById("accuracy-threshold");
    const thresholdValue = document.getElementById("threshold-value");
    const saveAnalysisButton = document.querySelector(".save-analysis");
    const thumbnailsContainer = document.getElementById("thumbnails-container");

    // Update threshold value dynamically
    thresholdInput.addEventListener("input", () => {
        thresholdValue.textContent = thresholdInput.value;
    });

    // Preview video on file selection
    fileInput.addEventListener("change", () => {
        const file = fileInput.files[0];
        if (file) {
            const fileURL = URL.createObjectURL(file);
            videoPreview.src = fileURL;
            videoPreview.style.display = "block";
        } else {
            videoPreview.style.display = "none";
        }
    });

    // Create zoom overlay
    const zoomOverlay = document.createElement("div");
    zoomOverlay.className = "image-zoom-overlay";

    const zoomedImage = document.createElement("img");
    zoomOverlay.appendChild(zoomedImage);

    const closeButton = document.createElement("span");
    closeButton.className = "close-btn";
    closeButton.innerHTML = "&times;";
    zoomOverlay.appendChild(closeButton);

    document.body.appendChild(zoomOverlay);

    // Event listener to zoom in on image click
    thumbnailsContainer.addEventListener("click", (event) => {
        if (event.target.tagName === "IMG") {
            zoomedImage.src = event.target.src;
            zoomOverlay.style.display = "flex";
        }
    });

    // Event listener to close the zoom overlay
    closeButton.addEventListener("click", () => {
        zoomOverlay.style.display = "none";
    });

    // Close overlay when clicking outside the image
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
    
        // Validate file input
        if (!fileInput.files.length) {
            alert("Please select a video file to upload.");
            return;
        }
    
        // Create FormData object
        const formData = new FormData();
        formData.append("video", fileInput.files[0]);
        formData.append("prompt", promptInput.value);
        formData.append("interval", intervalInput.value);
        formData.append("threshold", thresholdInput.value);
    
        try {
            // Send POST request to the backend API
            const response = await fetch(
                "https://895e-2405-201-d01d-b80c-b0e2-bc53-5538-f7cb.ngrok-free.app/process_video/",
                {
                    method: "POST",
                    body: formData,
                }
            );
    
            if (!response.ok) {
                throw new Error(`Server responded with status ${response.status}`);
            }
    
            const data = await response.json();
            console.log("Response data:", data);
    
            // Clear previous thumbnails
            thumbnailsContainer.innerHTML = "";
    
            // Display thumbnails with timestamp and accuracy
            data.matches.forEach((match) => {
                // Create a container for the thumbnail and caption
                const thumbnailWrapper = document.createElement("div");
                thumbnailWrapper.className = "thumbnail-wrapper";
    
                // Create the thumbnail image
                const img = document.createElement("img");
                img.src = `data:image/png;base64,${match.image_base64}`;
                img.alt = `Thumbnail at ${match.time} seconds with ${match.accuracy} accuracy`;
                img.title = `Time: ${match.time}s, Accuracy: ${match.accuracy}`;
    
                // Create a caption for timestamp and accuracy
                const caption = document.createElement("div");
                caption.textContent = `Time: ${match.time}s, Accuracy: ${match.accuracy}`;
    
                // Append image and caption to the wrapper
                thumbnailWrapper.appendChild(img);
                thumbnailWrapper.appendChild(caption);
    
                // Append the wrapper to the thumbnails container
                thumbnailsContainer.appendChild(thumbnailWrapper);
            });
    
            // Optionally show the save analysis button
            saveAnalysisButton.style.display = "block";
            alert("Video uploaded and frames generated successfully!");

    
        } catch (error) {
            console.error("Error uploading video:", error);
            alert("Failed to process the video. Please try again.");
        }
    });
    
    
});
