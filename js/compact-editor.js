const API_URL = "https://emkc.org/api/v2/piston/execute";
let editor;

window.onload = function () {
    // Initialize Ace Editor
    editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai");

    // Set language from URL parameter or default to Java
    const urlParams = new URLSearchParams(window.location.search);
    const language = urlParams.get("lessonLang") || "java";

    // Set editor mode
    setEditorMode(language);

};

function setEditorMode(language) {
    const mode = language === "java" ? "java" : language === "csharp" ? "csharp" : "python";
    editor.session.setMode(`ace/mode/${mode}`);
}


const needsInput = (language, code) => {
    if (language === "java" && code.includes("System.in")) return true;
    if (language === "csharp" && code.includes("Console.Read")) return true;
    if (language === "python" && code.includes("input()")) return true;
    return false;
};

// Event listener for the Run button
document.getElementById("run-btn").addEventListener("click", async () => {
    const code = editor.getValue();
    const urlParams = new URLSearchParams(window.location.search);
    const language = urlParams.get("lessonLang") || "java";
    const outputDiv = document.getElementById("output");
    const inputDiv = document.getElementById("input-div");

    outputDiv.textContent = "Running...";

    if (needsInput(language, code)) {
        inputDiv.style.display = "block";
        return;
    }
    inputDiv.style.display = "none";

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                language,
                version: "*",
                files: [{ name: "main", content: code }],
            }),
        });

        const result = await response.json();
        outputDiv.textContent = result.run?.output || "No output or an error occurred.";
    } catch (error) {
        outputDiv.textContent = `Error: ${error.message}`;
    }
});

// Event listener for the user input (Enter key)
document.getElementById("user-input").addEventListener("keypress", async (event) => {
    if (event.key === "Enter") {
        const code = editor.getValue();
        const urlParams = new URLSearchParams(window.location.search);
        const language = urlParams.get("lessonLang") || "java";
        const outputDiv = document.getElementById("output");
        let userInput = document.getElementById("user-input").value;

        outputDiv.textContent = "Running...";

        if (language === "python") {
            userInput = userInput.split("\n").map(line => line.trim()).join("\n");
        }

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    language,
                    version: "*",
                    files: [{ name: "main", content: code }],
                    stdin: userInput,
                }),
            });

            const result = await response.json();
            outputDiv.textContent = result.run?.output || "No output or an error occurred.";
            document.getElementById("input-div").style.display = "none";
        } catch (error) {
            outputDiv.textContent = `Error: ${error.message}`;
        }
    }
})