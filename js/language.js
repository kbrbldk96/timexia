/**
 * Modern iki dilli çeviri sistemi
 * Dil dosyalarını dinamik olarak yükler ve UI'yı günceller
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log('Dil sistemi başlatılıyor');
  
  // DOM tamamen yüklendiğinden emin olmak için kısa bir gecikmeyle başlat
  setTimeout(initLanguageSystem, 500);
  
  /**
   * Dil sistemini başlat
   */
  async function initLanguageSystem() {
    // Mevcut dil seçimini localStorage'dan al veya varsayılan olarak 'tr' kullan
    let currentLang = localStorage.getItem('language') || 'tr';
    
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
    
    /**
     * Aktif dili ayarla, çevirileri yükle ve UI'ı güncelle
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
     * UI'ı çevirilerle güncelle
     */
    function updateUI(translations) {
      // data-key niteliğine sahip tüm elementleri bul
      const elements = document.querySelectorAll('[data-key]');
      console.log(`Çevrilecek element sayısı: ${elements.length}`);
      
      // Her elementin içeriğini ilgili çeviriyle güncelle
      elements.forEach(el => {
        const key = el.getAttribute('data-key');
        
        // Çeviri bulunamazsa anahtar adını kullan
        if (translations[key]) {
          el.textContent = translations[key];
        } else {
          console.warn(`Çeviri bulunamadı: ${key}`);
          el.textContent = key; // Anahtar adına dön
        }
        
        // Yer tutucu (placeholder) özelliği varsa güncelle
        if (el.hasAttribute('placeholder') && translations[key + 'Placeholder']) {
          el.setAttribute('placeholder', translations[key + 'Placeholder']);
        }
      });
    }
    
    /**
     * Dil UI elementlerini güncelle
     */
    function updateLanguageUI() {
      // Seçicideki dil kodunu güncelle
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
  }

  // HTML parçaları yüklendiğinde tekrardan çeviri yapmak için olay dinleyici ekle
  document.addEventListener('partialLoaded', async function(e) {
    console.log(`Parça yüklendi: ${e.detail}, çeviriler tekrar uygulanıyor`);
    
    // Mevcut dili al ve çevirileri uygula
    const currentLang = localStorage.getItem('language') || 'tr';
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
