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

/* ── Sticky Nav Shadow, Reading Progress & Active Section Pill ── */
const navbar = document.getElementById('navbar');
const scrollProgress = document.getElementById('scroll-progress');
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

function onScroll() {
  if (window.scrollY > 12) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  if (scrollProgress) {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? Math.min(100, (window.scrollY / docHeight) * 100) : 0;
    scrollProgress.style.width = `${pct.toFixed(1)}%`;
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

/* ── Interactive Document Dewarping Mesh (Paper [01]) ── */
const dewarpSlider = document.getElementById('dewarp-slider');
const dewarpPage = document.getElementById('dewarp-page');
const dewarpLines = document.querySelectorAll('.dewarp-line');
const dewarpPct = document.getElementById('dewarp-pct');
const dewarpCer = document.getElementById('dewarp-cer');

function renderDewarp(val) {
  if (!dewarpSlider || !dewarpPage || !dewarpLines.length) return;
  const t = Math.max(0, Math.min(100, Number(val))) / 100; // 0 = warped, 1 = rectified
  const w = 1 - t;
  const amp = w * 20;

  // Dynamic warped -> flat document page sheet outline
  const topDip = 14 + amp * 0.42;
  const botDip = 78 + amp * 0.42;
  const skew = w * 6;
  dewarpPage.setAttribute(
    'd',
    `M ${56 + skew} ${topDip} ` +
    `C 155 ${14 - amp * 0.65}, 265 ${14 + amp * 0.55}, ${364 - skew} ${14 - amp * 0.28} ` +
    `L ${368} ${botDip - amp * 0.25} ` +
    `C 265 ${78 + amp * 0.55}, 155 ${78 - amp * 0.65}, ${52} ${botDip} Z`
  );

  // 5 text lines unbending under layout-consistency supervision
  const lineRows = [
    { y: 29, x1: 74, x2: 268 },
    { y: 40, x1: 74, x2: 344 },
    { y: 50, x1: 74, x2: 338 },
    { y: 60, x1: 74, x2: 346 },
    { y: 70, x1: 74, x2: 296 }
  ];

  dewarpLines.forEach((line, idx) => {
    const row = lineRows[idx] || lineRows[0];
    const localAmp = amp * (1 - idx * 0.07);
    const yStart = row.y + localAmp * 0.32;
    const yEnd = row.y - localAmp * 0.22;
    const c1y = row.y - localAmp * 0.95;
    const c2y = row.y + localAmp * 0.85;
    line.setAttribute(
      'd',
      `M ${row.x1} ${yStart.toFixed(1)} C 165 ${c1y.toFixed(1)}, 255 ${c2y.toFixed(1)}, ${row.x2} ${yEnd.toFixed(1)}`
    );
  });

  if (dewarpPct) {
    dewarpPct.textContent = `Rectified: ${Math.round(t * 100)}%`;
  }
  if (dewarpCer) {
    const cer = (30.4 - t * 1.8).toFixed(1);
    dewarpCer.textContent = `CER: ${cer}%`;
  }
}

if (dewarpSlider) {
  dewarpSlider.addEventListener('input', e => renderDewarp(e.target.value));

  document.querySelectorAll('[data-dewarp-set]').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetVal = Number(btn.dataset.dewarpSet);
      dewarpSlider.value = String(targetVal);
      renderDewarp(targetVal);
    });
  });

  renderDewarp(dewarpSlider.value);

  // Subtle one-time unbending demo when Paper [01] enters the viewport
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReduced && 'IntersectionObserver' in window) {
    const dewarpObs = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          dewarpObs.disconnect();
          const start = performance.now();
          const duration = 950;
          const from = 12;
          const to = 88;
          function tick(now) {
            const p = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            const cur = Math.round(from + (to - from) * eased);
            dewarpSlider.value = String(cur);
            renderDewarp(cur);
            if (p < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
        });
      },
      { threshold: 0.35 }
    );
    dewarpObs.observe(dewarpSlider);
  }
}

