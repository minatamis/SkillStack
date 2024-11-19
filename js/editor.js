 let editor;
window.onload = function()
{
    editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai");
    editor.session.setMode("ace/mode/java");
}

function changeLaguage()
{
    let language = $("#languages").val();

    if (language === 'java') {
        editor.session.setMode("ace/mode/java");
    } else if (language === 'csharp') {
        editor.session.setMode("ace/mode/csharp");
    } else if (language === 'python') {
        editor.session.setMode("ace/mode/python");
    }
}
