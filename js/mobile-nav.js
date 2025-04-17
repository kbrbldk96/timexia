/**
 * Tüm sayfalarda tutarlı çalışacak mobil menü işlevselliği
 */
(function() {
    // Sayfa yüklendiğinde veya DOM hazır olduğunda
    document.addEventListener('DOMContentLoaded', initMobileNav);
    
    // Header parçası load edildiğinde tekrar çalıştır (partial loading için)
    document.addEventListener('partialLoaded', function(e) {
        if (e.detail === 'header') {
            // Header yüklendikten sonra kısa bir gecikme ile çalıştır
            setTimeout(initMobileNav, 50);
        }
    });
    
    /**
     * Mobil menü işlevselliğini başlatan fonksiyon
     */
    function initMobileNav() {
        const mobileToggle = document.getElementById('mobile-toggle');
        const mainNav = document.getElementById('main-nav');
        
        if (!mobileToggle || !mainNav) {
            console.warn('Mobil menü elemanları bulunamadı');
            return;
        }
        
        // Mevcut event listener'ları temizle
        const newToggle = mobileToggle.cloneNode(true);
        mobileToggle.parentNode.replaceChild(newToggle, mobileToggle);
        
        // Dokunmatik ve tıklama olayları için listener'lar ekle
        newToggle.addEventListener('click', toggleMenu, { capture: true });
        newToggle.addEventListener('touchend', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleMenu(e);
        }, { passive: false, capture: true });
        
        // Menü linklerine tıklandığında menüyü kapat
        const menuLinks = mainNav.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
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
            
            console.log('Mobil menü tıklandı');
            
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
    }
})();
