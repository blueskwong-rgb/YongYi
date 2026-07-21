/* ============================================================
   Yongyi Blow Molding — Shared JavaScript
   SEO-optimized: URL-path language detection, clean URL nav
   ============================================================ */

/* --- Shared Translations (nav, footer, modal, common) --- */
const sharedTranslations = {
  zh: {
    'nav.products':'产品展示','nav.hardware':'硬件实力','nav.facility':'关于我们','nav.team':'领导团队','nav.cta':'获取报价',
    'footer.copyright':'© 2026 永益吹塑制品厂. 保留所有权利。','footer.products':'产品展示','footer.hardware':'硬件实力','footer.facility':'关于我们','footer.team':'领导团队',
    'quote.title':'获取免费报价','quote.subtitle':'填写以下表单，我们将在24小时内回复您。','quote.name':'您的姓名 *','quote.email':'邮箱地址 *','quote.company':'公司名称（选填）','quote.phone':'联系电话（选填）','quote.message':'留言 / 需求描述','quote.submit':'提交询价 →','quote.successTitle':'感谢您的询价！','quote.successMsg':'您的询价已提交。我们的团队将在24小时内给您发送详细报价。',
    'p.detail.title':'产品详情','p.spec.title':'规格参数','p.related.title':'相关产品推荐','p.cta2.title':'需要定制方案？','p.cta2.subtitle':'支持 OEM/ODM 定制，提供全流程吹塑制品解决方案','p.cta2.btn':'立即咨询 →','p.cta':'获取免费报价 →',
    'common.learnMore':'了解更多','common.close':'关闭','common.inquire':'查看详情',
    'breadcrumb.home':'首页','breadcrumb.products':'产品展示','breadcrumb.faq':'常见问题','breadcrumb.contact':'联系我们',
    'footer.faq':'常见问题',
    'form.sending':'发送中...',
    'a11y.menu':'菜单','carousel.prev':'上一张','carousel.next':'下一张',
  },
  en: {
    'nav.products':'Products','nav.hardware':'Hardware','nav.facility':'About Us','nav.team':'Leadership','nav.cta':'Get a Quote',
    'footer.copyright':'© 2026 Yongyi Blow Molding. All rights reserved.','footer.products':'Products','footer.hardware':'Hardware','footer.facility':'About Us','footer.team':'Leadership',
    'quote.title':'Get a Free Quote','quote.subtitle':'Fill out the form below and we\'ll get back to you within 24 hours.','quote.name':'Your Name *','quote.email':'Email Address *','quote.company':'Company (Optional)','quote.phone':'Phone (Optional)','quote.message':'Message / Requirements','quote.submit':'Submit Request →','quote.successTitle':'Thank You!','quote.successMsg':'Your inquiry has been submitted. Our team will get back to you with a detailed quote within 24 hours.',
    'p.detail.title':'Product Details','p.spec.title':'Specifications','p.related.title':'Related Products','p.cta2.title':'Need a Custom Solution?','p.cta2.subtitle':'OEM/ODM customization available, full-process blow molding solutions','p.cta2.btn':'Inquire Now →','p.cta':'Get a Free Quote →',
    'common.learnMore':'Learn More','common.close':'Close','common.inquire':'View Details',
    'breadcrumb.home':'Home','breadcrumb.products':'Products','breadcrumb.faq':'FAQ','breadcrumb.contact':'Contact Us',
    'footer.faq':'FAQ',
    'form.sending':'Sending...',
    'a11y.menu':'Menu','carousel.prev':'Previous','carousel.next':'Next',
  },
  es: {
    'nav.products':'Productos','nav.hardware':'Maquinaria','nav.facility':'Sobre Nosotros','nav.team':'Liderazgo','nav.cta':'Solicitar Presupuesto',
    'footer.copyright':'© 2026 Yongyi Blow Molding. Todos los derechos reservados.','footer.products':'Productos','footer.hardware':'Maquinaria','footer.facility':'Sobre Nosotros','footer.team':'Liderazgo',
    'quote.title':'Solicitar Presupuesto Gratis','quote.subtitle':'Complete el formulario y le responderemos en 24 horas.','quote.name':'Su Nombre *','quote.email':'Correo Electrónico *','quote.company':'Empresa (Opcional)','quote.phone':'Teléfono (Opcional)','quote.message':'Mensaje / Requisitos','quote.submit':'Enviar Consulta →','quote.successTitle':'¡Gracias!','quote.successMsg':'Su consulta ha sido enviada. Nuestro equipo le enviará un presupuesto detallado en 24 horas.',
    'p.detail.title':'Detalles del Producto','p.spec.title':'Especificaciones','p.related.title':'Productos Relacionados','p.cta2.title':'¿Necesita una Solución Personalizada?','p.cta2.subtitle':'OEM/ODM disponible, soluciones integrales de moldeo por soplado','p.cta2.btn':'Consultar Ahora →','p.cta':'Obtener Presupuesto Gratis →',
    'common.learnMore':'Más Información','common.close':'Cerrar','common.inquire':'Ver Detalles',
    'breadcrumb.home':'Inicio','breadcrumb.products':'Productos','breadcrumb.faq':'FAQ','breadcrumb.contact':'Contacto',
    'footer.faq':'FAQ',
    'form.sending':'Enviando...',
    'a11y.menu':'Menú','carousel.prev':'Anterior','carousel.next':'Siguiente',
  }
};

