// Set the progress value
let progressValue = 1; // Set progress percentage (0 to 100)

// Get elements
const progressCircle = document.getElementById('progress-circle');
const progressValueDisplay = document.getElementById('progress-value');

// Maximum circumference of the circle
const circumference = 2 * Math.PI * 70; // Radius is 70
progressCircle.style.strokeDasharray = circumference;

// Animate the progress
function updateProgress(value) {
    const offset = circumference - (value / 100) * circumference;
    progressCircle.style.strokeDashoffset = offset;
    progressValueDisplay.textContent = `${value}%`;
}

// Call the function with the initial value
updateProgress(progressValue);
