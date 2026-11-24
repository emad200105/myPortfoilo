/* ─── main.js — Elevated Editorial Research Portfolio ─── */

/* ── Theme Switcher (Warm Alabaster default / Obsidian Lab Dark Mode) ── */
const root = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('portfolio-theme');
if (savedTheme === 'dark') {
  root.setAttribute('data-theme', 'dark');
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isDark = root.getAttribute('data-theme') === 'dark';
    if (isDark) {
      root.removeAttribute('data-theme');
      localStorage.setItem('portfolio-theme', 'light');
    } else {
      root.setAttribute('data-theme', 'dark');
      localStorage.setItem('portfolio-theme', 'dark');
    }
  });
}

/* ── Sticky Nav Shadow & Active Section Pill ── */
const navbar = document.getElementById('navbar');
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

function onScroll() {
  if (window.scrollY > 12) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  let current = 'about';
  sections.forEach(sec => {
    const top = sec.offsetTop - 120;
    if (window.scrollY >= top) {
      current = sec.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ── Mobile Drawer ── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ── Interactive BibTeX Drawers & One-Click Copy ── */
document.querySelectorAll('.bib-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const drawer = document.getElementById(btn.dataset.bib);
    if (!drawer) return;
    const willOpen = drawer.hasAttribute('hidden');
    if (willOpen) {
      drawer.removeAttribute('hidden');
      btn.setAttribute('aria-expanded', 'true');
    } else {
      drawer.setAttribute('hidden', '');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
});

document.querySelectorAll('.copy-bib-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const codeEl = document.getElementById(btn.dataset.target);
    if (!codeEl) return;
    navigator.clipboard.writeText(codeEl.textContent).then(() => {
      const orig = btn.textContent;
      btn.textContent = '✓ Copied';
      setTimeout(() => { btn.textContent = orig; }, 1800);
    });
  });
});

/* ── Interactive Project Domain Filter ── */
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('#projects-grid .proj-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;
    filterBtns.forEach(b => b.classList.toggle('active', b === btn));
    projectCards.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hidden-card', !match);
    });
  });
});

/* ── Scroll Reveal ── */
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
  );
  revealEls.forEach(el => observer.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('visible'));
}

/* ── Copy Email on Click ── */
const emailItem = document.getElementById('contact-email');
if (emailItem) {
  emailItem.addEventListener('click', e => {
    e.preventDefault();
    navigator.clipboard.writeText('emad200105@gmail.com').then(() => {
      const val = emailItem.querySelector('.ci-value');
      const orig = val.textContent;
      val.textContent = '✓ Copied to clipboard!';
      val.style.color = 'var(--emerald)';
      setTimeout(() => {
        val.textContent = orig;
        val.style.color = '';
      }, 2000);
    }).catch(() => {
      window.location.href = 'mailto:emad200105@gmail.com';
    });
  });
}

/* ── Reliable CV PDF Download ── */
document.querySelectorAll('a[download]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const href = link.getAttribute('href');
    fetch(href)
      .then(res => {
        if (!res.ok) throw new Error('Fetch failed');
        return res.blob();
      })
      .then(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = href.split('/').pop();
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          URL.revokeObjectURL(url);
          document.body.removeChild(a);
        }, 1000);
      })
      .catch(() => {
        window.open(href, '_blank');
      });
  });
});
