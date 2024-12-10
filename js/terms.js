// JavaScript for Modal Functionality
const termsLink = document.getElementById('termsLink');
const termsModal = document.getElementById('termsModal');
const closeModal = document.getElementById('closeModal');
const agreeTerms = document.getElementById('agreeTerms');
const submitButton = document.getElementById('submitSignUp');

// Open the modal
termsLink.addEventListener('click', (e) => {
  e.preventDefault(); // Prevent default link behavior
  termsModal.style.display = 'flex';
});

// Close the modal
closeModal.addEventListener('click', () => {
  termsModal.style.display = 'none';
});

// Close modal when clicking outside the modal content
window.addEventListener('click', (e) => {
  if (e.target === termsModal) {
    termsModal.style.display = 'none';
  }
});

// Disable/Enable the submit button based on the checkbox state
agreeTerms.addEventListener('change', () => {
  if (agreeTerms.checked) {
    submitButton.disabled = false; // Enable the submit button
  } else {
    submitButton.disabled = true;  // Disable the submit button
  }
});

// Initial state of the submit button (disabled by default)
submitButton.disabled = true;
