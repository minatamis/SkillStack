const API_URL = "https://emkc.org/api/v2/piston/execute";
let editor;

window.onload = function () {
    // Initialize Ace Editor
    editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai");
    editor.session.setMode("ace/mode/java");

    setDefaultCode("java"); // Set initial code for Java

    // Handle Language Change
    document.getElementById("language").addEventListener("change", function () {
        const lang = this.value;
        const mode = lang === "java" ? "java" : lang === "csharp" ? "csharp" : "python";
        editor.session.setMode(`ace/mode/${mode}`);
        setDefaultCode(lang);
    });
};

// Default Code for Each Language
// function setDefaultCode(language) {
//     let defaultCode = "";
//     if (language === "java") {
//         defaultCode = `public class Main {
//     public static void main(String[] args) {
//         System.out.println("Hello World");
//     }
// }`;
//     } else if (language === "csharp") {
//         defaultCode = `using System;
// class HelloWorld {
//     static void Main() {
//         Console.WriteLine("Hello World");
//     }
// }`;
//     } else if (language === "python") {
//         defaultCode = `print('Hello World')`;
//     }
//     editor.setValue(defaultCode, -1);
// }

// Check if Input is Needed
const needsInput = (language, code) => {
    if (language === "java" && code.includes("System.in")) return true;
    if (language === "csharp" && code.includes("Console.Read")) return true;
    if (language === "python" && code.includes("input()")) return true;
    return false;
};

// Run Button Logic
document.getElementById("run").addEventListener("click", async () => {
    const code = editor.getValue();
    const language = document.getElementById("language").value;
    const outputDiv = document.getElementById("output");
    const inputDiv = document.getElementById("input-div");

    outputDiv.textContent = "Running...";

    // Check for Input Requirement
    if (needsInput(language, code)) {
        inputDiv.style.display = "block";
        return;
    }
    inputDiv.style.display = "none";

    // Call the API to Run Code
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

// Submit Button Logic
document.getElementById("submit").addEventListener("click", () => {
    alert("Code submitted successfully!");
});
