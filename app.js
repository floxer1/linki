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

  // ---------- Particles Network Animation ----------
  function initParticleNetwork() {
    var canvas = document.getElementById('particles-canvas');
    var ctx = canvas.getContext('2d');
    var particles = [];
    var particleCount = 55;
    var connectionDistance = 150;

    // Set canvas size
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle object
    function Particle(x, y) {
      this.x = x;
      this.y = y;
      this.vx = (Math.random() - 0.5) * 0.005;
      this.vy = (Math.random() - 0.5) * 0.02;
      this.size = Math.random() * 1 + 0.35;
      this.color = Math.random() > 0.5 ? 'rgba(124, 58, 237, 0.28)' : 'rgba(6, 182, 212, 0.28)';
    }

    Particle.prototype.update = function() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.0008; // gravity
      this.vx *= 0.995;
      this.vy *= 0.995;

      // Bounce/wrap around
      if (this.y > canvas.height) {
        this.y = -10;
        this.x = Math.random() * canvas.width;
      }
      if (this.x < 0) this.x = canvas.width;
      if (this.x > canvas.width) this.x = 0;
    };

    Particle.prototype.draw = function() {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    };

    // Create particles
    for (var i = 0; i < particleCount; i++) {
      particles.push(new Particle(
        Math.random() * canvas.width,
        Math.random() * canvas.height
      ));
    }

    // Draw connections
    function drawConnections() {
      for (var i = 0; i < particles.length; i++) {
        for (var j = i + 1; j < particles.length; j++) {
          var p1 = particles[i];
          var p2 = particles[j];
          var dx = p1.x - p2.x;
          var dy = p1.y - p2.y;
          var distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            var opacity = (1 - distance / connectionDistance) * 0.18;
            ctx.strokeStyle = 'rgba(124, 58, 237, ' + opacity + ')';
            ctx.lineWidth = 0.4;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
    }

    function applyRepulsion() {
      var repelDistance = 50;
      var repelStrength = 0.008;

      for (var i = 0; i < particles.length; i++) {
        for (var j = i + 1; j < particles.length; j++) {
          var p1 = particles[i];
          var p2 = particles[j];
          var dx = p1.x - p2.x;
          var dy = p1.y - p2.y;
          var distance = Math.sqrt(dx * dx + dy * dy);

          if (distance > 0 && distance < repelDistance) {
            var force = (repelDistance - distance) / repelDistance * repelStrength;
            var nx = dx / distance;
            var ny = dy / distance;
            p1.vx += nx * force;
            p1.vy += ny * force;
            p2.vx -= nx * force;
            p2.vy -= ny * force;
          }
        }
      }
    }

    // Animation loop
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Apply repulsion before updating particles
      applyRepulsion();

      // Update and draw particles
      for (var i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }

      // Draw connections
      drawConnections();

      requestAnimationFrame(animate);
    }

    animate();
  }

  // Initialize particle network on load
  initParticleNetwork();
})();
