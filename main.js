// ===== header scroll state =====
const header = document.getElementById('site-header');
if(header){
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  });
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
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
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

if (form) {
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const button = form.querySelector(".submit-btn");

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

            alert("Failed to send your message. Please try again.");

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
