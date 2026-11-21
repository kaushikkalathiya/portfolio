document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. Theme Management (Light & Dark Mode)
  // ==========================================
  const applyTheme = (theme) => {
    if (theme === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
  };

  const getActiveTheme = () => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const toggleTheme = () => {
    const current = document.documentElement.classList.contains('light') ? 'light' : 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', next);
    applyTheme(next);
  };

  // Bind all theme toggles (desktop and mobile)
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  themeToggleBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleTheme();
    });
  });

  // Listen to system color scheme changes if user hasn't explicitly set a preference
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  // ==========================================
  // 2. Ambient Torch Mouse Tracking Effect
  // ==========================================
  const torchCanvas = document.getElementById('torch-canvas');
  if (torchCanvas) {
    let rafId = null;
    window.addEventListener(
      'mousemove',
      (e) => {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
          document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
        });
      },
      { passive: true }
    );
  }

  // ==========================================
  // 3. Sticky Glassmorphism Header Scroll State
  // ==========================================
  const headerNav = document.querySelector('.glass-nav');
  if (headerNav) {
    const onScroll = () => {
      headerNav.classList.toggle('scrolled', window.scrollY > 30);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ==========================================
  // 4. Mobile Drawer Navigation Toggle
  // ==========================================
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isClosed = mobileMenu.classList.contains('hidden');
      mobileMenu.classList.toggle('hidden');
      menuBtn.setAttribute('aria-expanded', String(isClosed));
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!mobileMenu.classList.contains('hidden') && !headerNav.contains(e.target)) {
        mobileMenu.classList.add('hidden');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.focus();
      }
    });
  }

  // ==========================================
  // 5. Scroll Reveal Engine (IntersectionObserver)
  // ==========================================
  const revealElements = document.querySelectorAll(
    '.reveal-init, .reveal-left-init, .reveal-right-init, .reveal-scale-init'
  );

  if (revealElements.length > 0 && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-active');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.1
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback: immediately show elements
    revealElements.forEach((el) => el.classList.add('reveal-active'));
  }

  // ==========================================
  // 6. Magnetic Hover Effect for Premium Cards
  // ==========================================
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (!isTouchDevice) {
    const magneticItems = document.querySelectorAll('.magnetic-card');
    magneticItems.forEach((card) => {
      card.addEventListener(
        'mousemove',
        (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - (rect.left + rect.width / 2);
          const y = e.clientY - (rect.top + rect.height / 2);
          const tiltX = (y / (rect.height / 2)) * -5;
          const tiltY = (x / (rect.width / 2)) * 5;
          card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(10px) translateY(-3px)`;
        },
        { passive: true }
      );

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) translateY(0px)';
      });
    });
  }

  // ==========================================
  // 7. Portfolio Category Filter Handler
  // ==========================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectItems = document.querySelectorAll('.project-card-item');

  if (filterBtns.length > 0 && projectItems.length > 0) {
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const category = btn.getAttribute('data-category');

        projectItems.forEach((item) => {
          const itemCategory = item.getAttribute('data-category');
          if (category === 'all' || itemCategory === category) {
            item.style.display = 'block';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            }, 50);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.96)';
            setTimeout(() => {
              item.style.display = 'none';
            }, 250);
          }
        });
      });
    });
  }

  // ==========================================
  // 8. Copy Email Toast Notification Trigger
  // ==========================================
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const toast = document.getElementById('toast-notification');

  const showToastNotification = () => {
    if (!toast) return;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3500);
  };

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = copyEmailBtn.getAttribute('data-email') || 'kaushikvkalathiya@gmail.com';

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard
          .writeText(email)
          .then(showToastNotification)
          .catch(() => fallbackCopy(email));
      } else {
        fallbackCopy(email);
      }
    });
  }

  function fallbackCopy(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      showToastNotification();
    } catch (err) {
      console.error('Copy fallback failed: ', err);
    }
    document.body.removeChild(textArea);
  }

  // ==========================================
  // 9. Lazy Image Load Fade-in
  // ==========================================
  document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
    if (img.complete) {
      img.classList.add('loaded');
    } else {
      img.addEventListener('load', () => img.classList.add('loaded'), { once: true });
    }
  });

  // ==========================================
  // 10. FAQ Accordion Handling (AEO)
  // ==========================================
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (questionBtn && answer) {
      questionBtn.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');

        // Close other items in the same FAQ list
        faqItems.forEach((other) => {
          if (other !== item) {
            other.classList.remove('open');
            const otherBtn = other.querySelector('.faq-question');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          }
        });

        if (isOpen) {
          item.classList.remove('open');
          questionBtn.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('open');
          questionBtn.setAttribute('aria-expanded', 'true');
        }
      });
    }
  });
});
