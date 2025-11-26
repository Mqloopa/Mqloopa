/*
  main.js
  Extracted JS from index.html. Initializes AOS, handles navbar scroll behavior,
  menu modal population, smooth scroll offsets, and accessibility enhancements.
*/

// Loading Screen: Hide after page load
(function(){
  const loadingScreen = document.getElementById('loading-screen');
  window.addEventListener('load', function(){
    setTimeout(function(){
      loadingScreen.classList.add('hidden');
      setTimeout(function(){
        loadingScreen.style.display = 'none';
      }, 500);
    }, 1000); // Show loading screen for 1 second
  });
})();

// Initialize AOS for scroll animations
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
AOS.init({ duration: prefersReduced ? 0 : 700, once: true, offset: 80, disable: prefersReduced });

// Navbar: change background on scroll
(function(){
  const nav = document.getElementById('mainNav');
  function onScroll(){
    if(window.scrollY > 40) nav.classList.add('scrolled'); else nav.classList.remove('scrolled');
  }
  document.addEventListener('scroll', onScroll, { passive:true });
  onScroll();
})();

// Menu modal: populate single modal from clicked card
// - Cards have data-img, data-name, data-ingredients
(function(){
  const menuModal = document.getElementById('menuModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalImage = document.getElementById('modalImage');
  const modalIngredients = document.getElementById('modalIngredients');

  // Event delegation: listen for show.bs.modal and populate
  menuModal.addEventListener('show.bs.modal', function(e){
    // bootstrap passes relatedTarget which is the clicked element
    const trigger = e.relatedTarget || document.activeElement;
    const name = trigger.getAttribute('data-name') || 'طبق';
    const img = trigger.getAttribute('data-img') || trigger.querySelector('img')?.src || '';
    const ingText = trigger.getAttribute('data-ingredients') || '';

    modalTitle.textContent = name;
    modalImage.src = img;
    // split ingredients by • or comma
    const parts = ingText.split('•').map(s=>s.trim()).filter(Boolean);
    modalIngredients.innerHTML = parts.map(p => `<li>${p}</li>`).join('');
  });

})();

// Smooth scroll for nav links (for older browsers)
// Ensures offset to account for fixed navbar height
(function(){
  const OFFSET = 72; // navbar height
  document.querySelectorAll('a[href^="#"]').forEach(anchor =>{
    anchor.addEventListener('click', function(e){
      const href = this.getAttribute('href');
      if(!href || href === '#') return;
      const target = document.querySelector(href);
      if(target){
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.pageYOffset - OFFSET;
        window.scrollTo({ top, behavior:'smooth' });
      }
    });
  });
})();

// Small accessibility: allow Enter key to open cards
document.querySelectorAll('.menu-card').forEach(el=>{
  el.addEventListener('keydown', function(e){ if(e.key === 'Enter') el.click(); });
});

// Initialize GLightbox for menu images (lightweight)
if (typeof GLightbox === 'function') {
  const lightbox = GLightbox({ selector: '.glightbox', openEffect: 'fade', closeEffect: 'fade', loop: true });
}
