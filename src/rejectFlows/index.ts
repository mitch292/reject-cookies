import {
  rejectUserCentricsPrimaryFlow,
  rejectUserCentricsSecondaryFlow,
  rejectUserCentricsTertiaryFlow,
} from './userCentrics';

export const closeOrRejectOneTrust = () => {
  const rejectButton = document.getElementById('onetrust-reject-all-handler');
  if (rejectButton) {
    rejectButton.click();
    cleanupOneTrustOverlay();
    return true;
  }

  const consentSDK = document.getElementById('onetrust-consent-sdk');
  if (consentSDK) {
    consentSDK.remove();
    cleanupOneTrustOverlay();
    return true;
  }
  return false;
};

const cleanupOneTrustOverlay = () => {
  const overlay = document.querySelector<HTMLDivElement>('.onetrust-pc-dark-filter');
  if (overlay) {
    overlay.remove();
  }
  document.body.classList.remove('ot-overflow-hidden');
  document.body.style.overflow = '';
};

// transcend is running their popup in a shadow DOM,
// so we cannot reject it and instead opt to remove the element.
export const closeTranscend = () => {
  const popUp = document.getElementById('transcend-consent-manager');
  if (!popUp) {
    return false;
  }
  popUp.remove();
  return true;
};

export const rejectCookieBot = () => {
  const popUp = document.getElementById('CybotCookiebotDialog');
  if (!popUp) {
    return false;
  }
  const rejectButton = document.getElementById('CybotCookiebotDialogBodyButtonDecline');
  if (rejectButton) {
    rejectButton.click();
    return true;
  }
  return false;
};

// UserCentrics is running their popup in a shadow DOM, that is open
export const rejectUserCentrics = () => {
  let rejected = rejectUserCentricsPrimaryFlow();
  if (rejected) {
    return true;
  }
  rejected = rejectUserCentricsSecondaryFlow();
  if (rejected) {
    return true;
  }
  return rejectUserCentricsTertiaryFlow();
};

export const rejectOrCloseUCGDPR = () => {
  const popup = document.getElementById('uc-gdpr-notification');
  if (!popup) {
    return false;
  }

  const rejectBtn = document.getElementById('uc-reject-gdpr');
  if (rejectBtn) {
    rejectBtn.click();
    return true;
  }
  popup.remove();
  return true;
};

export const closeOrRejectDidomi = () => {
  const popUp = document.getElementById('didomi-popup');
  if (!popUp) {
    //if not in the popup flow, check the footer
    const footer = document.getElementById('didomi-host');
    if (footer) {
      footer.remove();
      return true;
    }
    return false;
  }

  // First check for the reject span with a button role
  const rejectSpan = popUp.querySelector<HTMLSpanElement>('.didomi-continue-without-agreeing');
  if (rejectSpan) {
    rejectSpan.click();
    return true;
  }
  // Second check for the reject button with a button role
  const rejectButton = popUp.querySelector<HTMLButtonElement>('#didomi-notice-disagree-button');
  if (rejectButton) {
    rejectButton.click();
    return true;
  }

  return false;
};

export const closeOrRejectTrustArc = () => {
  const declineAllBtn = document.getElementById('truste-consent-required');
  if (declineAllBtn) {
    declineAllBtn.click();
    return true;
  }
  const popUp = document.getElementById('truste-consent-track');
  if (popUp) {
    popUp.remove();
    return true;
  }
  return false;
};

export const closeOrRejectCookieYes = () => {
  const rejectButton =
    document.querySelector<HTMLButtonElement>('[data-cky-tag="reject-button"]') ||
    document.querySelector<HTMLButtonElement>('.cky-btn-reject');
  if (rejectButton) {
    rejectButton.click();
    cleanupCookieYesOverlay();
    return true;
  }
  const banner = document.querySelector<HTMLDivElement>('.cky-consent-container');
  if (banner) {
    banner.remove();
    cleanupCookieYesOverlay();
    return true;
  }
  return false;
};

const cleanupCookieYesOverlay = () => {
  const overlay = document.querySelector<HTMLDivElement>('.cky-overlay');
  if (overlay) {
    overlay.remove();
  }
};

export const closeOrRejectDrCookie = () => {
  const rejectbtn = document.getElementById('cc-deny-01');
  if (rejectbtn) {
    rejectbtn.click();
    return true;
  }
  return false;
};

export const closeOrRejectCC = () => {
  const rejectButton = document.getElementById('c-s-bn');
  if (rejectButton) {
    rejectButton.click();
    return true;
  }
  const popUp = document.getElementById('cc--main');
  if (popUp) {
    popUp.remove();
    return true;
  }
  return false;
};

export const closeOrRejectGeneric = () => {
  const rejectBtn = document.querySelector<HTMLButtonElement>(
    '[data-testid="gdpr-banner-decline-button"]'
  );
  if (rejectBtn) {
    rejectBtn.click();
    return true;
  }
  const popUp = document.getElementById('gdpr-banner-container');
  if (popUp) {
    popUp.remove();
    return true;
  }
  return false;
};

export const closeOrRejectTrustee = () => {
  const popUp = document.getElementById('truste-consent-track');
  if (popUp) {
    popUp.remove();
    return true;
  }
  return false;
};

export const closeOrRejectCmplz = () => {
  const rejectButton = document.querySelector<HTMLButtonElement>('.cmplz-deny');
  if (rejectButton) {
    rejectButton.click();
    return true;
  }
  const popUp = document.getElementById('cmplz-cookiebanner-container');
  if (popUp) {
    popUp.remove();
    return true;
  }
  return false;
};

export const closeOrRejectACookie = () => {
  const rejectButton = document.getElementById('a-cookie--confirmation-reject');
  if (rejectButton) {
    rejectButton.click();
    return true;
  }

  const popUp = document.querySelector<HTMLDivElement>('.a-cookie');
  if (popUp) {
    popUp.remove();
    return true;
  }
  return false;
};
