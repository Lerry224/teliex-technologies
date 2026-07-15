// ===== header scroll state =====
const header = document.getElementById('site-header');
if(header){
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  });
}

// ===== scroll progress bar =====
const scrollProgress = document.getElementById('scrollProgress');
if(scrollProgress){
  window.addEventListener('scroll', () => {
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    scrollProgress.style.width = (isFinite(scrolled) ? scrolled : 0) + '%';
  }, { passive: true });
}

// ===== mobile nav =====
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
if(burger && navLinks){
  function toggleNav(){ navLinks.classList.toggle('open'); burger.classList.toggle('open'); }
  burger.addEventListener('click', toggleNav);
  burger.addEventListener('keydown', e => { if(e.key === 'Enter' || e.key === ' ') toggleNav(); });
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));
}

// ===== active nav link =====
(function(){
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if(href === path || (path === '' && href === 'index.html')) a.classList.add('active');
  });
})();

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ===== scroll reveal with stagger =====
const staggerGroups = ['.service-grid', '.portfolio-grid', '.stat-row', '.team-grid', '.value-grid', '.filter-row'];
staggerGroups.forEach(sel => {
  document.querySelectorAll(sel).forEach(group => {
    Array.from(group.children).forEach((child, i) => {
      child.style.setProperty('--rd', (i * 0.07) + 's');
    });
  });
});
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .wipe');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => io.observe(el));

// ===== count-up numbers =====
const counters = document.querySelectorAll('[data-count]');
function animateCount(el){
  const target = parseFloat(el.dataset.count);
  const decimals = parseInt(el.dataset.decimal || '0', 10);
  const suffix = el.dataset.suffix || '';
  if(reduceMotion){ el.textContent = target.toFixed(decimals) + suffix; return; }
  const duration = 1400;
  const start = performance.now();
  function tick(now){
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    const val = target * eased;
    el.textContent = (decimals ? val.toFixed(decimals) : Math.round(val).toLocaleString()) + suffix;
    if(p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
const countIO = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){ animateCount(entry.target); countIO.unobserve(entry.target); }
  });
}, { threshold: 0.5 });
counters.forEach(el => countIO.observe(el));

// ===== hero cursor spotlight =====
const heroEl = document.querySelector('.hero, .page-hero');
const spotlight = document.getElementById('heroSpotlight');
if(heroEl && spotlight && !reduceMotion){
  heroEl.addEventListener('mousemove', (e) => {
    const rect = heroEl.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * 100;
    const my = ((e.clientY - rect.top) / rect.height) * 100;
    spotlight.style.setProperty('--mx', mx + '%');
    spotlight.style.setProperty('--my', my + '%');
  });
}

// ===== card tilt on hover =====
if(!reduceMotion && window.matchMedia('(hover: hover)').matches){
  document.querySelectorAll('.service-card, .value-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `translateY(-10px) rotateX(${(-py * 9).toFixed(2)}deg) rotateY(${(px * 9).toFixed(2)}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}

// ===== button ripple =====
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function(e){
    const r = this.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(r.width, r.height) * 1.6;
    ripple.className = 'ripple';
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - r.left - size / 2) + 'px';
    ripple.style.top = (e.clientY - r.top - size / 2) + 'px';
    this.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
});

// ===== hero headline word cycle =====
const heroCycle = document.getElementById('heroCycle');
if(heroCycle && !reduceMotion){
  const words = (heroCycle.dataset.words || 'connect').split(',');
  let wi = 0;
  setInterval(() => {
    wi = (wi + 1) % words.length;
    heroCycle.style.opacity = '0';
    heroCycle.style.transform = 'translateY(6px)';
    setTimeout(() => {
      heroCycle.textContent = words[wi];
      heroCycle.style.transition = 'opacity .35s ease, transform .35s ease';
      heroCycle.style.opacity = '1';
      heroCycle.style.transform = 'translateY(0)';
    }, 220);
  }, 2600);
}

