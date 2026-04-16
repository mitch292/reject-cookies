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

  // DR.dk uses a custom CookieBot wrapper with its own buttons
  const drOverlay = document.getElementById('drcc-overlay');
  if (drOverlay) {
    const submitChosenBtn = drOverlay.querySelector<HTMLButtonElement>('button.submitChosen');
    if (submitChosenBtn) {
      submitChosenBtn.click();
      drOverlay.remove();
      document.body.classList.remove('noscroll');
      document.body.style.overflow = '';
      return true;
    }
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

// Sourcepoint renders consent UI inside a cross-origin iframe,
// so we cannot click buttons and instead remove the container.
export const closeSourcepoint = () => {
  const containers = document.querySelectorAll<HTMLDivElement>('[id^="sp_message_container"]');
  if (containers.length === 0) {
    return false;
  }
  containers.forEach(container => container.remove());
  document.documentElement.classList.remove('sp-message-open');
  document.body.style.overflow = '';
  return true;
};

export const closeOrRejectQuantcast = () => {
  // Quantcast CMP v2
  const container = document.getElementById('qc-cmp2-container');
  if (container) {
    const rejectBtn = container.querySelector<HTMLButtonElement>('[class*="reject"]');
    if (rejectBtn) {
      rejectBtn.click();
      return true;
    }

    // Try the disagree button by its stable ID (works across all languages)
    const disagreeBtn = document.getElementById('disagree-btn') as HTMLButtonElement | null;
    if (disagreeBtn) {
      disagreeBtn.click();
      return true;
    }

    // Find the DISAGREE button by text content among secondary buttons
    const secondaryBtns = container.querySelectorAll<HTMLButtonElement>('button[mode="secondary"]');
    let clicked = false;
    secondaryBtns.forEach(btn => {
      if (!clicked) {
        const text = btn.textContent?.trim().toUpperCase();
        if (text === 'DISAGREE' || text === 'REJECT ALL' || text === 'DENY') {
          btn.click();
          clicked = true;
        }
      }
    });
    if (clicked) {
      return true;
    }

    container.remove();
    return true;
  }

  // Quantcast CMP v1
  const v1Container = document.querySelector<HTMLDivElement>('.qc-cmp-ui-container');
  if (v1Container) {
    v1Container.remove();
    return true;
  }

  return false;
};

export const closeOrRejectIubenda = () => {
  const banner = document.getElementById('iubenda-cs-banner');
  if (!banner) {
    return false;
  }

  const rejectBtn = banner.querySelector<HTMLButtonElement>('.iubenda-cs-reject-btn');
  if (rejectBtn) {
    rejectBtn.click();
    return true;
  }

  // Adasta wrapper strips .iubenda-cs-reject-btn and replaces it with
  // .adasta-show-second-page. Clicking it opens an overlay that contains
  // the real .iubenda-cs-reject-btn on the next retry pass.
  const adastaBtn = banner.querySelector<HTMLButtonElement>('.adasta-show-second-page');
  if (adastaBtn) {
    adastaBtn.click();
    return false;
  }

  // Check for the Adasta overlay reject button (appears after first click)
  const adastaRejectBtn = document.querySelector<HTMLButtonElement>('.adasta-reject-button');
  if (adastaRejectBtn) {
    adastaRejectBtn.click();
    return true;
  }

  banner.remove();
  return true;
};

export const closeOrRejectFides = () => {
  const banner = document.getElementById('fides-banner');
  if (!banner) {
    return false;
  }

  const rejectBtn = document.getElementById('fides-reject-all-button');
  if (rejectBtn) {
    rejectBtn.click();
    cleanupFidesOverlay();
    return true;
  }

  const bannerContainer = document.getElementById('fides-banner-container');
  if (bannerContainer) {
    bannerContainer.remove();
  } else {
    banner.remove();
  }
  cleanupFidesOverlay();
  return true;
};

const cleanupFidesOverlay = () => {
  const overlay = document.getElementById('fides-overlay');
  if (overlay) {
    overlay.remove();
  }
  document.body.style.overflow = '';
};

export const closeOrRejectDelve = () => {
  const banner = document.querySelector<HTMLDivElement>('.delve-cookie-banner');
  if (!banner) {
    return false;
  }

  const rejectBtn = banner.querySelector<HTMLButtonElement>('button[data-action="reject"]');
  if (rejectBtn) {
    rejectBtn.click();
    return true;
  }

  banner.remove();
  return true;
};

export const closeOrRejectNikeCookie = () => {
  const modal = document.querySelector<HTMLDivElement>('[data-testid="cookie-modal-root"]');
  if (!modal) {
    return false;
  }

  const declineBtn = modal.querySelector<HTMLButtonElement>(
    'button[data-testid="modal-decline-button"]'
  );
  if (declineBtn) {
    declineBtn.click();
    cleanupNikeCookieOverlay();
    return true;
  }

  modal.remove();
  cleanupNikeCookieOverlay();
  return true;
};

const cleanupNikeCookieOverlay = () => {
  const backdrop = document.querySelector<HTMLDivElement>('[data-testid="modal-backdrop"]');
  if (backdrop) {
    backdrop.remove();
  }
  document.body.style.overflow = '';
};

export const closeOrRejectEbayGDPR = () => {
  const banner = document.getElementById('gdpr-banner');
  if (!banner) {
    return false;
  }

  const declineBtn = document.getElementById('gdpr-banner-decline');
  if (declineBtn) {
    declineBtn.click();
    return true;
  }

  banner.remove();
  return true;
};

export const closeOrRejectFreeChoice = () => {
  const root = document.querySelector<HTMLDivElement>('.fc-consent-root');
  if (!root) {
    return false;
  }

  root.remove();
  const overlay = document.querySelector<HTMLDivElement>('.fc-dialog-overlay');
  if (overlay) {
    overlay.remove();
  }
  document.body.style.overflow = '';
  return true;
};

export const closeOrRejectWixCookieBanner = () => {
  const banner = document.querySelector<HTMLDivElement>('[data-hook="consent-banner-root"]');
  if (!banner) {
    return false;
  }

  const closeBtn = banner.querySelector<HTMLButtonElement>(
    '[data-hook="consent-banner-close-button"]'
  );
  if (closeBtn) {
    closeBtn.click();
    return true;
  }

  banner.remove();
  return true;
};

export const closeOrRejectYahooGUCE = () => {
  const page = document.getElementById('consent-page');
  if (!page) {
    return false;
  }

  const rejectBtn = page.querySelector<HTMLButtonElement>('button[name="reject"]');
  if (rejectBtn) {
    rejectBtn.click();
    return true;
  }

  const rejectAllBtn = page.querySelector<HTMLButtonElement>('.reject-all');
  if (rejectAllBtn) {
    rejectAllBtn.click();
    return true;
  }

  page.remove();
  const overlay = document.querySelector<HTMLDivElement>('.consent-overlay');
  if (overlay) {
    overlay.remove();
  }
  document.body.style.overflow = '';
  return true;
};

export const closeOrRejectXCookieBanner = () => {
  const bottomBar = document.querySelector<HTMLDivElement>('[data-testid="BottomBar"]');
  if (!bottomBar) {
    return false;
  }

  const buttons = bottomBar.querySelectorAll<HTMLButtonElement>('button[role="button"]');
  let clicked = false;
  buttons.forEach(btn => {
    if (!clicked && btn.textContent?.includes('Refuse non-essential')) {
      btn.click();
      clicked = true;
    }
  });
  if (clicked) {
    return true;
  }

  bottomBar.remove();
  return true;
};

export const closeOrRejectCookieBar = () => {
  const banner = document.querySelector<HTMLDivElement>('.js-cookiebar');
  if (!banner) {
    return false;
  }

  const rejectBtn = banner.querySelector<HTMLButtonElement>('.js-cookie-deny');
  if (rejectBtn) {
    rejectBtn.click();
    return true;
  }

  banner.remove();
  return true;
};

export const closeOrRejectUniConsent = () => {
  const banner = document.getElementById('uniccmp');
  if (!banner) {
    return false;
  }

  banner.remove();
  document.body.style.overflow = '';
  return true;
};

export const closeOrRejectPopupBox = () => {
  const popup = document.querySelector<HTMLDivElement>('#popup-box.popup-box');
  if (!popup) {
    return false;
  }

  const refuseBtn = popup.querySelector<HTMLButtonElement>('button[onclick*="refuse"]');
  if (refuseBtn) {
    refuseBtn.click();
    return true;
  }

  popup.remove();
  return true;
};

export const closeOrRejectXHCookiesModal = () => {
  const modal = document.querySelector<HTMLDivElement>('[data-role="cookies-modal"]');
  if (!modal) {
    return false;
  }

  const closeBtn = modal.querySelector<HTMLButtonElement>('button');
  if (closeBtn) {
    closeBtn.click();
    document.body.classList.remove('xh-scroll-disabled');
    return true;
  }

  modal.remove();
  document.body.classList.remove('xh-scroll-disabled');
  return true;
};

export const rejectCookieScript = () => {
  const banner = document.getElementById('cookiescript_injected');
  if (!banner) {
    return false;
  }

  const rejectBtn = document.getElementById('cookiescript_reject');
  if (rejectBtn) {
    rejectBtn.click();
    document.body.classList.remove('cookiescript_overlay');
    document.body.style.overflow = '';
    return true;
  }

  const wrapper = document.getElementById('cookiescript_injected_wrapper');
  if (wrapper) {
    wrapper.remove();
  } else {
    banner.remove();
  }
  document.body.classList.remove('cookiescript_overlay');
  document.body.style.overflow = '';
  return true;
};

export const rejectAWSCCC = () => {
  const banner = document.getElementById('awsccc-cb-c');
  if (!banner) {
    return false;
  }

  const declineBtn = document.getElementById('awsccc-cb-btn-decline');
  if (declineBtn) {
    declineBtn.click();
    return true;
  }

  banner.remove();
  return true;
};

export const closeOrRejectSquarespaceCookie = () => {
  const banner = document.querySelector<HTMLElement>('.gdpr-cookie-banner');
  if (!banner) {
    return false;
  }

  const declineBtn = banner.querySelector<HTMLButtonElement>('button.sqs-cookie-banner-v2-deny');
  if (declineBtn) {
    declineBtn.click();
    return true;
  }

  banner.remove();
  return true;
};

export const rejectTermly = () => {
  const container = document.getElementById('termly-code-snippet-support');
  if (!container) {
    return false;
  }

  const declineBtn = container.querySelector<HTMLButtonElement>('[data-tid="banner-decline"]');
  if (declineBtn) {
    declineBtn.click();
    return true;
  }

  const prompt = container.querySelector<HTMLElement>('.t-consentPrompt');
  if (prompt) {
    prompt.remove();
    return true;
  }

  return false;
};

export const closeOrRejectCookieConsent = () => {
  const banner = document.querySelector<HTMLDivElement>('.cc-window');
  if (!banner) {
    return false;
  }

  const denyBtn = banner.querySelector<HTMLButtonElement>('.cc-btn.cc-deny');
  if (denyBtn) {
    denyBtn.click();
    return true;
  }

  banner.remove();
  return true;
};

export const closeOrRejectPornhubCookie = () => {
  // Full cookie banner with reject option
  const fullBanner = document.getElementById('cookieBanner');
  if (fullBanner && !fullBanner.classList.contains('hidden')) {
    const rejectBtn = fullBanner.querySelector<HTMLButtonElement>('.cbSecondaryCTA');
    if (rejectBtn) {
      rejectBtn.click();
      return true;
    }
    const closeBtn = fullBanner.querySelector<HTMLButtonElement>('.cbCloseButton');
    if (closeBtn) {
      closeBtn.click();
      return true;
    }
  }

  // Global cookie banner — no reject button, click customize to open full banner
  const globalBanner = document.getElementById('globalCookieBanner');
  if (globalBanner && !globalBanner.classList.contains('hidden')) {
    const customizeBtn = globalBanner.querySelector<HTMLButtonElement>(
      '.js-customizeGlobalCookies'
    );
    if (customizeBtn) {
      customizeBtn.click();
      return false;
    }
    const closeBtn = globalBanner.querySelector<HTMLButtonElement>('.js-closeGlobalBanner');
    if (closeBtn) {
      closeBtn.click();
      return true;
    }
  }

  return false;
};
