<?php

if (isset($_FILES['file']['name'])) {
    // Get the file name and selected language
    $filename = $_FILES['file']['name'];
    $language = $_POST['language']; // Language is passed from the JS

    // Determine the folder based on the selected language
    $uploadDir = '';
    switch (strtolower($language)) {
        case 'csharp':
            $uploadDir = '../assets/modules/csharp/';
            break;
        case 'java':
            $uploadDir = '../assets/modules/java/';
            break;
        case 'python':
            $uploadDir = '../assets/modules/python/';
            break;
        default:
            echo "Invalid language selected.";
            exit;
    }

    // Ensure the directory exists
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true); // Create the directory if it doesn't exist
    }

    // File location
    $location = $uploadDir . $filename;

    // Get the file extension
    $file_extension = pathinfo($location, PATHINFO_EXTENSION);
    $file_extension = strtolower($file_extension);

    // Valid file extensions (PDF and common video formats)
    $valid_ext = array("pdf", "mp4", "avi", "mkv", "mov", "wmv", "flv");

    $response = 0;
    if (in_array($file_extension, $valid_ext)) {
        // Upload the file
        if (move_uploaded_file($_FILES['file']['tmp_name'], $location)) {
            $response = 1;
        } else {
            echo "Error uploading the file.";
        }
    } else {
        echo "Invalid file format. Only PDF and video files are allowed.";
    }

    echo $response;
    exit;
}
?>
