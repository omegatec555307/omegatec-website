/**
 * Omegatec Computers Sdn. Bhd.
 * Enhanced Interactive Animations & Accessible UI Controller
 * Built with UI/UX Pro Max Design Intelligence (WCAG 2.1 AA / 2.2 Compliant)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Check user's motion preference (WCAG 2.2.2 & 2.3.3)
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // =========================================================================
  // 1. Unified Mobile Navigation Drawer (with Accessible Focus Trap)
  // =========================================================================
  const hamburger = document.querySelector('.hamburger');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  const drawerOverlay = document.querySelector('.drawer-overlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  let previouslyFocusedElement = null;

  function getDrawerFocusableElements() {
    if (!mobileDrawer) return [];
    return Array.from(mobileDrawer.querySelectorAll('a, button, input, textarea, [tabindex]:not([tabindex="-1"])'))
      .filter(el => !el.hasAttribute('disabled') && el.offsetParent !== null);
  }

  function openDrawer() {
    if (!hamburger || !mobileDrawer) return;
    previouslyFocusedElement = document.activeElement;
    hamburger.classList.add('is-active');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileDrawer.classList.add('is-active');
    drawerOverlay?.classList.add('is-active');
    document.body.style.overflow = 'hidden';

    // Move focus to first element in drawer
    const focusable = getDrawerFocusableElements();
    if (focusable.length > 0) {
      setTimeout(() => focusable[0].focus(), 50);
    }
  }

  function closeDrawer() {
    if (!hamburger || !mobileDrawer) return;
    hamburger.classList.remove('is-active');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileDrawer.classList.remove('is-active');
    drawerOverlay?.classList.remove('is-active');
    document.body.style.overflow = '';

    // Restore focus back to hamburger trigger
    if (previouslyFocusedElement && typeof previouslyFocusedElement.focus === 'function') {
      previouslyFocusedElement.focus();
    }
  }

  if (hamburger && mobileDrawer) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.contains('is-active');
      if (isOpen) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    drawerOverlay?.addEventListener('click', closeDrawer);

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', closeDrawer);
    });

    document.addEventListener('keydown', (e) => {
      if (!mobileDrawer.classList.contains('is-active')) return;

      // Close on Escape key
      if (e.key === 'Escape') {
        closeDrawer();
        return;
      }

      // Accessible Focus Trap inside Drawer
      if (e.key === 'Tab') {
        const focusables = getDrawerFocusableElements();
        if (focusables.length === 0) return;

        const firstElement = focusables[0];
        const lastElement = focusables[focusables.length - 1];

        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    });
  }

  // =========================================================================
  // 2. Header Scroll Elevation, Back-to-Top & WhatsApp FAB Scroll Logic
  // =========================================================================
  const siteHeader = document.querySelector('.site-header');
  const backToTopBtn = document.querySelector('.btn-back-to-top');
  const whatsappFab = document.querySelector('.whatsapp-fab');
  const heroSection = document.querySelector('.hero-section');

  function handleScroll() {
    const scrollY = window.scrollY || window.pageYOffset;

    // Header compaction
    if (siteHeader) {
      if (scrollY > 50) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }

    // Back to top visibility
    if (backToTopBtn) {
      if (scrollY > 400) {
        backToTopBtn.classList.add('is-visible');
      } else {
        backToTopBtn.classList.remove('is-visible');
      }
    }

    // WhatsApp FAB visibility: appears when scrolled below the hero section
    if (whatsappFab) {
      const heroThreshold = heroSection ? (heroSection.offsetTop + heroSection.offsetHeight - 120) : 450;
      if (scrollY > heroThreshold) {
        whatsappFab.classList.add('is-visible');
      } else {
        whatsappFab.classList.remove('is-visible');
      }
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  backToTopBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth'
    });
  });

  // =========================================================================
  // 3. Animated Stat Counters (Reduced-Motion Aware)
  // =========================================================================
  const statNumbers = document.querySelectorAll('.stat-count');
  let statsAnimated = false;

  function animateCounters() {
    if (statsAnimated) return;
    statsAnimated = true;

    statNumbers.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      if (isNaN(target)) return;

      // If user prefers reduced motion, render immediately without interval
      if (prefersReducedMotion) {
        counter.textContent = target;
        return;
      }

      const duration = 1800; // ms
      const frameDuration = 1000 / 60;
      const totalFrames = Math.round(duration / frameDuration);
      let frame = 0;

      const timer = setInterval(() => {
        frame++;
        // Ease-out cubic progress
        const progress = frame / totalFrames;
        const currentCount = Math.round(target * (1 - Math.pow(1 - progress, 3)));

        counter.textContent = currentCount;

        if (frame >= totalFrames) {
          counter.textContent = target;
          clearInterval(timer);
        }
      }, frameDuration);
    });
  }

  const statsSection = document.querySelector('.stats-banner');
  if (statsSection && 'IntersectionObserver' in window && !prefersReducedMotion) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });

    statsObserver.observe(statsSection);
  } else {
    // Fallback or immediate load under reduced motion
    animateCounters();
  }

  // =========================================================================
  // 4. Staggered Scroll-Reveal Observer (Progressive Enhancement)
  // =========================================================================
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('is-visible'));
  }

  // =========================================================================
  // 5. Infinite Marquee & Accessible Pause/Resume Controls (WCAG 2.2.2)
  // =========================================================================
  const marqueeTrack = document.querySelector('.marquee-track');
  const marqueeToggleBtn = document.querySelector('.marquee-toggle-btn');

  if (marqueeTrack && !prefersReducedMotion) {
    // Clone children to ensure seamless continuous CSS animation
    const trackChildren = Array.from(marqueeTrack.children);
    trackChildren.forEach(child => {
      const clone = child.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      // Remove tabindex on cloned links/cards to avoid double keyboard tab stops
      clone.removeAttribute('tabindex');
      marqueeTrack.appendChild(clone);
    });
  }

  if (marqueeToggleBtn && marqueeTrack) {
    marqueeToggleBtn.addEventListener('click', () => {
      const isPaused = marqueeTrack.classList.toggle('is-paused');
      marqueeToggleBtn.setAttribute('aria-pressed', isPaused ? 'true' : 'false');
      
      const toggleText = marqueeToggleBtn.querySelector('.toggle-text');
      const toggleIcon = marqueeToggleBtn.querySelector('.toggle-icon');

      if (isPaused) {
        if (toggleText) toggleText.textContent = 'Resume Ticker';
        if (toggleIcon) {
          // Play icon SVG
          toggleIcon.innerHTML = '<polygon points="5 3 19 12 5 21 5 3" fill="currentColor"></polygon>';
        }
      } else {
        if (toggleText) toggleText.textContent = 'Pause Ticker';
        if (toggleIcon) {
          // Pause icon SVG
          toggleIcon.innerHTML = '<rect x="6" y="4" width="4" height="16" fill="currentColor"></rect><rect x="14" y="4" width="4" height="16" fill="currentColor"></rect>';
        }
      }
    });
  }

  // =========================================================================
  // 6. Active Nav Highlighting on Scroll
  // =========================================================================
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveNav() {
    const scrollPos = (window.scrollY || window.pageYOffset) + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  // =========================================================================
  // 7. Direct Email Submission via FormSubmit.co AJAX (Accessible Feedback)
  // =========================================================================
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  function announceStatus(message, type = 'info') {
    if (!formStatus) return;
    formStatus.textContent = message;
    formStatus.className = `form-status is-visible is-${type}`;
    formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Trigger HTML5 validation UI if invalid
      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnHtml = submitBtn ? submitBtn.innerHTML : 'Submit Message';

      // Set accessible loading state
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg style="animation: spin 1s linear infinite; width: 18px; height: 18px; display: inline-block; vertical-align: middle; margin-right: 8px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
            <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
          </svg> Sending inquiry...`;
      }
      announceStatus('Sending your message, please wait...', 'info');

      const formData = new FormData(contactForm);

      try {
        const response = await fetch('https://formsubmit.co/ajax/sales@omegatec.com.my', {
          method: 'POST',
          headers: {
            'Accept': 'application/json'
          },
          body: formData
        });

        if (response.ok) {
          announceStatus('Thank you! Your message has been sent successfully.', 'success');
          setTimeout(() => {
            window.location.href = 'thank-you.html';
          }, 800);
        } else {
          const result = await response.json().catch(() => ({}));
          throw new Error(result.message || 'Submission failed');
        }
      } catch (err) {
        console.error('AJAX form submission error, falling back to native POST:', err);
        announceStatus('Connecting to secure submission gateway...', 'info');
        contactForm.removeAttribute('onsubmit');
        contactForm.submit();
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHtml;
        }
      }
    });
  }

  // =========================================================================
  // 8. Top Announcement Bar (Dismissal & LocalStorage Persistence)
  // =========================================================================
  const announcementBar = document.getElementById('top-announcement');
  const announcementCloseBtn = document.getElementById('announcement-close-btn');
  const ANNOUNCEMENT_STORAGE_KEY = 'omegatec_promo_dismissed_v1';

  // Check saved state
  if (localStorage.getItem(ANNOUNCEMENT_STORAGE_KEY) === 'true') {
    document.body.classList.add('announcement-closed');
    if (announcementBar) {
      announcementBar.style.display = 'none';
    }
  }

  if (announcementCloseBtn && announcementBar) {
    announcementCloseBtn.addEventListener('click', () => {
      document.body.classList.add('announcement-closed');
      try {
        localStorage.setItem(ANNOUNCEMENT_STORAGE_KEY, 'true');
      } catch (e) {
        console.warn('LocalStorage error:', e);
      }
      setTimeout(() => {
        announcementBar.style.display = 'none';
      }, 300);
    });
  }

  // =========================================================================
  // 9. Promo Poster Lightbox Modal (Accessible Dialog with Focus Trap)
  // =========================================================================
  const promoLightbox = document.getElementById('promo-lightbox');
  const openLightboxBtn = document.getElementById('open-promo-lightbox');
  const closeLightboxBtn = document.getElementById('close-promo-lightbox');
  const lightboxBackdrop = document.getElementById('lightbox-backdrop');

  function openPromoModal() {
    if (!promoLightbox) return;
    promoLightbox.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    if (closeLightboxBtn) closeLightboxBtn.focus();
    document.addEventListener('keydown', handleLightboxKeydown);
  }

  function closePromoModal() {
    if (!promoLightbox) return;
    promoLightbox.setAttribute('hidden', '');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', handleLightboxKeydown);
    if (openLightboxBtn) openLightboxBtn.focus();
  }

  function handleLightboxKeydown(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      closePromoModal();
      return;
    }

    if (e.key === 'Tab') {
      const focusableElements = promoLightbox.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length === 0) return;

      const firstEl = focusableElements[0];
      const lastEl = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    }
  }

  if (openLightboxBtn) {
    openLightboxBtn.addEventListener('click', openPromoModal);
  }
  if (closeLightboxBtn) {
    closeLightboxBtn.addEventListener('click', closePromoModal);
  }
  if (lightboxBackdrop) {
    lightboxBackdrop.addEventListener('click', closePromoModal);
  }
});
