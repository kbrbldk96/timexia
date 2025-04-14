// Main JavaScript file

document.addEventListener('DOMContentLoaded', () => {
  // Loader handling
  const loader = document.getElementById('loader');
  
  if (loader) {
    // Sayfa başladığında loader'ı görünür yap (eğer zaten değilse)
    loader.classList.remove('hidden');
    
    // Hide loader when everything is loaded
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('hidden');
        
        // Sayfa tamamen yüklendiğinde görünür olan öğeleri aktifleştir
        setTimeout(() => {
          initScrollAnimations();
        }, 400);
      }, 500); // 500ms delay for smooth transition
    });
    
    // Show loader on page navigation
    document.querySelectorAll('a').forEach(link => {
      // Only for internal links that lead to other pages
      if (link.href && link.hostname === window.location.hostname && !link.href.includes('#')) {
        link.addEventListener('click', (e) => {
          // Don't show loader for same-page navigation
          const currentPath = window.location.pathname.split('/').pop() || 'index.html';
          const linkPath = link.pathname.split('/').pop() || 'index.html';
          
          if (currentPath !== linkPath) {
            e.preventDefault();
            loader.classList.remove('hidden');
            
            setTimeout(() => {
              window.location.href = link.href;
            }, 300); // Short delay to show loader
          }
        });
      }
    });
  }
  
  // Mobile navigation toggle
  const mobileNavBtn = document.querySelector('.btn-mobile-nav');
  const navMenu = document.querySelector('.nav-menu');
  
  if (mobileNavBtn && navMenu) {
    mobileNavBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      mobileNavBtn.classList.toggle('active');
    });
  }
  
  // Modern navigation toggle - Düzeltilmiş menü işlevselliği
  const mobileToggle = document.getElementById('mobile-toggle');
  const mainNav = document.getElementById('main-nav');
  
  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      mainNav.classList.toggle('active');
      document.body.classList.toggle('menu-open');
      
      // Menü açık olduğunda dokunmatik arayüzlerde scroll engelleme
      if (mainNav.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });
    
    // Menü içindeki linklere tıklayınca menüyü kapat
    const menuLinks = mainNav.querySelectorAll('a');
    menuLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        mainNav.classList.remove('active');
        document.body.classList.remove('menu-open');
        document.body.style.overflow = '';
      });
    });
  }
  
  // Active link class
  const setActiveLink = () => {
    const currentPath = window.location.pathname;
    const currentHash = window.location.hash;
    
    document.querySelectorAll('.header__menu-link').forEach(link => {
      const href = link.getAttribute('href');
      
      // Hash için kontrol (örn. #features)
      if (href.startsWith('#') && href === currentHash) {
        link.classList.add('active');
      } 
      // Sayfa için kontrol
      else if (!href.startsWith('#') && currentPath.includes(href)) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  };
  
  // Set active link on page load
  setActiveLink();
  
  // Set active link when hash changes
  window.addEventListener('hashchange', setActiveLink);
  
  // Form validation
  const forms = document.querySelectorAll('form[data-netlify="true"]');
  
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      const requiredFields = form.querySelectorAll('[required]');
      let isValid = true;
      
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          isValid = false;
          // Add error class
          field.classList.add('error');
        } else {
          field.classList.remove('error');
        }
      });
      
      if (!isValid) {
        e.preventDefault();
        alert('Lütfen tüm zorunlu alanları doldurun.');
      }
    });
  });
  
  // Date picker validation - prevent past dates
  const dateInput = document.getElementById('date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }
  
  /**
   * Kaydırma (Scroll) animasyonları için IntersectionObserver oluşturur
   */
  function initScrollAnimations() {
    // Animasyon yapılacak tüm öğeleri seç
    const animatedElements = document.querySelectorAll('.fade-in-up');
    
    if (animatedElements.length === 0) return;
    
    console.log('Scroll animasyonları başlatılıyor...');
    
    // IntersectionObserver oluştur
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // Eğer öğe görünür alandaysa
        if (entry.isIntersecting) {
          // Öğe görünür olduğunda .visible sınıfını ekle
          entry.target.classList.add('visible');
        } else {
          // Öğe görünmez olduğunda .visible sınıfını kaldır
          // böylece tekrar görünür olduğunda animasyon tekrarlanır
          entry.target.classList.remove('visible');
        }
      });
    }, {
      root: null,          // Viewport'a göre izle
      rootMargin: '0px',   // Margin yok
      threshold: 0.1       // Öğenin %10'u görünür olduğunda tetikle
    });
    
    // Tüm animasyon öğelerini izle
    animatedElements.forEach(element => {
      observer.observe(element);
    });
  }
  
  // Sayfa içeriği yüklenir yüklenmez scroll animasyonlarını başlat
  if (document.readyState === 'complete') {
    initScrollAnimations();
  } else {
    // Eğer hala yükleniyor ise, yükleme tamamlandığında başlat
    document.addEventListener('DOMContentLoaded', initScrollAnimations);
  }

  // Carousel functionality
  function initCarousel() {
    const track = document.querySelector('.carousel-track');
    const items = document.querySelectorAll('.carousel-item');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const dots = document.querySelectorAll('.dot');
    
    if (!track || !items.length || !prevBtn || !nextBtn) return;
    
    let currentIndex = 0;
    let itemsPerView = getItemsPerView();
    let totalPages = Math.ceil(items.length / itemsPerView);
    
    // Update itemsPerView on window resize
    window.addEventListener('resize', () => {
      itemsPerView = getItemsPerView();
      totalPages = Math.ceil(items.length / itemsPerView);
      goToSlide(currentIndex);
      updateDots();
    });
    
    function getItemsPerView() {
      if (window.innerWidth < 768) return 1; // Mobile
      if (window.innerWidth < 1200) return 2; // Tablet
      return 3; // Desktop
    }
    
    function goToSlide(index) {
      currentIndex = index;
      
      // Make sure currentIndex is within bounds
      if (currentIndex < 0) currentIndex = 0;
      if (currentIndex > totalPages - 1) currentIndex = totalPages - 1;
      
      const offset = currentIndex * (-100 / itemsPerView);
      track.style.transform = `translateX(${offset}%)`;
      
      updateDots();
    }
    
    function updateDots() {
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    }
    
    // Navigation buttons
    prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
    
    // Dots navigation
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => goToSlide(i));
    });
    
    // Initialize
    goToSlide(0);
  }
  
  // Initialize carousel when DOM is loaded
  document.addEventListener('DOMContentLoaded', initCarousel);

  /**
   * Timeline görünürlük animasyonlarını başlatan fonksiyon
   */
  function initTimelineAnimations() {
    const timelineItems = document.querySelectorAll('.timeline-item[data-scroll-reveal]');
    
    if (timelineItems.length === 0) return;
    
    console.log('Timeline animasyonları başlatılıyor...', timelineItems.length);
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Görünür olduğunda sınıf ekle
          entry.target.classList.add('is-visible');
          
          // Bir kez göründükten sonra izlemeyi bırak
          observer.unobserve(entry.target);
        }
      });
    }, { 
      threshold: 0.25,  // Ne kadarı görünür olduğunda tetiklenecek
      rootMargin: '0px 0px -100px 0px'  // Alt kenardan 100px önce tetiklenecek
    });
    
    // Her timeline öğesini izle
    timelineItems.forEach(item => {
      observer.observe(item);
    });
  }

  // Timeline animasyonlarını başlat
  initTimelineAnimations();

  /**
   * Fiyatlandırma toggle'ı için işlevsellik
   */
  function initPricingToggle() {
    const toggle = document.getElementById('pricing-switch');
    if (!toggle) return;
    
    const monthlyPrices = document.querySelectorAll('.price.monthly');
    const yearlyPrices = document.querySelectorAll('.price.yearly');
    const monthlyText = document.querySelector('.pricing-toggle-text[data-period="monthly"]');
    const yearlyText = document.querySelector('.pricing-toggle-text[data-period="yearly"]');
    
    toggle.addEventListener('change', function() {
      if (this.checked) {
        // Yıllık fiyatlar
        monthlyPrices.forEach(el => el.classList.add('hidden'));
        yearlyPrices.forEach(el => el.classList.remove('hidden'));
        monthlyText.classList.remove('active');
        yearlyText.classList.add('active');
      } else {
        // Aylık fiyatlar
        yearlyPrices.forEach(el => el.classList.add('hidden'));
        monthlyPrices.forEach(el => el.classList.remove('hidden'));
        yearlyText.classList.remove('active');
        monthlyText.classList.add('active');
      }
    });
    
    // Toggle text'lere tıklama
    monthlyText.addEventListener('click', function() {
      toggle.checked = false;
      toggle.dispatchEvent(new Event('change'));
    });
    
    yearlyText.addEventListener('click', function() {
      toggle.checked = true;
      toggle.dispatchEvent(new Event('change'));
    });
  }

  // Fiyatlandırma toggle'ını başlat
  initPricingToggle();

  /**
   * SSS (FAQ) akordeon fonksiyonu
   */
  function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (!faqItems.length) return;
    
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');
      
      if (question && answer) {
        // Hem tıklama hem de dokunma olaylarını destekle
        question.addEventListener('click', toggleAccordion);
        
        // Touch cihazlar için dokunma olayı ekle
        question.addEventListener('touchstart', function(e) {
          // Varsayılan davranışı engelle (kaydırma vs.)
          e.preventDefault();
          toggleAccordion();
        }, { passive: false });
        
        // Başlangıçta tüm cevapları gizle
        answer.style.maxHeight = '0px';
      }
      
      // Akordeon toggle fonksiyonu
      function toggleAccordion() {
        // Açık olan diğer SSS öğelerini kapat
        const openItem = document.querySelector('.faq-item.active');
        if (openItem && openItem !== item) {
          openItem.classList.remove('active');
          const openAnswer = openItem.querySelector('.faq-answer');
          if (openAnswer) openAnswer.style.maxHeight = '0px';
        }
        
        // Tıklanan öğeyi aç/kapat
        item.classList.toggle('active');
        
        if (item.classList.contains('active')) {
          // Yüksekliği dinamik olarak hesapla
          answer.style.maxHeight = answer.scrollHeight + 'px';
          
          // Mobil cihazlarda açılan öğeye otomatik kaydır
          if (window.innerWidth <= 768) {
            setTimeout(() => {
              const rect = item.getBoundingClientRect();
              const isInViewport = (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= window.innerHeight &&
                rect.right <= window.innerWidth
              );
              
              if (!isInViewport) {
                item.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start'
                });
              }
            }, 300); // Animasyon tamamlandıktan sonra kaydır
          }
        } else {
          answer.style.maxHeight = '0px';
        }
      }
    });
  }

  // SSS akordeonunu başlat
  initFaqAccordion();
});

// Dokunmatik cihaz sorunu düzeltmesi
document.addEventListener('DOMContentLoaded', function() {
  // Dokunmatik cihaz tespiti
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
  
  if (isTouchDevice) {
    document.documentElement.classList.add('touch-device');
    
    // Tüm swiper konteynerlerine touch-fix sınıfı ekle
    const swiperContainers = document.querySelectorAll('.swiper-container');
    swiperContainers.forEach(container => {
      container.classList.add('touch-fix');
    });
    
    // iOS için özel düzeltme
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      document.documentElement.classList.add('ios-device');
    }
  }
  
  // Yatay taşma sorunu için tüm sayfayı kontrol et
  function checkOverflow() {
    const body = document.body;
    const html = document.documentElement;
    
    if (body.offsetWidth > window.innerWidth) {
      console.log('Yatay taşma tespit edildi, düzeltiliyor...');
      body.style.overflowX = 'hidden';
      html.style.overflowX = 'hidden';
    }
  }
  
  // Sayfa yüklendikten sonra ve pencere boyutunu değiştirdiğimizde kontrol et
  window.addEventListener('load', checkOverflow);
  window.addEventListener('resize', checkOverflow);
});
