const API_URL = "https://emkc.org/api/v2/piston/execute";

let editor;

// Initialize the Ace editor
window.onload = function () {
    editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai");
    editor.session.setMode("ace/mode/java");

    // Update editor mode on language change
    document.getElementById("language").addEventListener("change", function () {
        const lang = this.value;
        const mode = lang === "java" ? "java" : lang === "csharp" ? "csharp" : "python";
        editor.session.setMode(`ace/mode/${mode}`);
    });
};

// Run code functionality
document.getElementById("run-btn").addEventListener("click", async () => {
    const code = editor.getValue();
    const language = document.getElementById("language").value;
    const outputDiv = document.getElementById("output");

    outputDiv.textContent = "Running...";

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
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