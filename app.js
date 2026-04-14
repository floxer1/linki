/* ==========================================
   VIRTUAL PRIME – LANDING PAGE LOGIC
   Gère le modal "Copier / Ouvrir" pour TikTok
   ========================================== */

(function () {
  'use strict';

  const modal = document.getElementById('modal');
  const modalClose = document.getElementById('modal-close');
  const btnCopy = document.getElementById('btn-copy');
  const btnOpen = document.getElementById('btn-open');
  const copiedToast = document.getElementById('copied-toast');
  const copyHint = document.getElementById('copy-hint');

  const tiktokTuto = document.getElementById('tiktok-tuto');

  let currentUrl = '';

  // ---------- Détection navigateur in-app ----------
  function isInAppBrowser() {
    const ua = navigator.userAgent || navigator.vendor || '';
    // TikTok, Instagram, Facebook, Snapchat, Twitter, LINE, WeChat...
    return /tiktok|musical_ly|instagram|fbav|fban|snapchat|twitter|line\//i.test(ua) ||
           // WebView générique Android/iOS
           /wv\)|webview/i.test(ua);
  }

  function isTikTokBrowser() {
    const ua = navigator.userAgent || navigator.vendor || '';
    return /tiktok|musical_ly/i.test(ua);
  }

  // ---------- Ouvrir le modal ----------
  function openModal(url, name) {
    currentUrl = url;
    copiedToast.classList.remove('show');
    copyHint.style.display = '';
    // Afficher le tuto "3 points" si on est dans TikTok
    if (isTikTokBrowser()) {
      tiktokTuto.classList.add('show');
    } else {
      tiktokTuto.classList.remove('show');
    }
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    currentUrl = '';
  }

  // ---------- Copier le lien ----------
  async function copyLink() {
    if (!currentUrl) return;
    try {
      await navigator.clipboard.writeText(currentUrl);
    } catch {
      // Fallback pour les vieux navigateurs / in-app
      const input = document.createElement('input');
      input.value = currentUrl;
      input.style.position = 'fixed';
      input.style.opacity = '0';
      document.body.appendChild(input);
      input.select();
      input.setSelectionRange(0, 99999);
      document.execCommand('copy');
      document.body.removeChild(input);
    }
    copiedToast.classList.add('show');
    copyHint.style.display = 'none';
  }

  // ---------- Ouvrir dans le navigateur ----------
  function openInBrowser() {
    if (!currentUrl) return;

    // Sur Android, intent:// force l'ouverture dans Chrome
    const isAndroid = /android/i.test(navigator.userAgent);
    if (isAndroid) {
      const intentUrl =
        'intent://' +
        currentUrl.replace(/^https?:\/\//, '') +
        '#Intent;scheme=https;end';
      window.location.href = intentUrl;
    } else {
      // iOS et autres : window.open
      window.open(currentUrl, '_blank', 'noopener,noreferrer');
    }
  }

  // ---------- Event listeners ----------

  // Click sur un lien
  document.querySelectorAll('.link-card').forEach(function (card) {
    card.addEventListener('click', function (e) {
      e.preventDefault();
      var url = card.getAttribute('data-url');
      var name = card.getAttribute('data-name');

      if (isInAppBrowser()) {
        // In-app browser (TikTok etc.) → afficher le modal
        openModal(url, name);
      } else {
        // Navigateur normal → ouvrir directement
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    });
  });

  // Boutons du modal
  btnCopy.addEventListener('click', copyLink);
  btnOpen.addEventListener('click', openInBrowser);
  modalClose.addEventListener('click', closeModal);

  // Fermer en cliquant à l'extérieur
  modal.addEventListener('click', function (e) {
    if (e.target === modal) closeModal();
  });

  // Fermer avec Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });
})();
