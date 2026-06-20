/* ============================================
   GALERA TECH - JAVASCRIPT COM EFEITOS SURREAIS
   Partículas, Animações 3D, Interatividades Daora
   ============================================ */

// ============================================
// SISTEMA DE PARTÍCULAS PSICODÉLICAS
// ============================================

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 3 + 1;
    this.speedX = (Math.random() - 0.5) * 4;
    this.speedY = (Math.random() - 0.5) * 4;
    this.color = ['#0066ff', '#ffdd00', '#00d9ff', '#9d4edd'][Math.floor(Math.random() * 4)];
    this.opacity = Math.random() * 0.5 + 0.3;
    this.life = 1;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.life -= 0.01;
    this.opacity = this.life * 0.5;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.opacity;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

const particleCanvas = document.createElement('canvas');
particleCanvas.id = 'gt-particle-canvas';
particleCanvas.style.position = 'fixed';
particleCanvas.style.top = '0';
particleCanvas.style.left = '0';
particleCanvas.style.pointerEvents = 'none';
particleCanvas.style.zIndex = '999';
document.body.appendChild(particleCanvas);

const ctx = particleCanvas.getContext('2d');
let particles = [];

function resizeParticleCanvas() {
  particleCanvas.width = window.innerWidth;
  particleCanvas.height = window.innerHeight;
}
resizeParticleCanvas();
window.addEventListener('resize', resizeParticleCanvas);

function animateParticles() {
  if (!document.documentElement.classList.contains('acess-pausar-animacoes')) {
    ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].draw(ctx);
      if (particles[i].life <= 0) particles.splice(i, 1);
    }
  }
  requestAnimationFrame(animateParticles);
}
animateParticles();

document.addEventListener('mousemove', (e) => {
  if (document.documentElement.classList.contains('acess-pausar-animacoes')) return;
  if (Math.random() > 0.85) particles.push(new Particle(e.clientX, e.clientY));
});
document.addEventListener('click', (e) => {
  if (document.documentElement.classList.contains('acess-pausar-animacoes')) return;
  for (let i = 0; i < 15; i++) particles.push(new Particle(e.clientX, e.clientY));
});

// ============================================
// MODO ESCURO / CLARO
// ============================================

(function initTheme() {
  const saved = localStorage.getItem('gt-theme');
  if (saved === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
})();

function buildThemeToggle() {
  const btn = document.createElement('button');
  btn.id = 'btn-theme';
  btn.setAttribute('aria-label', 'Alternar modo escuro/claro');
  btn.innerHTML = `<i class="bi bi-moon-stars-fill"></i>`;
  document.body.appendChild(btn);

  function syncIcon() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    btn.innerHTML = isDark
      ? `<i class="bi bi-sun-fill"></i>`
      : `<i class="bi bi-moon-stars-fill"></i>`;
    btn.title = isDark ? 'Modo claro' : 'Modo escuro';
  }
  syncIcon();

  btn.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('gt-theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('gt-theme', 'dark');
    }
    syncIcon();
    // partícula comemorativa
    const rect = btn.getBoundingClientRect();
    for (let i = 0; i < 12; i++) particles.push(new Particle(rect.left + rect.width / 2, rect.top + rect.height / 2));
  });
}
buildThemeToggle();

// ============================================
// PAINEL DE ACESSIBILIDADE
// ============================================

