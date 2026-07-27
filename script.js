document.addEventListener('DOMContentLoaded', () => {
  // 1. Ambient Torch Mouse Tracking Effect
  const torchCanvas = document.getElementById('torch-canvas');
  if (torchCanvas) {
    window.addEventListener('mousemove', (e) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    });
  }

  // 2. Sticky Glassmorphism Header Scroll State
  const headerNav = document.querySelector('.glass-nav');
  if (headerNav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 30) {
        headerNav.classList.add('scrolled');
      } else {
        headerNav.classList.remove('scrolled');
      }
    });
  }

  // 3. Mobile Drawer Navigation Toggle
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // 4. Scroll Reveal Engine (IntersectionObserver)
  const revealElements = document.querySelectorAll(
    '.reveal-init, .reveal-left-init, .reveal-right-init, .reveal-scale-init'
  );

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.12
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach((el) => revealObserver.observe(el));

  // 5. Magnetic Hover Effect for Premium Cards & Buttons
  const magneticItems = document.querySelectorAll('.magnetic-card');
  magneticItems.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);

      const tiltX = (y / (rect.height / 2)) * -6;
      const tiltY = (x / (rect.width / 2)) * 6;

      card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(10px) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) translateY(0px)';
    });
  });

  // 6. Portfolio Category Filter Handler
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectItems = document.querySelectorAll('.project-card-item');

  if (filterBtns.length > 0 && projectItems.length > 0) {
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        // Remove active class from all
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
            item.style.transform = 'scale(0.95)';
            setTimeout(() => {
              item.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }

  // 7. Copy Email Toast Notification Trigger
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const toast = document.getElementById('toast-notification');

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = copyEmailBtn.getAttribute('data-email') || 'kaushikkalathiya@gmail.com';
      
      navigator.clipboard.writeText(email).then(() => {
        if (toast) {
          toast.classList.add('show');
          setTimeout(() => {
            toast.classList.remove('show');
          }, 3500);
        }
      }).catch(err => {
        console.error('Failed to copy: ', err);
      });
    });
  }
});
