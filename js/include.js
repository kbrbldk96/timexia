/**
 * HTML Parçalarını Yükleme Sistemi - Optimize edilmiş
 */
document.addEventListener('DOMContentLoaded', function() {
    // Body içindeki include elementlerini bul ve yükle
    const bodyIncludes = document.querySelectorAll('body [data-include]');
    bodyIncludes.forEach(element => loadPartial(element));
    
    /**
     * HTML parçasını element içine yükler - Basitleştirilmiş versiyon
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
                
                // Yükleme sonrası işlemleri başlat
                triggerPostLoadActions(partialName, element);
            })
            .catch(error => {
                console.error(`${partialName} yüklenirken hata: ${error.message}`);
                // Yedek içerik kullan
                const inlineContent = getInlinePartial(partialName);
                if (inlineContent) {
                    element.innerHTML = inlineContent;
                    triggerPostLoadActions(partialName, element);
                }
            });
    }
    
    /**
     * Parça yükleme sonrası işlemleri başlatır
     */
    function triggerPostLoadActions(partialName, element) {
        // ...simplified post-load actions...
    }
});
