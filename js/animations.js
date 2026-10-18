/**
 * Omegatec Computers Sdn. Bhd.
 * Interactive Animations & Dynamic UI Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. Unified Mobile Navigation Drawer
  // =========================================================================
  const hamburger = document.querySelector('.hamburger');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  const drawerOverlay = document.querySelector('.drawer-overlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function openDrawer() {
    if (!hamburger || !mobileDrawer) return;
    hamburger.classList.add('is-active');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileDrawer.classList.add('is-active');
    drawerOverlay?.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (!hamburger || !mobileDrawer) return;
    hamburger.classList.remove('is-active');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileDrawer.classList.remove('is-active');
    drawerOverlay?.classList.remove('is-active');
    document.body.style.overflow = '';
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
      if (e.key === 'Escape' && mobileDrawer.classList.contains('is-active')) {
        closeDrawer();
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

    // WhatsApp FAB visibility: appears ONLY when scrolled below the hero section
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
      behavior: 'smooth'
    });
  });

  // =========================================================================
  // 3. Animated Stat Counters
  // =========================================================================
  const statNumbers = document.querySelectorAll('.stat-count');
  let statsAnimated = false;

  function animateCounters() {
    if (statsAnimated) return;
    statsAnimated = true;

    statNumbers.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      if (isNaN(target)) return;

      const duration = 2000; // ms
      const frameDuration = 1000 / 60;
      const totalFrames = Math.round(duration / frameDuration);
      let frame = 0;

      const timer = setInterval(() => {
        frame++;
        // Ease-out expo progress
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
  if (statsSection && 'IntersectionObserver' in window) {
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
    // Fallback if IntersectionObserver is unsupported
    animateCounters();
  }

  // =========================================================================
  // 4. Staggered Scroll-Reveal Observer
  // =========================================================================
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
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
  // 5. Infinite Marquee Duplicate Track (Guarantees Gapless Loop)
  // =========================================================================
  const marqueeTrack = document.querySelector('.marquee-track');
  if (marqueeTrack) {
    // Clone children to ensure seamless continuous CSS animation
    const trackChildren = Array.from(marqueeTrack.children);
    trackChildren.forEach(child => {
      const clone = child.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      marqueeTrack.appendChild(clone);
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
  // 7. Direct Email Submission via FormSubmit.co AJAX
  // =========================================================================
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnHtml = submitBtn ? submitBtn.innerHTML : 'Submit Message';

      // Set loading state
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg style="animation: spin 1s linear infinite; width: 18px; height: 18px; display: inline-block; vertical-align: middle; margin-right: 8px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
            <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
          </svg> Sending inquiry...`;
      }

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
          window.location.href = 'thank-you.html';
        } else {
          const result = await response.json().catch(() => ({}));
          throw new Error(result.message || 'Submission failed');
        }
      } catch (err) {
        console.error('AJAX form submission error, falling back to native POST:', err);
        // Fallback: remove onsubmit if any and native POST to FormSubmit
        contactForm.removeAttribute('onsubmit');
        contactForm.submit();
      }
    });
  }
});
