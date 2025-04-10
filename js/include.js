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
                // Footer için özel işlemler
                else if (partialName === 'footer') {
                    console.log('Footer yüklendi, DOM kontrol ediliyor...');
                    
                    // DOM'un güncellenmesine zaman tanımak için setTimeout kullanıyoruz
                    setTimeout(() => {
                        // İşlem 1: DOM'daki tüm elementi doğrudan HTML olarak yazdırma
                        console.log('Footer DOM içeriği:', element.innerHTML);
                        
                        // İşlem 2: Footer bottom elementi kontrol
                        const footerBottom = document.querySelector('.footer .footer__bottom');
                        if (footerBottom) {
                            console.log('Footer bottom elementi bulundu!', footerBottom);
                            // Görünürlüğü zorla
                            footerBottom.style.display = 'flex';
                            footerBottom.style.visibility = 'visible';
                            footerBottom.style.opacity = '1';
                            footerBottom.style.justifyContent = 'space-between';
                            footerBottom.style.paddingTop = '1.5rem';
                            footerBottom.style.borderTop = '1px solid #ccc';
                            footerBottom.style.marginTop = '1.5rem';
                        } else {
                            console.error('HATA: Footer bottom elementi bulunamadı!');
                            console.log('Alternatif çözüm: Footer bottom manuel olarak ekleniyor...');
                            
                            // Element yoksa manuel ekleme
                            const footerContainer = document.querySelector('.footer .container');
                            if (footerContainer) {
                                const newFooterBottom = document.createElement('div');
                                newFooterBottom.className = 'footer__bottom';
                                newFooterBottom.id = 'footer-bottom';
                                newFooterBottom.style.display = 'flex';
                                newFooterBottom.style.justifyContent = 'space-between';
                                newFooterBottom.style.paddingTop = '1.5rem';
                                newFooterBottom.style.borderTop = '1px solid #ccc';
                                newFooterBottom.style.marginTop = '1.5rem';
                                newFooterBottom.innerHTML = `
                                    <p class="footer__copyright" data-key="footerCopyright">&copy; 2023 Timexia. Tüm hakları saklıdır.</p>
                                    <p class="footer__credit" data-key="footerKimly">
                                        Bu proje <a href="https://kimlytechnology.com" target="_blank" rel="noopener noreferrer" class="footer__credit-link">Kimly Technology</a> tarafından geliştirilmiştir.
                                    </p>
                                `;
                                footerContainer.appendChild(newFooterBottom);
                                console.log('Footer bottom elementi manuel olarak eklendi:', newFooterBottom);
                            }
                        }
                        
                        // Çeviri sistemini tetikle - footer güncellemesinden SONRA
                        const event = new CustomEvent('partialLoaded', { detail: partialName });
                        document.dispatchEvent(event);
                    }, 100); // 100ms gecikme ile DOM kontrolü
                }
            })
            .catch((error) => {
                console.error(`${partialName} yüklenirken hata: ${error.message}`);
                // Fetch başarısız olursa inline içeriği kullan
                const inlineContent = getInlinePartial(partialName);
                if (inlineContent) {
                    element.innerHTML = inlineContent;
                    
                    if (partialName === 'header') {
                        setActivePage();
                        initMobileMenu();
                        
                        const event = new CustomEvent('partialLoaded', { detail: partialName });
                        document.dispatchEvent(event);
                    } 
                    // Yedek içerik için de footer olayını tetikle
                    else if (partialName === 'footer') {
                        console.log('Footer yedek içeriği yüklendi, DOM kontrol ediliyor...');
                        
                        setTimeout(() => {
                            const footerBottom = document.querySelector('.footer .footer__bottom');
                            if (footerBottom) {
                                console.log('Yedek footer bottom elementi bulundu:', footerBottom);
                                // Görünürlüğü zorla
                                footerBottom.style.display = 'flex';
                                footerBottom.style.visibility = 'visible';
                                footerBottom.style.opacity = '1';
                                footerBottom.style.justifyContent = 'space-between';
                                footerBottom.style.paddingTop = '1.5rem';
                                footerBottom.style.borderTop = '1px solid #ccc';
                                footerBottom.style.marginTop = '1.5rem';
                            } else {
                                console.error('HATA: Yedek footer bottom elementi bulunamadı!');
                                
                                // Element yoksa manuel ekleme (yedek içerik için)
                                const footerContainer = document.querySelector('.footer .container');
                                if (footerContainer) {
                                    const newFooterBottom = document.createElement('div');
                                    newFooterBottom.className = 'footer__bottom';
                                    newFooterBottom.id = 'footer-bottom';
                                    newFooterBottom.style.display = 'flex';
                                    newFooterBottom.style.justifyContent = 'space-between';
                                    newFooterBottom.style.paddingTop = '1.5rem';
                                    newFooterBottom.style.borderTop = '1px solid #ccc';
                                    newFooterBottom.style.marginTop = '1.5rem';
                                    newFooterBottom.innerHTML = `
                                        <p class="footer__copyright" data-key="footerCopyright" >&copy; 2023 Timexia. Tüm hakları saklıdır.</p>
                                        <p class="footer__credit" data-key="footerKimly">
                                            Bu proje <a href="https://kimlytechnology.com" target="_blank" rel="noopener noreferrer" class="footer__credit-link">Kimly Technology</a> tarafından geliştirilmiştir.
                                        </p>
                                    `;
                                    footerContainer.appendChild(newFooterBottom);
                                    console.log('Yedek footer bottom elementi manuel olarak eklendi');
                                }
                            }
                            
                            const event = new CustomEvent('partialLoaded', { detail: partialName });
                            document.dispatchEvent(event);
                        }, 100);
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
        <!-- Ana footer içeriği -->
        <div class="footer__content">
            <!-- Sol bölüm - Marka -->
            <div class="footer__brand">
                <a href="index.html" class="footer__logo">Timexia</a>
                <p class="footer__tagline" data-key="footerTagline">Randevu teknolojisini herkes için erişilebilir kılıyoruz.</p>
            </div>
            
            <!-- Orta bölüm - Keşfet -->
            <div class="footer__nav">
                <h4 class="footer__heading">Keşfet</h4>
                <ul class="footer__nav-list">
                    <li class="footer__nav-item">
                        <a href="about.html" class="footer__nav-link" data-key="navAbout">Hakkımızda</a>
                    </li>
                    <li class="footer__nav-item">
                        <a href="contact.html" class="footer__nav-link" data-key="navContact">İletişim</a>
                    </li>
                    <li class="footer__nav-item">
                        <a href="#help" class="footer__nav-link" data-key="navHelp">Yardım</a>
                    </li>
                    <li class="footer__nav-item">
                        <a href="#api" class="footer__nav-link" data-key="navApi">API</a>
                    </li>
                </ul>
            </div>
            
            <!-- Sağ bölüm - Sosyal ve İletişim -->
            <div class="footer__connect">
                <h4 class="footer__heading">İletişim</h4>
                <a href="mailto:hello@timexia.io" class="footer__email">hello@timexia.io</a>
                <div class="footer__social">
                    <a href="#" class="footer__social-link" aria-label="Instagram">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                        </svg>
                    </a>
                    <a href="#" class="footer__social-link" aria-label="LinkedIn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                            <rect x="2" y="9" width="4" height="12"></rect>
                            <circle cx="4" cy="4" r="2"></circle>
                        </svg>
                    </a>
                </div>
            </div>
        </div>
        
        <!-- En alt satır - Telif + Proje bilgisi (inline id eklenmiş hali) -->
        <div class="footer__bottom" id="footer-bottom" style="display:flex; justify-content:space-between; padding-top:1.5rem; border-top:1px solid #ccc; margin-top:1.5rem;">
            <p class="footer__copyright" data-key="footerCopyright">&copy; 2023 Timexia. Tüm hakları saklıdır.</p>
            <p class="footer__credit" data-key="footerKimly">
                Bu proje <a href="https://kimlytechnology.com" target="_blank" rel="noopener noreferrer" class="footer__credit-link">Kimly Technology</a> tarafından geliştirilmiştir.
            </p>
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
