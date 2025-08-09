
form.addEventListener('submit', e => {
  e.preventDefault();
  console.log('Form submitted!');
  // rest of your code...
});






const whitelist = [
  { wallet: '0x123abc...', handle: 'farcaster/alice' },
  { wallet: '0x456def...', handle: 'farcaster/bob' }
];

const formTitle = document.getElementById('form-title');
const form = document.getElementById('form');
const whitelistFields = document.getElementById('whitelist-fields');
const waitlistFields = document.getElementById('waitlist-fields');
const msg = document.getElementById('msg');

function showMessage(text, cls) {
  msg.textContent = text;
  msg.className = cls;
}

function sendWaitlistEmail(email) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.9) {
        resolve({ status: 'ok' });
      } else {
        reject(new Error('Network error. Please try again.'));
      }
    }, 1000);
  });
}

form.addEventListener('submit', e => {
  e.preventDefault();
  showMessage('', 'note');

  if (whitelistFields.style.display !== 'none') {
    const wallet = document.getElementById('wallet').value.trim();
    const handle = document.getElementById('handle').value.trim();

    if (!wallet || !handle) {
      showMessage('Please fill in both wallet address and Farcaster handle.', 'error');
      return;
    }

    const found = whitelist.some(entry => 
      entry.wallet.toLowerCase() === wallet.toLowerCase() &&
      entry.handle.toLowerCase() === handle.toLowerCase()
    );

    if (found) {
      showMessage("You're whitelisted! We'll be in touch soon.", 'success');

      // Disable inputs and submit button on success
      document.getElementById('wallet').disabled = true;
      document.getElementById('handle').disabled = true;
      form.querySelector('button[type="submit"]').disabled = true;

      return;
    }

    whitelistFields.style.display = 'none';
    waitlistFields.style.display = 'block';
    formTitle.textContent = 'Join the Waitlist';

    // Clear previous messages and reset email field
    showMessage('', 'note');
    document.getElementById('email').value = '';
    return;
  }

  if (waitlistFields.style.display !== 'none') {
    const email = document.getElementById('email').value.trim();

    if (!email) {
      showMessage('Please enter your email address.', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showMessage('Please enter a valid email address.', 'error');
      return;
    }

    showMessage('Submitting...', 'note');

    sendWaitlistEmail(email)
      .then(() => {
        showMessage('Thanks! We’ll reach out via email.', 'success');
        form.reset();
      })
      .catch(err => {
        showMessage(err.message, 'error');
      });
  }
});