// Merge page-specific translations
let translations = {};
window._translations = translations; // expose for debugging

function mergeTranslations(pageTrans) {
  translations = { zh:{}, en:{}, es:{} };
  for (const lang of ['zh','en','es']) {
    Object.assign(translations[lang], sharedTranslations[lang], pageTrans[lang] || {});
  }
  window._translations = translations; // keep debug ref in sync
}

/* --- Language: URL path detection (SEO-optimized) --- */
const LANG_FROM_PATH = (function(){
  var m = window.location.pathname.match(/^\/(en|zh|es)\//);
  return m ? m[1] : null;
})();

function getLang() {
  // Priority 1: URL path prefix (/en/, /zh/, /es/)
  if (LANG_FROM_PATH) return LANG_FROM_PATH;
  // Priority 2: ?hl= query param (legacy redirect support)
  var urlParams = new URLSearchParams(window.location.search);
  var hl = urlParams.get('hl');
  if (hl && ['zh','en','es'].indexOf(hl) !== -1) {
    // Redirect to path-based URL (SEO canonical)
    var cleanPath = window.location.pathname;
    var newPath = '/' + hl + (cleanPath === '/' ? '' : cleanPath);
    window.location.replace(newPath + window.location.search.replace(/[?&]hl=[^&]*/, '').replace(/^\?$/, ''));
    return hl;
  }
  // Priority 3: localStorage preference
  var saved = localStorage.getItem('blowmold-lang');
  if (saved && ['zh','en','es'].indexOf(saved) !== -1) return saved;
  // Default: Chinese
  return 'zh';
}

function setLang(lang) {
  localStorage.setItem('blowmold-lang', lang);
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : lang === 'es' ? 'es' : 'en';
  document.querySelectorAll('.lang-switcher button').forEach(function(btn) {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
  var dict = translations[lang];
  if (!dict) return;
  // textContent (primary)
  document.querySelectorAll('[data-i18n]').forEach(function(el) {
    var key = el.dataset.i18n;
    if (dict[key]) el.textContent = dict[key];
  });
  // alt attributes on images
  document.querySelectorAll('[data-i18n-alt]').forEach(function(el) {
    var key = el.dataset.i18nAlt;
    if (dict[key]) el.setAttribute('alt', dict[key]);
  });
  // aria-label attributes
  document.querySelectorAll('[data-i18n-aria]').forEach(function(el) {
    var key = el.dataset.i18nAria;
    if (dict[key]) el.setAttribute('aria-label', dict[key]);
  });
  // Update page title
  if (dict['page.title']) document.title = dict['page.title'];
  // Update meta description (if i18n key exists)
  var metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc && dict['page.desc']) metaDesc.setAttribute('content', dict['page.desc']);
  // Update og:title and og:description
  var ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle && dict['page.title']) ogTitle.setAttribute('content', dict['page.title']);
  var ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc && dict['page.desc']) ogDesc.setAttribute('content', dict['page.desc']);
  // Update og:locale
  var ogLocale = document.querySelector('meta[property="og:locale"]');
  if (ogLocale) {
    ogLocale.setAttribute('content', lang === 'zh' ? 'zh_CN' : lang === 'es' ? 'es_ES' : 'en_US');
  }
}

