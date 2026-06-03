/* ─── main.js — Portfolio interactions ─── */

/* ── Navbar: scroll shadow + active link ── */
const navbar = document.getElementById('navbar');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

function onScroll() {
  // scrolled class
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // active nav link
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 90;
    if (window.scrollY >= top) current = sec.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ── Hamburger / Mobile menu ── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');

hamburger.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', open);
});
mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
  });
});

/* ── Scroll-reveal (Intersection Observer) ── */
const fadeTargets = document.querySelectorAll(
  '.project-card, .skill-category, .achievement-card, .about-card, .timeline-card, .contact-item, .hero-stats'
);
fadeTargets.forEach(el => el.classList.add('fade-in'));

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);
fadeTargets.forEach(el => observer.observe(el));

/* ── Staggered children ── */
document.querySelectorAll('.projects-grid, .skills-grid, .achievements-grid').forEach(grid => {
  Array.from(grid.children).forEach((child, i) => {
    child.style.transitionDelay = `${i * 60}ms`;
  });
});

/* ── Smooth-scroll for all internal anchors ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* ── Hero photo subtle tilt on mousemove ── */
const heroWrap = document.querySelector('.hero-image-wrap');
if (heroWrap) {
  document.addEventListener('mousemove', e => {
    const { innerWidth, innerHeight } = window;
    const x = (e.clientX / innerWidth - 0.5) * 12;
    const y = (e.clientY / innerHeight - 0.5) * -12;
    heroWrap.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${y}deg)`;
  });
  document.addEventListener('mouseleave', () => {
    heroWrap.style.transform = '';
  });
}

/* ── Typing animation for hero subtitle ── */
const subtitle = document.querySelector('.hero-subtitle');
if (subtitle) {
  const texts = [
    'CS & Engineering Graduate · ML Enthusiast · Full-Stack Developer',
    'Deep Learning · Computer Vision · Web Applications',
    'Open to Internship & Entry-Level Opportunities'
  ];
  let idx = 0;
  let charIdx = texts[0].length;
  let deleting = false;
  let pause = 0;

  function type() {
    const current = texts[idx];
    if (pause > 0) { pause--; setTimeout(type, 50); return; }

    if (!deleting) {
      if (charIdx < current.length) {
        subtitle.textContent = current.substring(0, ++charIdx);
        setTimeout(type, 38);
      } else {
        pause = 40;
        deleting = true;
        setTimeout(type, 50);
      }
    } else {
      if (charIdx > 0) {
        subtitle.textContent = current.substring(0, --charIdx);
        setTimeout(type, 22);
      } else {
        deleting = false;
        idx = (idx + 1) % texts.length;
        setTimeout(type, 400);
      }
    }
  }

  // Start after a short delay
  setTimeout(() => {
    subtitle.textContent = '';
    type();
  }, 800);
}

/* ── Copy email on click ── */
const emailLink = document.getElementById('contact-email');
if (emailLink) {
  emailLink.addEventListener('click', e => {
    e.preventDefault();
    navigator.clipboard.writeText('emad200105@gmail.com').then(() => {
      const val = emailLink.querySelector('.contact-value');
      const orig = val.textContent;
      val.textContent = '✓ Copied to clipboard!';
      val.style.color = 'var(--success)';
      setTimeout(() => {
        val.textContent = orig;
        val.style.color = '';
      }, 2000);
    }).catch(() => {
      window.location.href = 'mailto:emad200105@gmail.com';
    });
  });
}

/* ── Resume download fix (works on file:// and http://) ── */
document.querySelectorAll('a[download]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const href = link.getAttribute('href');
    fetch(href)
      .then(res => res.blob())
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
        // Fallback: open in new tab
        window.open(href, '_blank');
      });
  });
});

console.log('%c 👋 Hey there, recruiter! ', 'background:#2563eb;color:#fff;font-size:16px;padding:6px 12px;border-radius:4px;font-weight:bold;');
console.log('%c Thanks for checking out my portfolio source code. Let\'s connect: emad200105@gmail.com', 'color:#475569;font-size:13px;');