(function initAcessibilidade() {
    const btnAbrir = document.getElementById('btn-acessibilidade');
    const painel = document.getElementById('painel-acessibilidade');
    const btnFechar = document.getElementById('btn-fechar-acessibilidade');
    const btnResetar = document.getElementById('btn-resetar-acessibilidade');
    if (!btnAbrir || !painel) return;

    const html = document.documentElement;

    const LIMITES_FONTE = { min: 0.85, max: 1.45, passo: 0.1 };
    const LIMITES_ESPACO = { min: 1.3, max: 2.4, passo: 0.2 };

    const estadoPadrao = {
        escalaFonte: 1,
        lineHeight: 1.6,
        altoContraste: false,
        escalaCinza: false,
        destacarLinks: false,
        fonteLeitura: false,
        pausarAnimacoes: false,
        cursorGrande: false
    };

    function carregarEstado() {
        try {
            const salvo = JSON.parse(localStorage.getItem('gt-acessibilidade') || 'null');
            return salvo ? { ...estadoPadrao, ...salvo } : { ...estadoPadrao };
        } catch (e) {
            return { ...estadoPadrao };
        }
    }

    let estado = carregarEstado();

    function salvarEstado() {
        localStorage.setItem('gt-acessibilidade', JSON.stringify(estado));
    }

    function aplicarEstado() {
        // Fonte
        if (estado.escalaFonte !== 1) {
            html.setAttribute('data-acess-fonte', 'true');
            html.style.setProperty('--acess-escala-fonte', estado.escalaFonte);
        } else {
            html.removeAttribute('data-acess-fonte');
            html.style.removeProperty('--acess-escala-fonte');
        }

        // Espaçamento entre linhas
        if (estado.lineHeight !== estadoPadrao.lineHeight) {
            html.setAttribute('data-acess-espaco', 'true');
            html.style.setProperty('--acess-line-height', estado.lineHeight);
        } else {
            html.removeAttribute('data-acess-espaco');
            html.style.removeProperty('--acess-line-height');
        }

        // Toggles simples
        html.classList.toggle('acess-alto-contraste', estado.altoContraste);
        html.classList.toggle('acess-escala-cinza', estado.escalaCinza);
        html.classList.toggle('acess-destacar-links', estado.destacarLinks);
        html.classList.toggle('acess-fonte-leitura', estado.fonteLeitura);
        html.classList.toggle('acess-pausar-animacoes', estado.pausarAnimacoes);
        html.classList.toggle('acess-cursor-grande', estado.cursorGrande);

        // Sincroniza botões de toggle visíveis
        painel.querySelectorAll('.acess-toggle').forEach((btn) => {
            const chave = mapaToggle(btn.dataset.toggle);
            const ativo = !!estado[chave];
            btn.setAttribute('aria-pressed', ativo ? 'true' : 'false');
        });
    }

    function mapaToggle(nome) {
        return {
            'alto-contraste': 'altoContraste',
            'escala-cinza': 'escalaCinza',
            'destacar-links': 'destacarLinks',
            'fonte-leitura': 'fonteLeitura',
            'pausar-animacoes': 'pausarAnimacoes',
            'cursor-grande': 'cursorGrande'
        }[nome];
    }

    // Botões de fonte
    painel.querySelectorAll('[data-acao]').forEach((btn) => {
        btn.addEventListener('click', () => {
            const acao = btn.dataset.acao;
            if (acao === 'fonte-mais') {
                estado.escalaFonte = Math.min(LIMITES_FONTE.max, +(estado.escalaFonte + LIMITES_FONTE.passo).toFixed(2));
            } else if (acao === 'fonte-menos') {
                estado.escalaFonte = Math.max(LIMITES_FONTE.min, +(estado.escalaFonte - LIMITES_FONTE.passo).toFixed(2));
            } else if (acao === 'fonte-reset') {
                estado.escalaFonte = estadoPadrao.escalaFonte;
            } else if (acao === 'espaco-mais') {
                estado.lineHeight = Math.min(LIMITES_ESPACO.max, +(estado.lineHeight + LIMITES_ESPACO.passo).toFixed(2));
            } else if (acao === 'espaco-menos') {
                estado.lineHeight = Math.max(LIMITES_ESPACO.min, +(estado.lineHeight - LIMITES_ESPACO.passo).toFixed(2));
            } else if (acao === 'espaco-reset') {
                estado.lineHeight = estadoPadrao.lineHeight;
            }
            aplicarEstado();
            salvarEstado();
        });
    });

    // Botões de toggle (liga/desliga)
    painel.querySelectorAll('.acess-toggle').forEach((btn) => {
        btn.addEventListener('click', () => {
            const chave = mapaToggle(btn.dataset.toggle);
            if (!chave) return;
            estado[chave] = !estado[chave];
            aplicarEstado();
            salvarEstado();
        });
    });

    // Resetar tudo
    if (btnResetar) {
        btnResetar.addEventListener('click', () => {
            estado = { ...estadoPadrao };
            aplicarEstado();
            salvarEstado();
        });
    }

    function abrirPainel() {
        painel.hidden = false;
        requestAnimationFrame(() => painel.classList.add('aberto'));
        btnAbrir.classList.add('painel-aberto');
        btnAbrir.setAttribute('aria-expanded', 'true');
    }

    function fecharPainel() {
        painel.classList.remove('aberto');
        btnAbrir.classList.remove('painel-aberto');
        btnAbrir.setAttribute('aria-expanded', 'false');
        setTimeout(() => { if (!painel.classList.contains('aberto')) painel.hidden = true; }, 250);
    }

    btnAbrir.addEventListener('click', () => {
        const estaAberto = painel.classList.contains('aberto');
        if (estaAberto) fecharPainel(); else abrirPainel();
    });

    if (btnFechar) btnFechar.addEventListener('click', fecharPainel);

    // Fecha clicando fora
    document.addEventListener('click', (e) => {
        if (!painel.classList.contains('aberto')) return;
        if (painel.contains(e.target) || btnAbrir.contains(e.target)) return;
        fecharPainel();
    });

    // Fecha com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && painel.classList.contains('aberto')) fecharPainel();
    });

    // Aplica estado salvo ao carregar a página
    aplicarEstado();
})();