// ===== portfolio filter =====
const filterBtns = document.querySelectorAll('.filter-btn');
const pCards = document.querySelectorAll('.p-card');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    pCards.forEach(card => {
      const show = f === 'all' || card.dataset.cat === f;
      card.style.display = show ? '' : 'none';
    });
  });
});

// ===== FAQ accordion =====
document.querySelectorAll('.faq-q').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.closest('.faq-item');
    const answer = item.querySelector('.faq-a');
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(o => {
      o.classList.remove('open');
      o.querySelector('.faq-a').style.maxHeight = null;
    });
    if(!wasOpen){
      item.classList.add('open');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });
});

// ===== Contact Form =====
const form = document.getElementById("contactForm");
const success = document.getElementById("formSuccess");
const formError = document.getElementById("formError");

if (form) {
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const button = form.querySelector(".submit-btn");

        if(formError){ formError.style.display = "none"; }
        button.disabled = true;
        button.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

        emailjs.send("service_zr8o4lg", "template_stq32d2", {
            name: document.getElementById("fname").value,
            email: document.getElementById("femail").value,
            phone: document.getElementById("fphone").value,
            service: document.getElementById("fservice").value,
            message: document.getElementById("fmsg").value
        })
        .then(() => {
            form.reset();
            form.style.display = "none";
            success.style.display = "block";
        })
        .catch((error) => {
            console.error(error);

            if(formError){
              formError.style.display = "flex";
              formError.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }

            button.disabled = false;
            button.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
        });
    });
}
// ===== smooth anchor scroll offset for fixed header =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e){
    const id = this.getAttribute('href');
    if(id.length > 1){
      const target = document.querySelector(id);
      if(target){
        e.preventDefault();
        const y = target.getBoundingClientRect().top + window.scrollY - 76;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  });
});

// ===== floating particles (ambient, low-cost) =====
if(!reduceMotion){
  document.querySelectorAll('.particle-field').forEach(field => {
    const colors = ['rgba(79,70,229,.5)', 'rgba(6,182,212,.5)', 'rgba(236,72,153,.4)'];
    for(let i = 0; i < 10; i++){
      const p = document.createElement('span');
      p.className = 'particle';
      const size = 4 + Math.random() * 7;
      p.style.width = p.style.height = size + 'px';
      p.style.left = Math.random() * 100 + '%';
      p.style.top = Math.random() * 100 + '%';
      p.style.background = colors[i % colors.length];
      p.style.animationDuration = (4 + Math.random() * 5) + 's';
      p.style.animationDelay = (Math.random() * 4) + 's';
      field.appendChild(p);
    }
  });
}

// ===== narrative line-by-line reveal =====
document.querySelectorAll('.narrative').forEach(block => {
  const lines = block.querySelectorAll('.n-line');
  lines.forEach((line, i) => line.style.transitionDelay = (i * 0.18) + 's');
  const nIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        lines.forEach(line => line.classList.add('in'));
        nIO.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  nIO.observe(block);
});

// ===== challenge carousel: drag to scroll + arrow buttons =====
document.querySelectorAll('.carousel-track').forEach(track => {
  let isDown = false, startX, scrollLeft;
  track.addEventListener('mousedown', (e) => {
    isDown = true; track.classList.add('dragging');
    startX = e.pageX - track.offsetLeft; scrollLeft = track.scrollLeft;
  });
  ['mouseleave','mouseup'].forEach(evt => track.addEventListener(evt, () => { isDown = false; track.classList.remove('dragging'); }));
  track.addEventListener('mousemove', (e) => {
    if(!isDown) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    track.scrollLeft = scrollLeft - (x - startX) * 1.4;
  });
  const wrap = track.closest('.challenges');
  if(wrap){
    const prev = wrap.querySelector('[data-carousel="prev"]');
    const next = wrap.querySelector('[data-carousel="next"]');
    const cardWidth = 322;
    if(prev) prev.addEventListener('click', () => track.scrollBy({ left: -cardWidth, behavior: 'smooth' }));
    if(next) next.addEventListener('click', () => track.scrollBy({ left: cardWidth, behavior: 'smooth' }));
  }
});

