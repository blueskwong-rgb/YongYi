/* ============================================================
   Yongyi Blow Molding — Shared JavaScript
   Apple-Style, minimal, production-grade
   ============================================================ */

/* --- Shared Translations (nav, footer, modal, common) --- */
const sharedTranslations = {
  zh: {
    'nav.products':'产品展示','nav.hardware':'硬件实力','nav.facility':'关于我们','nav.team':'领导团队','nav.cta':'获取报价',
    'footer.copyright':'© 2026 永益吹塑制品厂. 保留所有权利。','footer.products':'产品展示','footer.hardware':'硬件实力','footer.facility':'关于我们','footer.team':'领导团队',
    'quote.title':'获取免费报价','quote.subtitle':'填写以下表单，我们将在24小时内回复您。','quote.name':'您的姓名 *','quote.email':'邮箱地址 *','quote.company':'公司名称（选填）','quote.phone':'联系电话（选填）','quote.message':'留言 / 需求描述','quote.submit':'提交询价 →','quote.successTitle':'感谢您的询价！','quote.successMsg':'您的询价已提交。我们的团队将在24小时内给您发送详细报价。',
    'common.learnMore':'了解更多','common.close':'关闭',
  },
  en: {
    'nav.products':'Products','nav.hardware':'Hardware','nav.facility':'About Us','nav.team':'Leadership','nav.cta':'Get a Quote',
    'footer.copyright':'© 2026 Yongyi Blow Molding. All rights reserved.','footer.products':'Products','footer.hardware':'Hardware','footer.facility':'About Us','footer.team':'Leadership',
    'quote.title':'Get a Free Quote','quote.subtitle':'Fill out the form below and we\'ll get back to you within 24 hours.','quote.name':'Your Name *','quote.email':'Email Address *','quote.company':'Company (Optional)','quote.phone':'Phone (Optional)','quote.message':'Message / Requirements','quote.submit':'Submit Request →','quote.successTitle':'Thank You!','quote.successMsg':'Your inquiry has been submitted. Our team will get back to you with a detailed quote within 24 hours.',
    'common.learnMore':'Learn More','common.close':'Close',
  },
  es: {
    'nav.products':'Productos','nav.hardware':'Maquinaria','nav.facility':'Sobre Nosotros','nav.team':'Liderazgo','nav.cta':'Solicitar Presupuesto',
    'footer.copyright':'© 2026 Yongyi Blow Molding. Todos los derechos reservados.','footer.products':'Productos','footer.hardware':'Maquinaria','footer.facility':'Sobre Nosotros','footer.team':'Liderazgo',
    'quote.title':'Solicitar Presupuesto Gratis','quote.subtitle':'Complete el formulario y le responderemos en 24 horas.','quote.name':'Su Nombre *','quote.email':'Correo Electrónico *','quote.company':'Empresa (Opcional)','quote.phone':'Teléfono (Opcional)','quote.message':'Mensaje / Requisitos','quote.submit':'Enviar Consulta →','quote.successTitle':'¡Gracias!','quote.successMsg':'Su consulta ha sido enviada. Nuestro equipo le enviará un presupuesto detallado en 24 horas.',
    'common.learnMore':'Más Información','common.close':'Cerrar',
  }
};

// Merge page-specific translations
let translations = {};

function mergeTranslations(pageTrans) {
  translations = { zh:{}, en:{}, es:{} };
  for (const lang of ['zh','en','es']) {
    Object.assign(translations[lang], sharedTranslations[lang], pageTrans[lang] || {});
  }
}

/* --- Language --- */
function getLang() {
  return localStorage.getItem('blowmold-lang') || 'en';
}

function setLang(lang) {
  localStorage.setItem('blowmold-lang', lang);
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : lang === 'es' ? 'es' : 'en';
  document.querySelectorAll('.lang-switcher button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
  const dict = translations[lang];
  if (!dict) return;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (dict[key]) el.textContent = dict[key];
  });
  // Update page title
  if (dict['page.title']) document.title = dict['page.title'];
}

/* --- Navigation --- */
const nav = document.getElementById('nav');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  document.querySelectorAll('.mobile-menu-panel a, .mobile-menu-panel .nav-cta').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

/* --- Scroll Reveal --- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '-40px 0px' });

document.querySelectorAll('.reveal, .reveal-img').forEach(el => revealObserver.observe(el));

/* --- Counter Animation --- */
function animateCounter(el, target, duration) {
  const start = 0;
  const startTime = performance.now();
  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.floor(start + (target - start) * eased);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  }
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('[data-count]').forEach(el => {
        const target = parseInt(el.dataset.count, 10);
        animateCounter(el, target, 2000);
      });
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats-section');
if (statsSection) counterObserver.observe(statsSection);

/* --- Quote Modal --- */
function openQuote() {
  const modal = document.getElementById('quoteModal');
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeQuote() {
  const modal = document.getElementById('quoteModal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    // Reset form
    const form = modal.querySelector('form');
    const success = modal.querySelector('.form-success');
    if (form && success) {
      form.style.display = 'block';
      success.style.display = 'none';
      form.reset();
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Close modal on overlay click
  const modal = document.getElementById('quoteModal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeQuote();
    });
  }
  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('open')) closeQuote();
  });

  // Handle form submission
  const quoteForm = document.getElementById('quoteForm');
  if (quoteForm) {
    quoteForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const form = e.target;
      const submitBtn = form.querySelector('.form-submit');
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
      try {
        const formData = new FormData(form);
        formData.append('access_key', 'f0766eed-e23f-46c4-be74-07189bffd2dc');
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });
        if (res.ok) {
          form.style.display = 'none';
          modal.querySelector('.form-success').style.display = 'block';
        } else {
          alert('Submission failed. Please email us at 13711898174@163.com');
        }
      } catch (err) {
        alert('Network error. Please email us at 13711898174@163.com');
      }
      submitBtn.textContent = translations[getLang()]?.['quote.submit'] || 'Submit Request →';
      submitBtn.disabled = false;
    });
  }

  // Initialize language
  const lang = getLang();
  setLang(lang);

  // Factory Carousel (only on index.html)
  var carousel = document.getElementById('factoryCarousel');
  if (carousel) {
    var slides = carousel.querySelectorAll('.carousel-slide');
    var dots = document.querySelectorAll('#carouselDots button');
    var total = slides.length;
    var index = 0;
    var timer;

    window.carouselGo = function(i) {
      index = i;
      slides.forEach(function(s,x){ s.classList.toggle('active', x===i); });
      dots.forEach(function(d,x){ d.classList.toggle('active', x===i); });
    };
    window.carouselPrev = function() {
      carouselGo((index - 1 + total) % total);
      clearInterval(timer);
      timer = setInterval(window.carouselNext, 5000);
    };
    window.carouselNext = function() {
      carouselGo((index + 1) % total);
      clearInterval(timer);
      timer = setInterval(window.carouselNext, 5000);
    };
    timer = setInterval(window.carouselNext, 5000);
    carousel.addEventListener('mouseenter', function(){ clearInterval(timer); });
    carousel.addEventListener('mouseleave', function(){ timer = setInterval(window.carouselNext, 5000); });
  }
});