/* ── Hero Focus Chips (Jump & Pre-Filter Projects / Stack) ── */
document.querySelectorAll('.focus-chip[data-jump]').forEach(chip => {
  chip.addEventListener('click', () => {
    const targetSel = chip.dataset.jump;
    const projFilter = chip.dataset.projectFilter;
    const stackLens = chip.dataset.stackLens;

    if (projFilter) {
      const targetBtn = document.querySelector(`.filter-btn[data-filter="${projFilter}"]`);
      if (targetBtn) targetBtn.click();
    }
    if (stackLens) {
      const lensBtn = document.querySelector(`.stack-lens-btn[data-lens="${stackLens}"]`);
      if (lensBtn) lensBtn.click();
    }
    const dest = document.querySelector(targetSel);
    if (dest) dest.scrollIntoView({ behavior: 'smooth' });
  });
});

/* ── Quantitative Metrics Count-Up on Reveal ── */
const countEls = document.querySelectorAll('[data-count-to]');
if (countEls.length && 'IntersectionObserver' in window) {
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReduced) {
    const countObs = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          countObs.unobserve(el);
          const target = parseFloat(el.dataset.countTo);
          const decimals = parseInt(el.dataset.decimals || '0', 10);
          const start = performance.now();
          const dur = 850;
          function step(now) {
            const p = Math.min(1, (now - start) / dur);
            const ease = 1 - Math.pow(1 - p, 3);
            el.textContent = (target * ease).toFixed(decimals);
            if (p < 1) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
        });
      },
      { threshold: 0.4 }
    );
    countEls.forEach(el => countObs.observe(el));
  }
}

/* ── Work Experience: Interactive TA Console & Responsibility Triggers ── */
const taTabs = document.querySelectorAll('.ta-tab');
const taPanels = document.querySelectorAll('.ta-panel');
const taTriggers = document.querySelectorAll('[data-ta-trigger]');

function activateTaView(viewId) {
  taTabs.forEach(t => t.classList.toggle('active', t.dataset.ta === viewId));
  taPanels.forEach(p => p.classList.toggle('active', p.dataset.taPanel === viewId));
}

taTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    activateTaView(tab.dataset.ta);
    taTriggers.forEach(tr => tr.classList.toggle('active', tr.dataset.taTrigger === tab.dataset.ta));
  });
});

taTriggers.forEach(trigger => {
  trigger.addEventListener('click', () => {
    taTriggers.forEach(t => t.classList.toggle('active', t === trigger));
    activateTaView(trigger.dataset.taTrigger);
  });
});

/* ── Education: Coursework Domain Filter & Applied-In Readout ── */
const cfBtns = document.querySelectorAll('.cf-btn');
const coursePills = document.querySelectorAll('.course-pill');
const courseReadoutText = document.getElementById('course-readout-text');
const courseReadoutLink = document.getElementById('course-readout-link');

function selectCoursePill(pill) {
  if (!pill) return;
  coursePills.forEach(p => p.classList.toggle('active', p === pill));
  if (courseReadoutText && pill.dataset.applied) {
    courseReadoutText.textContent = pill.dataset.applied;
  }
  if (courseReadoutLink && pill.dataset.link) {
    courseReadoutLink.setAttribute('href', pill.dataset.link);
  }
}

coursePills.forEach(pill => {
  pill.addEventListener('mouseenter', () => selectCoursePill(pill));
  pill.addEventListener('click', () => selectCoursePill(pill));
});

cfBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const domain = btn.dataset.cf;
    cfBtns.forEach(b => b.classList.toggle('active', b === btn));
    let firstMatch = null;
    coursePills.forEach(pill => {
      const match = domain === 'all' || pill.dataset.domain === domain;
      pill.classList.toggle('dimmed', !match);
      if (match && !firstMatch) firstMatch = pill;
    });
    if (firstMatch) selectCoursePill(firstMatch);
  });
});

/* ── Technical Stack: Interactive Skill Inspector, Lens & Instant Search ── */
const skillPills = document.querySelectorAll('.stack-bento .sp');
const seName = document.getElementById('se-skill-name');
const seDesc = document.getElementById('se-skill-desc');
const seLink = document.getElementById('se-skill-link');
const stackLensBtns = document.querySelectorAll('.stack-lens-btn');
const skillSearch = document.getElementById('skill-search');
let activeStackLens = 'all';

