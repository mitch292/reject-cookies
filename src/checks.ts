export const checkForOneTrust = (): boolean => !!document.getElementById('onetrust-consent-sdk');
export const checkForTranscend = (): boolean =>
  !!document.getElementById('transcend-consent-manager');
export const checkForCookieBot = (): boolean => !!document.getElementById('CybotCookiebotDialog');
export const checkForUserCentrics = (): boolean =>
  !!document.getElementById('usercentrics-root') ||
  !!document.getElementById('usercentrics-cmp-ui');
export const checkForDidomi = (): boolean =>
  !!document.getElementById('didomi-popup') || !!document.getElementById('didomi-host');
export const checkForTrustArc = (): boolean => !!document.getElementById('truste-consent-track');
export const checkForCookieYes = (): boolean =>
  !!document.querySelector<HTMLDivElement>('.cky-consent-container');
export const checkForDrCookie = (): boolean =>
  !!document.getElementById('dr_cookie_banner_container');
export const checkForUCGDPR = (): boolean => !!document.getElementById('uc-gdpr-notification');
export const checkForCC = (): boolean => !!document.getElementById('cc--main');
export const checkForGeneric = (): boolean => !!document.getElementById('gdpr-banner-container');
export const checkForTrustee = (): boolean => !!document.getElementById('truste-consent-track');
export const checkForCmplz = (): boolean =>
  !!document.getElementById('cmplz-cookiebanner-container');
export const checkForACookie = (): boolean => !!document.getElementById('a-cookie--message');
export const checkForSourcepoint = (): boolean =>
  !!document.querySelector<HTMLDivElement>('[id^="sp_message_container"]');
export const checkForQuantcast = (): boolean =>
  !!document.querySelector<HTMLDivElement>('.qc-cmp-ui-container') ||
  !!document.getElementById('qc-cmp2-container');
export const checkForIubenda = (): boolean => !!document.getElementById('iubenda-cs-banner');
export const checkForFides = (): boolean => !!document.getElementById('fides-banner');
export const checkForDelve = (): boolean =>
  !!document.querySelector<HTMLDivElement>('.delve-cookie-banner');
export const checkForNikeCookie = (): boolean =>
  !!document.querySelector<HTMLDivElement>('[data-testid="cookie-modal-root"]');
export const checkForEbayGDPR = (): boolean => !!document.getElementById('gdpr-banner');
export const checkForFreeChoice = (): boolean =>
  !!document.querySelector<HTMLDivElement>('.fc-consent-root');
export const checkForWixCookieBanner = (): boolean =>
  !!document.querySelector<HTMLDivElement>('[data-hook="consent-banner-root"]');
export const checkForYahooGUCE = (): boolean => !!document.getElementById('consent-page');
export const checkForXCookieBanner = (): boolean =>
  !!document.querySelector<HTMLDivElement>('[data-testid="BottomBar"]');
export const checkForCookieBar = (): boolean =>
  !!document.querySelector<HTMLDivElement>('.js-cookiebar');
export const checkForUniConsent = (): boolean => !!document.getElementById('uniccmp');
export const checkForPopupBox = (): boolean =>
  !!document.querySelector<HTMLDivElement>('#popup-box.popup-box');
export const checkForXHCookiesModal = (): boolean =>
  !!document.querySelector<HTMLDivElement>('[data-role="cookies-modal"]');
export const checkForCookieScript = (): boolean =>
  !!document.getElementById('cookiescript_injected');
export const checkForAWSCCC = (): boolean => !!document.getElementById('awsccc-cb-c');
export const checkForSquarespaceCookie = (): boolean =>
  !!document.querySelector<HTMLElement>('.gdpr-cookie-banner');
export const checkForTermly = (): boolean =>
  !!document.getElementById('termly-code-snippet-support');
export const checkForPornhubCookie = (): boolean =>
  !!document.getElementById('globalCookieBanner') || !!document.getElementById('cookieBanner');
export const checkForCookieConsent = (): boolean =>
  !!document.querySelector<HTMLDivElement>('.cc-window');