// ============================================
// CONTADOR ANIMADO COM EFEITO FLIP
// ============================================

function animateCounter(element, target, duration = 2000) {
  const prefix = element.dataset.prefix || '';
  const suffix = element.dataset.suffix || '';
  const increment = target / (duration / 16);
  let current = 0;

  // efeito de flip visual no card
  const card = element.closest('.impact-card');
  if (card) card.classList.add('counter-running');

  const counter = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = prefix + target.toLocaleString('pt-BR') + suffix;
      clearInterval(counter);
      if (card) {
        card.classList.remove('counter-running');
        card.classList.add('counter-done');
      }
    } else {
      element.textContent = prefix + Math.floor(current).toLocaleString('pt-BR') + suffix;
    }
  }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting && !entry.target.dataset.animated) {
      const number = entry.target.querySelector('h3');
      if (number && number.dataset.count) {
        const target = parseInt(number.dataset.count);
        animateCounter(number, target);
        entry.target.dataset.animated = 'true';
      }
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.impact-card').forEach((card) => counterObserver.observe(card));

// ============================================
// EFEITO 3D SURREAL NO MOUSE
// ============================================

document.addEventListener('mousemove', (e) => {
  const cards = document.querySelectorAll('.impact-card, .learn-card, .step-card, .experience-card');
  cards.forEach((card) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = (y - rect.height / 2) / 10;
    const rotateY = (rect.width / 2 - x) / 10;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });
});

document.addEventListener('mouseleave', () => {
  document.querySelectorAll('.impact-card, .learn-card, .step-card, .experience-card').forEach((card) => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
  });
});

// ============================================
// BOTÕES COM EFEITO RIPPLE
// ============================================

document.querySelectorAll('.btn-gt, .btn').forEach((btn) => {
  btn.addEventListener('click', function (e) {
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
    ripple.classList.add('ripple');
    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    for (let i = 0; i < 20; i++) particles.push(new Particle(e.clientX, e.clientY));
    setTimeout(() => ripple.remove(), 600);
  });
});

// ============================================
// ANIMAÇÕES DE ENTRADA (SCROLL REVEAL)
// ============================================

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('gt-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

// Aplica estado inicial e observa todos os elementos animáveis
document.querySelectorAll('[data-aos]').forEach((el) => {
  el.classList.add('gt-hidden');
  revealObserver.observe(el);
});

// Também observa cards sem data-aos
document.querySelectorAll('.step-card, .learn-card, .experience-card, .insta-feature-card, .partner-slide-card').forEach((el) => {
  if (!el.classList.contains('gt-hidden')) {
    el.classList.add('gt-hidden');
    revealObserver.observe(el);
  }
});

// ============================================
// EFEITO CONFETE AO SCROLL PARA SEÇÕES
// ============================================

function createConfetti(x, y) {
  for (let i = 0; i < 30; i++) {
    const p = new Particle(x, y);
    p.speedX = (Math.random() - 0.5) * 8;
    p.speedY = (Math.random() - 0.5) * 8;
    particles.push(p);
  }
}

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting && !entry.target.dataset.confetti) {
      const rect = entry.target.getBoundingClientRect();
      createConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2);
      entry.target.dataset.confetti = 'true';
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.journey, .experience-section, .testimonials-modern, .partners-section').forEach((s) => sectionObserver.observe(s));