function inspectSkill(pill) {
  if (!pill) return;
  skillPills.forEach(p => p.classList.toggle('active-sp', p === pill));
  if (seName) seName.textContent = pill.textContent.trim();
  if (seDesc && pill.dataset.proof) seDesc.textContent = pill.dataset.proof;
  if (seLink && pill.dataset.href) seLink.setAttribute('href', pill.dataset.href);
}

skillPills.forEach(pill => {
  pill.addEventListener('mouseenter', () => inspectSkill(pill));
  pill.addEventListener('focus', () => inspectSkill(pill));
  pill.addEventListener('click', () => inspectSkill(pill));
});

function filterStackPills() {
  const q = skillSearch ? skillSearch.value.trim().toLowerCase() : '';
  let firstVisible = null;
  skillPills.forEach(pill => {
    const catMatch = activeStackLens === 'all' || pill.dataset.cat === activeStackLens;
    const textMatch = !q || pill.textContent.toLowerCase().includes(q) || (pill.dataset.proof || '').toLowerCase().includes(q);
    const match = catMatch && textMatch;
    pill.classList.toggle('dimmed-sp', !match);
    if (match && !firstVisible) firstVisible = pill;
  });
  if (firstVisible) inspectSkill(firstVisible);
}

stackLensBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    activeStackLens = btn.dataset.lens;
    stackLensBtns.forEach(b => b.classList.toggle('active', b === btn));
    filterStackPills();
  });
});

if (skillSearch) {
  skillSearch.addEventListener('input', filterStackPills);
}

/* ── Honors: 11-Trimester Scholarship Matrix & LeetCode Topic Explorer ── */
const waiverReadout = document.getElementById('waiver-readout');
document.querySelectorAll('.trim-cell').forEach(cell => {
  const show = () => {
    if (waiverReadout && cell.dataset.trim) waiverReadout.textContent = cell.dataset.trim;
  };
  cell.addEventListener('mouseenter', show);
  cell.addEventListener('focus', show);
  cell.addEventListener('click', show);
});

const lcReadout = document.getElementById('lc-readout');
const lcPills = document.querySelectorAll('.lc-pill');
lcPills.forEach(pill => {
  const activate = () => {
    lcPills.forEach(p => p.classList.toggle('active', p === pill));
    if (lcReadout && pill.dataset.lc) lcReadout.textContent = pill.dataset.lc;
  };
  pill.addEventListener('mouseenter', activate);
  pill.addEventListener('click', activate);
});

/* ── Cursor-Tracked Radial Surface Sheen Across Cards ── */
document.querySelectorAll('.tl-card, .stack-card, .honor-card').forEach(card => {
  card.addEventListener('pointermove', e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${(e.clientX - r.left).toFixed(0)}px`);
    card.style.setProperty('--my', `${(e.clientY - r.top).toFixed(0)}px`);
  }, { passive: true });
});

/* ── Copy Phone on Click & Live Dhaka Clock (UTC+6) ── */
const phoneItem = document.getElementById('contact-phone');
if (phoneItem) {
  phoneItem.addEventListener('click', e => {
    e.preventDefault();
    navigator.clipboard.writeText('+8801410964837').then(() => {
      const val = phoneItem.querySelector('.ci-value');
      const orig = val.textContent;
      val.textContent = '✓ Copied to clipboard!';
      val.style.color = 'var(--emerald)';
      setTimeout(() => {
        val.textContent = orig;
        val.style.color = '';
      }, 2000);
    }).catch(() => {
      window.location.href = 'tel:+8801410964837';
    });
  });
}

const dhakaClock = document.getElementById('dhaka-clock');
function updateDhakaTime() {
  if (!dhakaClock) return;
  try {
    const formatted = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Dhaka',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(new Date());
    dhakaClock.textContent = `${formatted} (UTC+6)`;
  } catch {
    dhakaClock.textContent = 'UTC+6';
  }
}
updateDhakaTime();
setInterval(updateDhakaTime, 30000);
