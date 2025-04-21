/**
 * Tüm sayfalarda tutarlı çalışacak mobil menü işlevselliği
 */
(function() {
    // Sayfa yüklendiğinde veya DOM hazır olduğunda
    document.addEventListener('DOMContentLoaded', function() {
        // DOM yüklendikten sonra biraz daha bekle - bazı sayfalarda geç yüklenme sorunu için
        setTimeout(initMobileNav, 100);
    });
    
    // Header parçası load edildiğinde tekrar çalıştır (partial loading için)
    document.addEventListener('partialLoaded', function(e) {
        if (e.detail === 'header') {
            // Header yüklendikten sonra kısa bir gecikme ile çalıştır - süreyi artıralım
            setTimeout(initMobileNav, 200);
        }
    });
    
    /**
     * Mobil menü işlevselliğini başlatan fonksiyon
     */
    function initMobileNav() {
        console.log('Mobil menü başlatılıyor...');
        
        // ID ile bulmayı dene
        let mobileToggle = document.getElementById('mobile-toggle');
        let mainNav = document.getElementById('main-nav');
        
        // ID ile bulamazsa, sınıf adı veya seçici ile bulmayı dene
        if (!mobileToggle) {
            mobileToggle = document.querySelector('.header__mobile-toggle');
            console.log('mobile-toggle ID bulunamadı, sınıf ile aranıyor:', mobileToggle);
        }
        
        if (!mainNav) {
            mainNav = document.querySelector('.header__nav');
            console.log('main-nav ID bulunamadı, sınıf ile aranıyor:', mainNav);
        }
        
        if (!mobileToggle || !mainNav) {
            console.warn('Mobil menü elemanları bulunamadı. HTML yapısını kontrol edin.');
            // Elementlerin varlığını kontrol etmek için DOM'u logla
            console.log('Header mevcut:', document.querySelector('.header'));
            return;
        }
        
        // Mevcut event listener'ları temizle
        const newToggle = mobileToggle.cloneNode(true);
        mobileToggle.parentNode.replaceChild(newToggle, mobileToggle);
        
        // Dokunmatik ve tıklama olayları için listener'lar ekle
        newToggle.addEventListener('click', toggleMenu);
        newToggle.addEventListener('touchend', function(e) {
            e.preventDefault();
            toggleMenu(e);
        }, { passive: false });
        
        // Menü linklerine tıklandığında menüyü kapat
        const menuLinks = mainNav.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // Önce menüyü kapat
                closeMenu();
                
                // Link href'ini kontrol et
                const href = link.getAttribute('href');
                
                // Sayfa içi bağlantı (anchor) ise
                if (href && href.includes('#') && !href.startsWith('http')) {
                    e.preventDefault();
                    
                    // # işaretinden sonraki kısmı al
                    let targetId;
                    
                    // Farklı sayfa + anchor kombinasyonu ise (örn: index.html#section)
                    if (href.includes('.html#')) {
                        const parts = href.split('#');
                        const page = parts[0];
                        targetId = parts[1];
                        
                        // Eğer aynı sayfadaysak, anchor'a git
                        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
                        if (page === currentPage) {
                            scrollToSection(targetId);
                            return;
                        }
                        // Farklı sayfaya gidiyorsa, normal davranışı devam ettir
                        window.location.href = href;
                        return;
                    } 
                    // Sadece anchor ise (#section gibi)
                    else if (href.startsWith('#')) {
                        targetId = href.substring(1);
                        scrollToSection(targetId);
                    }
                }
                // Harici link ise normal davranışı devam ettir
            });
        });
        
        // Global event listener ile dışarı tıklandığında menüyü kapat
        document.addEventListener('click', function(e) {
            if (mainNav.classList.contains('active') && 
                !mainNav.contains(e.target) && 
                !newToggle.contains(e.target)) {
                closeMenu();
            }
        });
        
        /**
         * Menüyü aç veya kapat
         */
        function toggleMenu(e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            
            newToggle.classList.toggle('active');
            mainNav.classList.toggle('active');
            document.body.classList.toggle('menu-open');
            
            // Menü açıkken scroll'u engelle
            document.body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : '';
        }
        
        /**
         * Menüyü kapat
         */
        function closeMenu() {
            newToggle.classList.remove('active');
            mainNav.classList.remove('active');
            document.body.classList.remove('menu-open');
            document.body.style.overflow = '';
        }
        
        /**
         * Belirtilen ID'ye sahip bölüme kaydırır
         * @param {string} sectionId - Kaydırılacak bölümün ID'si 
         */
        function scrollToSection(sectionId) {
            const targetSection = document.getElementById(sectionId);
            if (!targetSection) return;
            
            // Header'ın yüksekliğini hesaba katarak smooth scroll yap
            const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
            const targetOffset = targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            // Gecikme ile kaydırmayı başlat - menünün tamamen kapanmasını beklemek için
            setTimeout(() => {
                window.scrollTo({
                    top: targetOffset,
                    behavior: 'smooth'
                });
            }, 50);
        }
        
        console.log('Mobil menü başarıyla başlatıldı.');
    }
})();
