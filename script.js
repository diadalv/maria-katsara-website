const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (!reducedMotion.matches && 'IntersectionObserver' in window) {
  const motionItems = document.querySelectorAll('.paper-section, [data-entrance], .envelope');
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.remove('is-waiting');
      observer.unobserve(entry.target);
    }
  }, { rootMargin: '0px 0px -56px 0px' });

  for (const item of motionItems) {
    if (item.getBoundingClientRect().top >= window.innerHeight) {
      item.classList.add('is-waiting');
      observer.observe(item);
    }
  }

  reducedMotion.addEventListener('change', ({ matches }) => {
    if (!matches) return;
    observer.disconnect();
    for (const item of motionItems) item.classList.remove('is-waiting');
  });
}

const contactEmail = document.querySelector('#contact-email');
const copyStatus = document.querySelector('#copy-status');

if (typeof navigator.clipboard?.writeText === 'function') {
  const emailAddress = contactEmail.textContent.trim();
  const copyButton = document.createElement('button');
  copyButton.type = 'button';
  copyButton.className = 'email-copy';
  copyButton.textContent = emailAddress;
  copyButton.title = 'Αντιγραφή διεύθυνσης email';
  copyButton.setAttribute('aria-label', `Αντιγραφή διεύθυνσης email ${emailAddress}`);
  contactEmail.replaceWith(copyButton);

  let feedbackTimer;
  copyButton.addEventListener('click', async () => {
    clearTimeout(feedbackTimer);
    copyStatus.textContent = '';
    try {
      await navigator.clipboard.writeText(emailAddress);
      copyStatus.lang = 'en';
      copyStatus.textContent = 'copied';
    } catch {
      copyStatus.lang = 'el';
      copyStatus.textContent = 'Δεν έγινε αντιγραφή';
    }
    feedbackTimer = setTimeout(() => {
      copyStatus.textContent = '';
    }, 2600);
  });
}
