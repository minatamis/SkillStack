const API_URL = "https://emkc.org/api/v2/piston/execute";

        let editor;

        window.onload = function () {
            editor = ace.edit("editor");
            editor.setTheme("ace/theme/monokai");
            editor.session.setMode("ace/mode/java");

            setDefaultCode(document.getElementById("language").value);

            document.getElementById("language").addEventListener("change", function () {
                const lang = this.value;
                const mode = lang === "java" ? "java" : lang === "csharp" ? "csharp" : "python";
                editor.session.setMode(`ace/mode/${mode}`);
                setDefaultCode(lang);
            });
        };

        function setDefaultCode(language) {
            let defaultCode = "";
        
            if (language === "java") {
                defaultCode = `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello World");
    }
}`;
            } else if (language === "csharp") {
                defaultCode = `using System;
class HelloWorld {
    static void Main() {
        Console.WriteLine("Hello World");
    }
}`;
            } else if (language === "python") {
                defaultCode = `print('Hello World')`;
            }
        
            editor.setValue(defaultCode, -1);
        }

        const needsInput = (language, code) => {
            if (language === "java" && (code.includes("Scanner") || code.includes("System.in"))) {
                return true;
            } else if (language === "csharp" && (code.includes("Console.ReadLine()") || code.includes("Console.Read"))) {
                return true;
            } else if (language === "python" && (code.includes("input()"))) {
                return true;
            }
            return false;
        };

        document.getElementById("run-btn").addEventListener("click", async () => {
            const code = editor.getValue();
            const language = document.getElementById("language").value;
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

        document.getElementById("user-input").addEventListener("keypress", async (event) => {
            if (event.key === "Enter") {
                const code = editor.getValue();
                const language = document.getElementById("language").value;
                const outputDiv = document.getElementById("output");
                let userInput = document.getElementById("user-input").value;

                outputDiv.textContent = "Running...";

                if (language === "python") {
                    userInput = userInput.split("\n").map(line => line.trim()).join("\n");
                }

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
        });