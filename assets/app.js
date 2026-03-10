(function () {
  const focusableSelectors = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function trapFocus(container, event) {
    const focusables = Array.from(container.querySelectorAll(focusableSelectors));
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.key === 'Tab') {
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  function initLanguageSwitcher(scope) {
    const switcher = scope.querySelector('.language-switcher');
    if (!switcher) return;
    const button = switcher.querySelector('.language-button');
    button.addEventListener('click', () => switcher.classList.toggle('open'));
    document.addEventListener('click', (event) => {
      if (!switcher.contains(event.target)) switcher.classList.remove('open');
    });
  }

  function setLock(state) {
    document.body.classList.toggle('lock', state);
  }

  function initDrawer() {
    const drawer = document.querySelector('.mobile-drawer');
    if (!drawer) return;
    const burger = document.querySelector('.burger');
    const closeBtn = drawer.querySelector('.drawer-close');
    const panel = drawer.querySelector('.drawer-panel');

    function closeDrawer() {
      drawer.classList.remove('open');
      setLock(false);
      burger.focus();
    }

    function openDrawer() {
      drawer.classList.add('open');
      setLock(true);
      const first = panel.querySelector('a, button');
      if (first) first.focus();
    }

    burger.addEventListener('click', openDrawer);
    closeBtn.addEventListener('click', closeDrawer);
    drawer.addEventListener('click', (event) => {
      if (event.target === drawer) closeDrawer();
    });

    document.addEventListener('keydown', (event) => {
      if (!drawer.classList.contains('open')) return;
      if (event.key === 'Escape') closeDrawer();
      trapFocus(panel, event);
    });

    initLanguageSwitcher(panel);
  }

  function initFaq() {
    const items = document.querySelectorAll('.faq-item');
    items.forEach((item) => {
      const button = item.querySelector('.faq-question');
      button.addEventListener('click', () => {
        items.forEach((other) => {
          if (other !== item) {
            other.classList.remove('open');
            other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
          }
        });
        const isOpen = item.classList.toggle('open');
        button.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
    });
  }

  function initForms() {
    const forms = document.querySelectorAll('.signup-form');
    forms.forEach((form) => {
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const success = form.querySelector('.form-success');
        success.classList.add('show');
        form.reset();
      });
    });
  }

  function initModal() {
    const modal = document.getElementById('privacy-modal');
    if (!modal) return;
    const openers = document.querySelectorAll('[data-open-privacy]');
    const closeButtons = modal.querySelectorAll('[data-close-modal]');
    const panel = modal.querySelector('.modal-panel');

    function closeModal() {
      modal.classList.remove('open');
      setLock(false);
      openers[0].focus();
    }

    function openModal() {
      modal.classList.add('open');
      setLock(true);
      const first = panel.querySelector('button, a');
      if (first) first.focus();
    }

    openers.forEach((opener) => opener.addEventListener('click', (event) => {
      event.preventDefault();
      openModal();
    }));

    closeButtons.forEach((btn) => btn.addEventListener('click', closeModal));

    modal.addEventListener('click', (event) => {
      if (event.target === modal) closeModal();
    });

    document.addEventListener('keydown', (event) => {
      if (!modal.classList.contains('open')) return;
      if (event.key === 'Escape') closeModal();
      trapFocus(panel, event);
    });
  }

  function initObserver() {
    const animated = document.querySelectorAll('[data-animate]');
    if (!('IntersectionObserver' in window)) {
      animated.forEach((el) => el.classList.add('show'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    animated.forEach((item) => io.observe(item));
  }

  initLanguageSwitcher(document);
  initDrawer();
  initFaq();
  initForms();
  initModal();
  initObserver();
})();
