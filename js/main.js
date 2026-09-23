// ==========================================================================
// Configuração — preencha os IDs para ativar o rastreamento.
// Se ficarem vazios, os scripts do Pixel e do GA4 não são carregados.
// ==========================================================================
const META_PIXEL_ID = "";
const GA4_ID = "";

const WHATSAPP_NUMBER = "5561982750728";
const WHATSAPP_MESSAGES = {
    teste: "Oi Matheus, vim pelo site e quero as 3 variações grátis do meu anúncio.",
    essencial: "Oi Matheus, vim pelo site e tenho interesse no plano Essencial de variações de criativos.",
    escala: "Oi Matheus, vim pelo site e tenho interesse no plano Escala de variações de criativos.",
    extras: "Oi Matheus, vim pelo site e queria saber sobre gestão de tráfego pago.",
    sites: "Oi Matheus, vim pelo site e quero um orçamento de site / landing page.",
    geral: "Oi Matheus, vim pelo seu site e queria conversar sobre um projeto.",
    contato: "Oi Matheus, vim pelo site e queria tirar uma dúvida."
};

// ---------- Rastreamento ----------
function loadMetaPixel(id) {
    /* eslint-disable */
    !function (f, b, e, v, n, t, s) {
        if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
        if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
        t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */
    fbq('init', id);
    fbq('track', 'PageView');
}

function loadGA4(id) {
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', id);
}

if (META_PIXEL_ID) loadMetaPixel(META_PIXEL_ID);
if (GA4_ID) loadGA4(GA4_ID);

function trackLead(origin) {
    const page = location.pathname.split('/').filter(Boolean)[0] || 'inicio';
    if (window.fbq) fbq('track', 'Lead', { content_name: origin, content_category: page });
    if (window.gtag) gtag('event', 'generate_lead', { lead_source: origin, page_section: page });
}

// ---------- Links de WhatsApp ----------
document.querySelectorAll('[data-wa]').forEach((link) => {
    const key = link.dataset.wa;
    const text = WHATSAPP_MESSAGES[key] || WHATSAPP_MESSAGES.teste;
    link.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    link.addEventListener('click', () => trackLead(key));
});

// ---------- Header e menu mobile ----------
const header = document.querySelector('.header');
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.getElementById('menu');

function setMenu(open) {
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.querySelector('.visually-hidden').textContent = open ? 'Fechar menu' : 'Abrir menu';
    nav.classList.toggle('is-open', open);
}

if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
        setMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
    });
    nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav.classList.contains('is-open')) {
            setMenu(false);
            menuToggle.focus();
        }
    });
}

const onScroll = () => header && header.classList.toggle('is-scrolled', window.scrollY > 8);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ---------- Acordeão (FAQ) ----------
document.querySelectorAll('.faq-item button').forEach((btn) => {
    btn.addEventListener('click', () => {
        const open = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!open));
        document.getElementById(btn.getAttribute('aria-controls')).hidden = open;
    });
});

// ---------- Animação ao rolar ----------
const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach((el) => revealObserver.observe(el));
} else {
    reveals.forEach((el) => el.classList.add('is-visible'));
}

// ---------- Vídeos sob demanda ----------
// O arquivo só recebe src quando o vídeo chega perto da tela.
// Vídeos com data-autoplay (hero) tocam sem som em loop e pausam fora da tela.
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const videos = document.querySelectorAll('video.lazy-video');

function attachSource(video) {
    if (video.dataset.loaded) return;
    video.src = video.dataset.src;
    video.dataset.loaded = 'true';
}

if ('IntersectionObserver' in window) {
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            const video = entry.target;
            if (entry.isIntersecting) {
                attachSource(video);
                if (video.hasAttribute('data-autoplay') && !reduceMotion) {
                    video.play().catch(() => {});
                }
            } else if (video.hasAttribute('data-autoplay')) {
                video.pause();
            }
        });
    }, { rootMargin: '200px 0px' });
    videos.forEach((v) => videoObserver.observe(v));
} else {
    videos.forEach(attachSource);
}

// Pausa os outros vídeos quando um começa a tocar
videos.forEach((v) => {
    v.addEventListener('play', () => {
        videos.forEach((other) => {
            if (other !== v && !other.hasAttribute('data-autoplay')) other.pause();
        });
    });
});

// ---------- Currículo em PDF (página /portfolio) ----------
// Abre a janela de impressão; lá o visitante escolhe "Salvar como PDF".
document.querySelectorAll('.js-print').forEach((btn) => {
    btn.addEventListener('click', () => window.print());
});

// ---------- Ano do copyright ----------
const ano = document.getElementById('ano');
if (ano) ano.textContent = new Date().getFullYear();
