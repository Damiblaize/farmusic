document.addEventListener("DOMContentLoaded", function () {
  console.log("JS is running after DOM loaded");

  const whitelist = [
    { wallet: '0x123abc...' },
    { wallet: '0x456def...' }
  ];

  const formTitle = document.getElementById('form-title');
  const form = document.getElementById('form');
  const whitelistFields = document.getElementById('whitelist-fields');
  const waitlistFields = document.getElementById('waitlist-fields');
  const msg = document.getElementById('msg');

  function showMessage(text, cls) {
    if (msg) {
      msg.textContent = text;
      msg.className = cls;
    }
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

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      showMessage('', 'note');

      if (whitelistFields && whitelistFields.style.display !== 'none') {
        const walletInput = document.getElementById('wallet');
        const wallet = walletInput?.value.trim();

        if (!wallet) {
          showMessage('Please enter your wallet address.', 'error');
          return;
        }

        const found = whitelist.some(entry =>
          entry.wallet.toLowerCase() === wallet.toLowerCase()
        );

        if (found) {
          showMessage("You're whitelisted! We'll be in touch soon.", 'success');

          walletInput.disabled = true;
          const submitBtn = form.querySelector('button[type="submit"]');
          if (submitBtn) submitBtn.disabled = true;

          return;
        }

        whitelistFields.style.display = 'none';
        if (waitlistFields) waitlistFields.style.display = 'block';
        if (formTitle) formTitle.textContent = 'Join the Waitlist';

        showMessage('', 'note');
        const emailInput = document.getElementById('email');
        if (emailInput) emailInput.value = '';
        return;
      }

      if (waitlistFields && waitlistFields.style.display !== 'none') {
        const emailInput = document.getElementById('email');
        const email = emailInput?.value.trim();

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
  }
});
