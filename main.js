/* ─── main.js — Editorial Scholar Portfolio ─── */

/* ── Theme toggle (Warm Ivory default, optional Dark Reading mode) ── */
const root = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('portfolio-theme');
if (savedTheme === 'dark') {
  root.setAttribute('data-theme', 'dark');
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    if (next === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }
    localStorage.setItem('portfolio-theme', next);
  });
}

/* ── Navbar scroll state & active section highlight ── */
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
    const top = sec.offsetTop - 110;
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

/* ── Mobile menu ── */
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

/* ── Calm scroll-reveal ── */
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

/* ── Copy email address on click ── */
const emailRow = document.getElementById('contact-email');
if (emailRow) {
  emailRow.addEventListener('click', e => {
    e.preventDefault();
    navigator.clipboard.writeText('emad200105@gmail.com').then(() => {
      const val = emailRow.querySelector('.contact-val');
      const original = val.textContent;
      val.textContent = '✓ Copied to clipboard';
      val.style.color = 'var(--accent-sage)';
      setTimeout(() => {
        val.textContent = original;
        val.style.color = '';
      }, 2000);
    }).catch(() => {
      window.location.href = 'mailto:emad200105@gmail.com';
    });
  });
}

/* ── Reliable CV PDF download (supports http:// and file://) ── */
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