/* --- Navigation --- */
var nav = document.getElementById('nav');
var hamburger = document.getElementById('hamburger');
var mobileMenu = document.getElementById('mobileMenu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', function() {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  mobileMenu.addEventListener('click', function(e) {
    if (e.target === mobileMenu) {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  document.querySelectorAll('.mobile-menu-panel a, .mobile-menu-panel .nav-cta').forEach(function(link) {
    link.addEventListener('click', function() {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

/* --- Scroll Reveal --- */
var revealObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '-40px 0px' });

document.querySelectorAll('.reveal, .reveal-img').forEach(function(el) { revealObserver.observe(el); });

/* --- Counter Animation --- */
function animateCounter(el, target, duration) {
  var start = 0;
  var startTime = performance.now();
  function update(now) {
    var elapsed = now - startTime;
    var progress = Math.min(elapsed / duration, 1);
    var eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.floor(start + (target - start) * eased);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  }
  requestAnimationFrame(update);
}

var counterObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('[data-count]').forEach(function(el) {
        var target = parseInt(el.dataset.count, 10);
        animateCounter(el, target, 2000);
      });
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

var statsSection = document.querySelector('.stats-section');
if (statsSection) counterObserver.observe(statsSection);

/* --- Quote Modal --- */
function openQuote() {
  var modal = document.getElementById('quoteModal');
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeQuote() {
  var modal = document.getElementById('quoteModal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    // Reset form
    var form = modal.querySelector('form');
    var success = modal.querySelector('.form-success');
    if (form && success) {
      form.style.display = 'block';
      success.style.display = 'none';
      form.reset();
    }
  }
}

document.addEventListener('DOMContentLoaded', function() {
  // Close modal on overlay click
  var modal = document.getElementById('quoteModal');
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) closeQuote();
    });
  }
  // Close on Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal && modal.classList.contains('open')) closeQuote();
  });

  // Configure form for traditional submission (web3forms redirects to thank-you)
  var quoteForm = document.getElementById('quoteForm');
  if (quoteForm) {
    quoteForm.action = 'https://api.web3forms.com/submit';
    quoteForm.method = 'POST';
    if (!quoteForm.querySelector('[name=access_key]')) {
      var ak = document.createElement('input');
      ak.type = 'hidden'; ak.name = 'access_key';
      ak.value = 'f0766eed-e23f-46c4-be74-07189bffd2dc';
      quoteForm.appendChild(ak);
    }
    if (!quoteForm.querySelector('[name=redirect]')) {
      var rd = document.createElement('input');
      rd.type = 'hidden'; rd.name = 'redirect';
      rd.value = window.location.origin + '/thank-you/';
      quoteForm.appendChild(rd);
    }
  }

  // Initialize language
  var lang = getLang();
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

// Bind language switcher buttons — attaches event listeners
(function bindLangButtons(){
  var buttons = document.querySelectorAll('.lang-switcher button');
  for (var i = 0; i < buttons.length; i++) {
    (function(btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        var lang = btn.getAttribute('data-lang');
        if (lang) setLang(lang);
      });
    })(buttons[i]);
  }
})();