// ===== cursor glow (desktop, fine-pointer only) =====
const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
if(isFinePointer && !reduceMotion){
  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  glow.id = 'cursorGlow';
  document.body.appendChild(glow);
  let gx = window.innerWidth / 2, gy = window.innerHeight / 2, cx = gx, cy = gy;
  document.addEventListener('mousemove', (e) => {
    gx = e.clientX; gy = e.clientY;
    glow.classList.add('active');
  });
  document.addEventListener('mouseleave', () => glow.classList.remove('active'));
  function glowLoop(){
    cx += (gx - cx) * 0.18; cy += (gy - cy) * 0.18;
    glow.style.transform = `translate(${cx}px, ${cy}px) translate(-50%,-50%)`;
    requestAnimationFrame(glowLoop);
  }
  requestAnimationFrame(glowLoop);
  const bigTargets = 'a, button, .service-card, .challenge-card, .value-card, .p-card, .team-card, input, select, textarea';
  document.querySelectorAll(bigTargets).forEach(el => {
    el.addEventListener('mouseenter', () => glow.classList.add('big'));
    el.addEventListener('mouseleave', () => glow.classList.remove('big'));
  });
}

// ===== magnetic buttons =====
if(isFinePointer && !reduceMotion){
  document.querySelectorAll('.btn-primary, .carousel-arrow, .wa-float').forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width / 2) * 0.35;
      const dy = (e.clientY - r.top - r.height / 2) * 0.35;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });
}

// ===== ambient parallax on background mesh =====
const bgMesh = document.querySelector('.bg-mesh');
if(bgMesh && !reduceMotion){
  window.addEventListener('scroll', () => {
    const y = window.scrollY * 0.06;
    bgMesh.style.transform = `translateY(${y}px)`;
  }, { passive: true });
}

// ===== word-by-word stagger for narrative headlines =====
document.querySelectorAll('.n-line.big').forEach(el => {
  const nodes = Array.from(el.childNodes);
  el.innerHTML = '';
  let wi = 0;
  nodes.forEach(node => {
    if(node.nodeType === Node.TEXT_NODE){
      node.textContent.split(/(\s+)/).forEach(part => {
        if(part.trim() === ''){
          el.appendChild(document.createTextNode(part));
        } else {
          const span = document.createElement('span');
          span.className = 'word';
          span.style.setProperty('--wi', wi++);
          span.textContent = part;
          el.appendChild(span);
        }
      });
    } else {
      const span = document.createElement('span');
      span.className = 'word';
      span.style.setProperty('--wi', wi++);
      span.appendChild(node.cloneNode(true));
      el.appendChild(span);
    }
  });
});

// ===== click-to-copy on contact info =====
document.querySelectorAll('.contact-info-item').forEach(item => {
  const label = item.querySelector('h4');
  const value = item.querySelector('p');
  if(!label || !value || !/call|email/i.test(label.textContent)) return;
  item.style.cursor = 'pointer';
  item.title = 'Click to copy';
  item.addEventListener('click', () => {
    const original = value.textContent;
    navigator.clipboard?.writeText(original.trim()).then(() => {
      value.textContent = 'Copied!';
      setTimeout(() => { value.textContent = original; }, 1300);
    }).catch(() => {});
  });
});

// ===== section dot navigator =====
const navDots = document.querySelectorAll('.section-nav a');
if(navDots.length){
  const navSections = Array.from(navDots)
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);
  const secIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        const id = '#' + entry.target.id;
        navDots.forEach(a => a.classList.toggle('active', a.getAttribute('href') === id));
      }
    });
  }, { threshold: 0.5 });
  navSections.forEach(sec => secIO.observe(sec));
}
