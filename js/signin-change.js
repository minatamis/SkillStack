const signupForm = document.querySelector('.signup-form');
const loginForm = document.querySelector('.login-form');
const registerButtons = document.querySelectorAll('.sign');
const loginButtons = document.querySelectorAll('.log');

registerButtons.forEach(button => {
    button.addEventListener('click', () => {
        signupForm.style.display = 'flex';
        loginForm.style.display = 'none';
    });
});

loginButtons.forEach(button => {
    button.addEventListener('click', () => {
        loginForm.style.display = 'flex';
        signupForm.style.display = 'none';
    });
});
