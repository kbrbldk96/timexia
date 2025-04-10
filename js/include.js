/**
 * HTML Parçalarını Yükleme Sistemi
 * Bu dosya header ve footer gibi tekrar eden HTML parçalarını sayfalara dahil eder
 */

document.addEventListener('DOMContentLoaded', function() {
    // Body içindeki include elementlerini bul ve yükle (sadece header ve footer)
    const bodyIncludes = document.querySelectorAll('body [data-include]');
    bodyIncludes.forEach(element => loadPartial(element));
    
    /**
     * HTML parçasını element içine yükler
     */
    function loadPartial(element) {
        const partialName = element.getAttribute('data-include');
        
        fetch(`partials/${partialName}.html`)
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                return response.text();
            })
            .then(html => {
                element.innerHTML = html;
                
                if (partialName === 'header') {
                    setActivePage();
                    initMobileMenu();
                    
                    // HTML parçaları yüklendikten sonra çeviri sistemini tetikle
                    const event = new CustomEvent('partialLoaded', { detail: partialName });
                    document.dispatchEvent(event);
                }
            })
            .catch(() => {
                // Fetch başarısız olursa inline içeriği kullan
                const inlineContent = getInlinePartial(partialName);
                if (inlineContent) {
                    element.innerHTML = inlineContent;
                    
                    if (partialName === 'header') {
                        setActivePage();
                        initMobileMenu();
                    }
                } else {
                    element.innerHTML = `<div class="error">İçerik yüklenemedi: ${partialName}</div>`;
                }
            });
    }
    
    /**
     * HTML parçalarının yedek içeriklerini döndüren fonksiyon
     */
    function getInlinePartial(partialName) {
        // HTML parçaları burada tanımlanır (fetch başarısız olursa yedek olarak)
        const partials = {
            header: `
                <header class="header">
                    <div class="container">
                        <nav class="navbar">
                            <a href="index.html" class="logo">
                                <span>Timexia</span>
                            </a>
                            <div class="nav-menu">
                                <ul class="nav-list">
                                    <li class="nav-item"><a href="index.html" class="nav-link" data-active="index">Ana Sayfa</a></li>
                                    <li class="nav-item"><a href="appointment.html" class="nav-link" data-active="appointment">Randevu Al</a></li>
                                    <li class="nav-item"><a href="about.html" class="nav-link" data-active="about">Hakkımızda</a></li>
                                </ul>
                            </div>
                            <button class="btn-mobile-nav">
                                <span class="icon-menu"></span>
                            </button>
                        </nav>
                    </div>
                </header>
            `,
            footer: `
                <footer class="footer">
                    <div class="container">
                        <div class="footer-top">
                            <div class="footer-brand">
                                <a href="#" class="footer-logo">Timexia</a>
                                <p class="footer-tagline">Randevu teknolojisini herkes için erişilebilir kılıyoruz.</p>
                            </div>
                            
                            <div class="footer-links">
                                <div class="footer-links-group">
                                    <h4 class="footer-links-title">Sayfalar</h4>
                                    <ul>
                                        <li><a href="index.html">Ana Sayfa</a></li>
                                        <li><a href="appointment.html">Randevu Al</a></li>
                                        <li><a href="about.html">Hakkımızda</a></li>
                                    </ul>
                                </div>
                                
                                <div class="footer-links-group">
                                    <h4 class="footer-links-title">İletişim</h4>
                                    <ul>
                                        <li><a href="mailto:info@timexia.io">info@timexia.io</a></li>
                                        <li><a href="tel:+901234567890">+90 123 456 78 90</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        
                        <div class="footer-bottom">
                            <p class="copyright">&copy; 2023 Timexia. Tüm hakları saklıdır.</p>
                            <div class="social-links">
                                <a href="#" class="social-link">Twitter</a>
                                <a href="#" class="social-link">Instagram</a>
                                <a href="#" class="social-link">LinkedIn</a>
                            </div>
                        </div>
                    </div>
                </footer>
            `
        };
        
        return partials[partialName] || false;
    }
    
    /**
     * Aktif sayfayı belirleyen fonksiyon
     */
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
    
    /**
     * Mobil menü işlevselliğini başlatan fonksiyon
     */
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