// Parallax removido — causava sobreposição dos impact-cards sobre o hero ao rolar.

// ============================================
// EFEITO GLITCH NO TÍTULO
// ============================================

document.querySelectorAll('.hero-content h1').forEach((title) => {
  title.addEventListener('mouseenter', () => {
    title.style.animation = 'glitch 0.3s ease-in-out';
    setTimeout(() => (title.style.animation = 'none'), 300);
  });
});

// ============================================
// HOVER NOS CARDS COM BRILHO EXTRA
// ============================================

document.querySelectorAll('.impact-card, .learn-card, .step-card, .experience-card').forEach((card) => {
  card.addEventListener('mouseenter', function () {
    const glowDiv = document.createElement('div');
    glowDiv.style.cssText = 'position:absolute;width:100%;height:100%;background:radial-gradient(circle,rgba(255,221,0,0.3) 0%,transparent 70%);pointer-events:none;animation:pulse 0.6s ease-out;top:0;left:0;';
    this.style.position = 'relative';
    this.appendChild(glowDiv);
    setTimeout(() => glowDiv.remove(), 600);
    const rect = this.getBoundingClientRect();
    for (let i = 0; i < 10; i++) particles.push(new Particle(rect.left + rect.width / 2, rect.top + rect.height / 2));
  });
});

// ============================================
// BOTÃO VOLTAR AO TOPO
// ============================================

(function initBackToTop() {
  const btn = document.getElementById('btn-topo');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    for (let i = 0; i < 20; i++) particles.push(new Particle(btn.getBoundingClientRect().left + 24, btn.getBoundingClientRect().top + 24));
  });
})();

// ============================================
// LINK ATIVO NO MENU AO SCROLLAR
// ============================================

(function initActiveNav() {
  const sections = document.querySelectorAll('section[id], div[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach((sec) => {
      if (window.scrollY >= sec.offsetTop - 80) current = sec.id;
    });
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  });
})();

// ============================================
// ESTILOS DINÂMICOS
// ============================================

