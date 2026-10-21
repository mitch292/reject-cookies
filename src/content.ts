import { commonCookiePopupChecks } from './providers';

const MAX_ATTEMPTS = 5;
let currentAttempt = 0;

// Function to find and click reject buttons
const findAndClickRejectButtons = () => {
  if (currentAttempt > MAX_ATTEMPTS) {
    return;
  }

  commonCookiePopupChecks.forEach(provider => {
    if (provider.check() && !provider.successful) {
      // Store the result on the provider itself so a successful reject is not repeated every tick
      provider.successful = provider.rejectOrClose();
      // assume that there is only one cookie consent provider and we can exit
      return;
    }
  });

  currentAttempt++;
};

// Run the functions when the page loads
document.addEventListener('DOMContentLoaded', () => {
  findAndClickRejectButtons();
});

// Also run periodically to catch dynamically loaded popups
setInterval(() => {
  findAndClickRejectButtons();
}, 501);
