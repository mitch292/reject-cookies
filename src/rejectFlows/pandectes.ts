export const rejectPandectes = () => {
  const host = document.querySelector<HTMLElement>('pandectes-cmp');
  if (!host) {
    return false;
  }

  const shadowRoot = host.shadowRoot;
  if (!shadowRoot) {
    host.remove();
    cleanupPandectes();
    return true;
  }

  const buttons = shadowRoot.querySelectorAll<HTMLButtonElement>('button');
  let clicked = false;
  buttons.forEach(btn => {
    if (!clicked) {
      const text = btn.textContent?.trim().toLowerCase();
      if (
        text === 'reject all' ||
        text === 'decline' ||
        text === 'deny' ||
        text === 'reject' ||
        text === 'deny all'
      ) {
        btn.click();
        clicked = true;
      }
    }
  });
  if (clicked) {
    cleanupPandectes();
    return true;
  }

  // No deny button on the initial notice — click Preferences to open the detail view
  buttons.forEach(btn => {
    if (!clicked) {
      const text = btn.textContent?.trim().toLowerCase();
      if (text === 'preferences' || text === 'settings' || text === 'manage') {
        btn.click();
        clicked = true;
      }
    }
  });
  if (clicked) {
    return false;
  }

  host.remove();
  cleanupPandectes();
  return true;
};

const cleanupPandectes = () => {
  document.documentElement.style.overflow = '';
  document.body.style.overflow = '';
};