const dynStyle = document.createElement('style');
dynStyle.textContent = `
  /* ---------- RIPPLE ---------- */
  .ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255,255,255,0.5);
    transform: scale(0);
    animation: ripple-animation 0.6s ease-out;
    pointer-events: none;
  }
  @keyframes ripple-animation { to { transform: scale(4); opacity: 0; } }

  /* ---------- GLITCH ---------- */
  @keyframes glitch {
    0%   { text-shadow:  2px 0 #ff006e, -2px 0 #00d9ff; }
    50%  { text-shadow: -2px 0 #ff006e,  2px 0 #00d9ff; }
    100% { text-shadow:  2px 0 #ff006e, -2px 0 #00d9ff; }
  }

  /* ---------- PULSE ---------- */
  @keyframes pulse {
    0%   { transform: scale(1);   opacity: 1; }
    100% { transform: scale(1.5); opacity: 0; }
  }

  /* ---------- CONTADOR FLIP ---------- */
  @keyframes flipIn {
    0%   { transform: rotateX(-90deg); opacity: 0; }
    100% { transform: rotateX(0deg);   opacity: 1; }
  }
  .counter-running h3 {
    animation: flipIn 0.35s ease-out;
    display: inline-block;
  }
  .counter-done {
    border-bottom-color: var(--amarelo, #f8b000) !important;
    transition: border-bottom-color 0.4s ease;
  }

  /* ---------- ANIMAÇÕES DE ENTRADA ---------- */
  .gt-hidden {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.65s ease, transform 0.65s ease;
  }
  .gt-hidden[data-aos="fade-right"] { transform: translateX(-40px); }
  .gt-hidden[data-aos="fade-left"]  { transform: translateX(40px); }
  .gt-hidden[data-aos="zoom-in"]    { transform: scale(0.88); }
  .gt-visible {
    opacity: 1 !important;
    transform: none !important;
  }

  /* ---------- BOTÃO TEMA ---------- */
  #btn-theme {
    position: fixed;
    left: 24px;
    bottom: 84px;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background-color: var(--amarelo, #f8b000);
    color: #222;
    border: none;
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 998;
    box-shadow: 0 6px 20px rgba(0,0,0,0.22);
    transition: background-color 0.3s, transform 0.3s;
  }
  #btn-theme:hover { transform: scale(1.12) rotate(20deg); }

  /* ---------- BOTÃO TOPO ---------- */
  #btn-topo {
    position: fixed;
    left: 24px;
    bottom: 24px;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background-color: var(--azul, #009bd6);
    color: #fff;
    border: none;
    font-size: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 998;
    box-shadow: 0 6px 20px rgba(0,0,0,0.22);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s, transform 0.3s;
    transform: translateY(16px);
  }
  #btn-topo.show { opacity: 1; pointer-events: auto; transform: translateY(0); }
  #btn-topo:hover { background-color: var(--azul-escuro, #006f9f); transform: translateY(-3px); }

  /* ---------- MODO ESCURO ---------- */
  [data-theme="dark"] {
    --cinza-claro: #1a1d23;
    --branco: #23272f;
    --cinza: #c8cdd6;
    --cinza-escuro: #eaeaea;
  }
  [data-theme="dark"] body {
    background-color: #1a1d23;
    color: #c8cdd6;
  }
  [data-theme="dark"] .navbar {
    background-color: #23272f !important;
    box-shadow: 0 4px 20px rgba(0,0,0,0.4);
  }
  [data-theme="dark"] .nav-link { color: #c8cdd6 !important; }
  [data-theme="dark"] .nav-link:hover,
  [data-theme="dark"] .nav-link.active { color: #00d9ff !important; }
  [data-theme="dark"] .impact-card,
  [data-theme="dark"] .learn-card,
  [data-theme="dark"] .about-box,
  [data-theme="dark"] .supporters-strip,
  [data-theme="dark"] .partner-slide-card,
  [data-theme="dark"] .experience-card,
  [data-theme="dark"] .main-testimonial {
    background-color: #2c3040 !important;
    border-color: #3a3f52 !important;
    color: #c8cdd6 !important;
  }
  [data-theme="dark"] .side-testimonial {
    background-color: #2c3040 !important;
    border: 1px solid #0291ca !important;
    border-left: 6px solid #009bd6 !important;
    color: #c8cdd6 !important;
  }
  [data-theme="dark"] .step-card {
    background-color: #2c3040 !important;
    color: #c8cdd6 !important;
  }
  [data-theme="dark"] .section-title { color: #eaeaea !important; }
  [data-theme="dark"] .section-text { color: #a0a8b8 !important; }
  [data-theme="dark"] .tag {
    background-color: #1e4a6e;
    color: #7fd8ff;
  }
  [data-theme="dark"] footer {
    background-color: #23272f !important;
    color: #c8cdd6 !important;
  }
  [data-theme="dark"] footer a { color: #c8cdd6 !important; }
  [data-theme="dark"] footer hr { border-color: #3a3f52; }
  [data-theme="dark"] .testimonial-text { color: #e0e6f0 !important; }
  [data-theme="dark"] .partners-section { background-color: #1a1d23 !important; }
  [data-theme="dark"] #btn-topo { background-color: #009bd6; }
  [data-theme="dark"] .impact-card h3 { color: #00d9ff !important; }
  [data-theme="dark"] .learn-card i { color: #00d9ff !important; }

  /* ---------- MENU ATIVO ---------- */
  .navbar .nav-link.active {
    color: var(--azul, #009bd6) !important;
    font-weight: 700;
  }
    [data-theme="dark"] .audience-box .tag { background-color: #1e3a4a !important; color: #00bfff !important; }
  [data-theme="dark"] .cta-final .tag { background-color: #1e3a4a !important; color: #00bfff !important; }
  [data-theme="dark"] .cta-final .btn-light { background-color: #1a1d23 !important; color: #ffffff !important; border: 2px solid #1a1d23 !important; }
  [data-theme="dark"] .cta-final .btn-light:hover { background-color: #ffffff !important; color: #1a1d23 !important; border: 2px solid #ffffff !important; }
  [data-theme="dark"] .cta-final .btn-outline-light { background-color: transparent !important; color: #1a1d23 !important; border: 2px solid #1a1d23 !important; }
  [data-theme="dark"] .cta-final .btn-outline-light:hover { background-color: #1a1d23 !important; color: #ffffff !important; border: 2px solid #1a1d23 !important; }
`;
document.head.appendChild(dynStyle);

// ============================================
// INSTAGRAM — CARROSSEL DESLIZANTE
// ============================================

