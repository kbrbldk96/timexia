/**
 * HTML Parçalarını Yükleme Sistemi
 * Bu dosya header ve footer gibi tekrar eden HTML parçalarını sayfalara dahil eder
 */

document.addEventListener('DOMContentLoaded', function() {
    // Tüm include elementlerini bul
    const includeElements = document.querySelectorAll('[data-include]');
    
    // Her bir include elementi için HTML parçasını yükle
    includeElements.forEach(element => {
        const partialName = element.getAttribute('data-include');
        
        // HTML parçasını fetch API ile getir
        fetch(`partials/${partialName}.html`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.text();
            })
            .then(html => {
                // HTML içeriğini elementin içine yerleştir
                element.innerHTML = html;
                
                // Eğer header yüklendiyse, aktif sayfayı belirle
                if (partialName === 'header') {
                    setActivePage();
                    initMobileMenu();
                }
            })
            .catch(error => {
                console.error(`${partialName} parçası yüklenirken hata oluştu:`, error);
                element.innerHTML = `<div class="error">İçerik yüklenemedi</div>`;
            });
    });
    
    // Aktif sayfayı belirleyen fonksiyon
    function setActivePage() {
        const currentPage = document.body.getAttribute('data-page');
        if (currentPage) {
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                if (link.getAttribute('data-active') === currentPage) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        }
    }
    
    // Mobil menü işlevselliğini başlatan fonksiyon
    function initMobileMenu() {
        const mobileNavBtn = document.querySelector('.btn-mobile-nav');
        const navMenu = document.querySelector('.nav-menu');
        
        if (mobileNavBtn && navMenu) {
            mobileNavBtn.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                mobileNavBtn.classList.toggle('active');
            });
        }
    }
});
