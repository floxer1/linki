/* ==========================================
   MES JOBS EN LIGNE – LANDING PAGE LOGIC
   Gère le modal "Copier / Ouvrir" pour les navigateurs in-app (TikTok...)
   ========================================== */

(function () {
  'use strict';

  var modal = document.getElementById('modal');
  var modalClose = document.getElementById('modal-close');
  var modalIcon = document.getElementById('modal-icon');
  var modalTitle = document.getElementById('modal-title');
  var btnCopy = document.getElementById('btn-copy');
  var btnOpen = document.getElementById('btn-open');
  var copiedToast = document.getElementById('copied-toast');
  var copyHint = document.getElementById('copy-hint');
  var tiktokTuto = document.getElementById('tiktok-tuto');

  var currentUrl = '';

  // ---------- Validation des liens ----------
  // Un lien est "prêt" s'il commence par http(s) et ne contient plus de marqueur REMPLACER_
  function isConfiguredUrl(url) {
    return /^https?:\/\//i.test(url) && !/REMPLACER_/i.test(url);
  }

  // ---------- Détection navigateur in-app ----------
  function isInAppBrowser() {
    var ua = navigator.userAgent || navigator.vendor || '';
    // TikTok, Instagram, Facebook, Snapchat, Twitter, LINE...
    return /tiktok|musical_ly|instagram|fbav|fban|snapchat|twitter|line\//i.test(ua) ||
           // WebView générique Android/iOS
           /wv\)|webview/i.test(ua);
  }

  function isTikTokBrowser() {
    var ua = navigator.userAgent || navigator.vendor || '';
    return /tiktok|musical_ly/i.test(ua);
  }

  // ---------- Modal ----------
  function openModal(url, name, iconEl) {
    currentUrl = url;
    copiedToast.classList.remove('show');
    copyHint.style.display = '';

    // Reprend le logo du bouton cliqué
    modalIcon.textContent = '';
    if (iconEl) modalIcon.appendChild(iconEl.cloneNode(true));
    modalTitle.textContent = name ? 'Ouvrir\u00a0: ' + name : 'Ouvrir le lien';

    // Tuto "3 points" uniquement dans TikTok
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
  function copyLink() {
    if (!currentUrl) return;

    function done() {
      copiedToast.classList.add('show');
      copyHint.style.display = 'none';
    }

    function fallback() {
      var input = document.createElement('input');
      input.value = currentUrl;
      input.style.position = 'fixed';
      input.style.opacity = '0';
      document.body.appendChild(input);
      input.select();
      input.setSelectionRange(0, 99999);
      try { document.execCommand('copy'); } catch (e) { /* ignore */ }
      document.body.removeChild(input);
      done();
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(currentUrl).then(done, fallback);
    } else {
      fallback();
    }
  }

  // ---------- Ouvrir dans le navigateur ----------
  function openInBrowser() {
    if (!currentUrl) return;

    // Sur Android, intent:// force l'ouverture dans Chrome
    var isAndroid = /android/i.test(navigator.userAgent);
    if (isAndroid) {
      var intentUrl =
        'intent://' +
        currentUrl.replace(/^https?:\/\//, '') +
        '#Intent;scheme=https;end';
      window.location.href = intentUrl;
    } else {
      window.open(currentUrl, '_blank', 'noopener,noreferrer');
    }
  }

  // ---------- Event listeners ----------
  document.querySelectorAll('.link-card').forEach(function (card) {
    var url = card.getAttribute('data-url') || '';

    // Lien pas encore configuré → carte inactive + avertissement en console
    if (!isConfiguredUrl(url)) {
      card.setAttribute('aria-disabled', 'true');
      console.warn('[Mes Jobs en Ligne] Lien non configuré pour "' +
        card.getAttribute('data-name') + '" : ' + url);
    }

    card.addEventListener('click', function (e) {
      e.preventDefault();
      if (!isConfiguredUrl(url)) return;

      var name = card.getAttribute('data-name');
      var iconEl = card.querySelector('.btn-ico');

      if (isInAppBrowser()) {
        openModal(url, name, iconEl);
      } else {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    });
  });

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