(function initInstaCarousel() {
    const track      = document.getElementById('instaTrack');
    const prevBtn    = document.getElementById('instaPrev');
    const nextBtn    = document.getElementById('instaNext');
    const dotsWrap   = document.getElementById('instaDots');
    if (!track || !prevBtn || !nextBtn || !dotsWrap) return;

    const slides = Array.from(track.querySelectorAll('.insta-slide'));
    if (!slides.length) return;

    const GAP = 20;   // deve bater com o gap do CSS
    let current = 0;
    let dots = [];

    /* Quantos slides cabem na viewport atual */
    function getVisible() {
        const w = window.innerWidth;
        return w < 600 ? 1 : w < 992 ? 2 : 3;
    }

    /* Índice máximo que podemos navegar */
    function maxIdx() {
        return Math.max(0, slides.length - getVisible());
    }

    /* Largura de um slide (incluindo gap) */
    function slideW() {
        return slides[0].getBoundingClientRect().width + GAP;
    }

    /* Cria os dots (apenas uma vez) */
    function buildDots() {
        dotsWrap.innerHTML = '';
        dots = [];
        const total = maxIdx() + 1;
        for (let i = 0; i < total; i++) {
            const d = document.createElement('button');
            d.className = 'insta-dot' + (i === 0 ? ' active' : '');
            d.setAttribute('aria-label', 'Posição ' + (i + 1));
            d.addEventListener('click', () => goTo(i));
            dotsWrap.appendChild(d);
            dots.push(d);
        }
    }

    /* Move o carrossel para o índice pedido */
    function goTo(index) {
        current = Math.max(0, Math.min(index, maxIdx()));
        track.style.transform = 'translateX(-' + (current * slideW()) + 'px)';
        prevBtn.disabled = current === 0;
        nextBtn.disabled = current >= maxIdx();
        dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    prevBtn.addEventListener('click', () => goTo(current - 1));
    nextBtn.addEventListener('click', () => goTo(current + 1));

    /* Suporte a swipe touch */
    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
    }, { passive: true });

    /* Re-inicializa ao redimensionar */
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            buildDots();
            goTo(Math.min(current, maxIdx()));
        }, 120);
    });

    /* Inicialização — aguarda layout para medir slides */
    requestAnimationFrame(() => {
        buildDots();
        goTo(0);
    });
})();

// ============================================
// INSTAGRAM — VÍDEOS DOS REELS (hover/scroll)
// ============================================

(function initInstaVideos() {
    const videos = Array.from(document.querySelectorAll('.insta-video'));
    if (!videos.length) return;

    // Detecta se o dispositivo tem hover de mouse "de verdade"
    const hasHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (hasHover) {
        // ---- DESKTOP: toca no hover, pausa e reseta ao sair ----
        videos.forEach((video) => {
            const card = video.closest('.insta-feature-card');
            if (!card) return;

            card.addEventListener('mouseenter', () => {
                video.currentTime = 0;
                video.play().catch(() => {});
            });

            card.addEventListener('mouseleave', () => {
                video.pause();
                video.currentTime = 0;
            });
        });
    } else {
        // ---- MOBILE/TABLET: toca automaticamente quando o card entra na tela ----
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const video = entry.target;
                if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
                    video.play().catch(() => {});
                } else {
                    video.pause();
                }
            });
        }, { threshold: [0, 0.6, 1] });

        videos.forEach((video) => observer.observe(video));
    }
})();

console.log('🎨 Galera Tech - Efeitos Surreais Ativados!');
console.log('✨ Partículas psicodélicas em movimento');
console.log('🌙 Modo escuro/claro ativo');
console.log('⬆️  Botão voltar ao topo ativo');
console.log('🎯 Todos os efeitos aplicados com sucesso!');


/* ===== FIX DEPOIMENTOS ===== */
(function(){
  var s=document.createElement('style');
  s.textContent='#depoimentosLaterais *,#depoimentoPrincipal{transform:none!important;opacity:1!important;visibility:visible!important;}';
  document.head.appendChild(s);
  new MutationObserver(function(){
    [].forEach.call(document.querySelectorAll('#depoimentosLaterais .side-testimonial,#depoimentoPrincipal'),function(el){
      el.classList.remove('gt-hidden');
      el.removeAttribute('style');
    });
  }).observe(document.getElementById('depoimentosLaterais')||document.body,{childList:true,subtree:true});
})();