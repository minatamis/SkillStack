let editor;

// Extract lessonLang from the URL
const urlParams = new URLSearchParams(window.location.search);
const lessonLang = urlParams.get("lessonLang") || "java"; // Default to "java" if lessonLang is not present

window.onload = function () {
    editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai");

    // Set editor mode based on lessonLang
    const mode = `ace/mode/${lessonLang}`;
    editor.session.setMode(mode);

    // Log to confirm the mode is set correctly
    console.log(`Editor mode set to: ${mode}`);
};

function validateTime(event) {
    const input = event.target;
    let value = input.value;

    // Allow only digits
    value = value.replace(/[^0-9]/g, ""); 

    // Format as mm:ss
    if (value.length > 2) {
        value = value.slice(0, 2) + ":" + value.slice(2, 4);
    } else if (value.length === 2) {
        value = value.slice(0, 2) + ":";
    }

    // Set the value back in the input field
    input.value = value;

    // Prevent invalid time (longer than mm:ss)
    if (input.value.length > 5) {
        input.value = "00:00";
    }
}
