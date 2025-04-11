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
  
  // Modern navigation toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const mainNav = document.getElementById('main-nav');
  
  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      mainNav.classList.toggle('active');
      document.body.classList.toggle('menu-open'); // Body scroll'u engellemek için
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
});
