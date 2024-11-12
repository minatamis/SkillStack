<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="../assets/images/Logo.png" type="image/png">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="../css/editor.css">
    <title>Code</title>
</head>
<body>
    <head-element></head-element>
    <div class="main-bod">
        <div class="whole-editor">
            <div class="left-side">
                <div class="title">
                    <h4>Language: </h4>
                    <select name="" id="languages" onchange="changeLanguage()">
                        <option value="java">Java</option>
                        <option value="csharp">C#</option>
                        <option value="python">Python</option>
                    </select>

                    <button>Run</button>
                </div>
                <div class="editor" id="editor">//Code Here</div>

            </div>
            <div class="right-side">
                <div class="title">
                    <h4>Output: </h4>
                </div>
                <div class="output">

                </div>

            </div>

        </div>

    </div>
    <chat-head></chat-head>
    <foot-element></foot-element>

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.36.4/ace.js"></script>
    <script src="../js/editor.js"></script>
    <script src="../js/header-footer.js"></script>
    <script src="../js/toggle-chat.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>