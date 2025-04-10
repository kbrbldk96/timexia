// Main JavaScript file

document.addEventListener('DOMContentLoaded', () => {
  // Loader handling
  const loader = document.getElementById('loader');
  
  // Hide loader when everything is loaded
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
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
  
  // Mobile navigation toggle
  const mobileNavBtn = document.querySelector('.btn-mobile-nav');
  const navMenu = document.querySelector('.nav-menu');
  
  if (mobileNavBtn && navMenu) {
    mobileNavBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      mobileNavBtn.classList.toggle('active');
    });
  }
  
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
});
