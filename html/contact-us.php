<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Contact Us</title>
    <link rel="icon" href="../assets/images/Logo.png" type="image/png">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="../css/contactus.css">
</head>
<body>

    <head-element></head-element>
    <div class="main-bod">
        <section class="header-section">
            <div class="container header-container">
                <div class="header-content">
                    <b><h1>Contact us.</h1></b>
                    <p>Feel like contacting us? Submit your 
                        queries here <br> and we will get 
                        back to you as soon as possible.</p>
                </div>
                <div class="message-container">
                    <h2>Send us a Message.</h2>
                    <form action="#">
                        <label for="name">Name</label>
                        <input type="text" id="name" name="name" required>
        
                        <label for="email">Email</label>
                        <input type="email" id="email" name="email" required>
        
                        <label for="phone">Phone</label>
                        <input type="tel" id="phone" name="phone">
        
                        <label for="communication">Preferred method of Communication.</label>
                        <div class="communication-method">
                            <input type="radio" id="email-method" name="communication" value="email" checked>
                            <label for="email-method">Email</label>
        
                            <input type="radio" id="phone-method" name="communication" value="phone">
                            <label for="phone-method">Phone</label>
                        </div>
        
                        <label for="message">Message</label>
                        <textarea id="message" name="message" rows="4" required></textarea>
        
                        <button type="submit">Submit</button>
                    </form>
                </div>
            </div>      
        
        </section>
    </div>

    <chat-head></chat-head>

    <foot-element></foot-element>
    <script src="../js/header-footer.js"></script>
    <script src="../js/toggle-chat.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>