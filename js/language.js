/**
 * Modern iki dilli çeviri sistemi
 * Dil dosyalarını dinamik olarak yükler ve UI'yı günceller
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log('Dil sistemi başlatılıyor');
  
  // Mevcut dil seçimini localStorage'dan al veya varsayılan olarak 'tr' kullan
  let currentLang = localStorage.getItem('language') || 'tr';
  
  // DOM tamamen yüklendiğinden emin olmak için kısa bir gecikmeyle başlat
  setTimeout(initLanguageSystem, 500);
  
  /**
   * UI'ı çevirilerle güncelle - Global olarak tanımlandı
   */
  function updateUI(translations) {
    const elements = document.querySelectorAll('[data-key]');
    
    elements.forEach(el => {
        const key = el.getAttribute('data-key');
        const hasLink = el.getAttribute('data-has-link') === 'true';
        
        if (translations[key]) {
            if (hasLink) {
                // Güvenli bir şekilde HTML oluştur
                const linkData = translations[key + 'Link'] || {};
                el.innerHTML = formatTextWithLink(translations[key], linkData.url, linkData.text);
            } else {
                el.textContent = translations[key];
            }
        } else {
            // Yedek çeviri sistemini kullan
            el.textContent = getDefaultTranslation(key) || key;
        }
        
        // Yer tutucu (placeholder) özelliği varsa güncelle
        if (el.hasAttribute('placeholder') && translations[key + 'Placeholder']) {
          el.setAttribute('placeholder', translations[key + 'Placeholder']);
        }
    });
  }
  
  /**
   * Dil UI elementlerini güncelle - Global olarak tanımlandı
   */
  function updateLanguageUI() {
    // Seçicideki dil kodunu güncelle
    const currentLangCodeEl = document.getElementById('current-lang-code');
    if (currentLangCodeEl) {
      currentLangCodeEl.textContent = currentLang.toUpperCase();
    }
    
    // Dropdown seçeneklerindeki aktif sınıfını güncelle
    document.querySelectorAll('.lang-option').forEach(option => {
      const optionLang = option.getAttribute('data-lang');
      if (optionLang === currentLang) {
        option.classList.add('active');
      } else {
        option.classList.remove('active');
      }
    });
    
    // HTML lang niteliğini güncelle
    document.documentElement.lang = currentLang;
  }
  
  /**
   * Aktif dili ayarla, çevirileri yükle ve UI'ı güncelle - Global olarak tanımlandı
   */
  async function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('language', lang);
    
    // Çeviri dosyasını dinamik olarak yükle
    try {
      // Çeviri dosyasını dinamik import ile yükle
      const translationModule = await import(`../translations/${lang}.js`);
      const translations = translationModule.translations;
      console.log(`Dil yüklendi: ${lang}`);
      
      // UI'ı yeni çevirilerle güncelle
      updateUI(translations);
      
      // Dil UI elementlerini güncelle
      updateLanguageUI();
    } catch (error) {
      console.error(`"${lang}" dil dosyası yüklenemedi:`, error);
    }
  }
  
  /**
   * Dil sistemini başlat
   */
  async function initLanguageSystem() {
    // DOM elementlerine referanslar
    const currentLangEl = document.getElementById('current-lang');
    const currentLangCodeEl = document.getElementById('current-lang-code');
    const langDropdown = document.getElementById('lang-dropdown');
    
    // Elementler bulunamazsa uyarı ver
    if (!currentLangEl) console.warn('Dil seçim butonu bulunamadı (#current-lang)');
    if (!langDropdown) console.warn('Dil dropdown menüsü bulunamadı (#lang-dropdown)');
    
    // Dil seçici DOM'da mevcutsa
    if (currentLangEl && langDropdown) {
      console.log('Dil menüsü elementleri bulundu, olay dinleyicileri ekleniyor');
      
      // Dil menüsünü açıp kapama
      currentLangEl.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Dil düğmesine tıklandı');
        
        currentLangEl.classList.toggle('active');
        langDropdown.classList.toggle('active');
      });
      
      // Dil seçeneklerini bul
      const langOptions = document.querySelectorAll('.lang-option');
      if (langOptions.length === 0) console.warn('Dil seçenekleri bulunamadı (.lang-option)');
      
      // Her dil seçeneğine tıklama olayı ekle
      langOptions.forEach(option => {
        option.addEventListener('click', async function(e) {
          e.preventDefault();
          e.stopPropagation();
          
          const lang = this.getAttribute('data-lang');
          console.log(`Dil değiştiriliyor: ${lang}`);
          
          // Dili değiştir ve UI'ı güncelle
          await setLanguage(lang);
          
          // Dropdown'ı kapat
          currentLangEl.classList.remove('active');
          langDropdown.classList.remove('active');
        });
      });
      
      // Dropdown dışına tıklandığında kapat
      document.addEventListener('click', function(event) {
        if (currentLangEl && !currentLangEl.contains(event.target) && !langDropdown.contains(event.target)) {
          currentLangEl.classList.remove('active');
          langDropdown.classList.remove('active');
        }
      });
      
      // Başlangıçta seçili dili yükle
      await setLanguage(currentLang);
    }
  }

  // HTML parçaları yüklendiğinde tekrardan çeviri yapmak için olay dinleyici ekle
  document.addEventListener('partialLoaded', async function(e) {
    console.log(`Parça yüklendi: ${e.detail}, çeviriler tekrar uygulanıyor`);
    
    // Mevcut dili al ve çevirileri uygula
    try {
      const translationModule = await import(`../translations/${currentLang}.js`);
      const translations = translationModule.translations;
      updateUI(translations);
      updateLanguageUI();
    } catch (error) {
      console.error(`Yeniden çevirmede hata: ${error}`);
    }
  });
});
