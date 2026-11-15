import { commonCookiePopupChecks } from './providers';

// Async-loaded CMPs (e.g. Cookiebot via GTM) can render several seconds after load, so keep
// polling for ~10s instead of ~3s
const MAX_ATTEMPTS = 20;
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
