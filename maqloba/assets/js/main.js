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
  const menuModalEl = document.getElementById('menuModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalImage = document.getElementById('modalImage');
  const modalIngredients = document.getElementById('modalIngredients');

  // Helper: populate modal content from a card element
  function populateModalFromCard(card){
    if(!card) return;
    const name = card.getAttribute('data-name') || 'طبق';
    const img = card.getAttribute('data-img') || card.querySelector('img')?.src || '';
    const ingText = card.getAttribute('data-ingredients') || '';

    modalTitle.textContent = name;
    modalImage.src = img;
    const parts = ingText.split('•').map(s=>s.trim()).filter(Boolean);
    modalIngredients.innerHTML = parts.map(p => `<li>${p}</li>`).join('');
  }

  // Intercept clicks on image anchors in the capture phase to prevent navigation.
  // Use preventDefault/stopPropagation (not stopImmediatePropagation) so we don't
  // accidentally block other Bootstrap internals. We'll open a single Modal instance.
  const bsModal = new bootstrap.Modal(menuModalEl);

  document.addEventListener('click', function(e){
    const anchor = e.target.closest('.menu-card a.glightbox');
    if(!anchor) return;
    e.preventDefault();
    e.stopPropagation();
    const card = anchor.closest('.menu-card');
    if(card){
      populateModalFromCard(card);
      bsModal.show();
    }
  }, true);

  // Make clicking anywhere on the card open the modal
  document.querySelectorAll('.menu-card').forEach(card=>{
    card.addEventListener('click', function(e){
      // ignore clicks that originated from focusable controls we intentionally allow
      const tag = e.target.tagName.toLowerCase();
      if(tag === 'a' || tag === 'button' || e.target.closest('a.glightbox')) return;
      populateModalFromCard(card);
      bsModal.show();
    });
  });

  // Cleanup: sometimes third-party handlers or interrupted flows can leave the
  // backdrop or `modal-open` class in place. Ensure we remove leftovers on hide.
  menuModalEl.addEventListener('hidden.bs.modal', function(){
    // remove any stray backdrops
    document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
    // ensure body class is cleaned
    document.body.classList.remove('modal-open');
    // reset image src to free memory
    try{ document.getElementById('modalImage').src = ''; }catch(e){}
  });

  // Keep existing behavior for keyboard: Enter will trigger click (already wired below)

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
