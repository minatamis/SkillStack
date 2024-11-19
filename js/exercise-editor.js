// Function to change language for a specific ACE editor instance
function changeLanguage(editorId, language) {
    const editor = ace.edit(editorId);

    if (language === "java") {
        editor.session.setMode("ace/mode/java");
    } else if (language === "csharp") {
        editor.session.setMode("ace/mode/csharp");
    } else if (language === "python") {
        editor.session.setMode("ace/mode/python");
    }
}
