// Coratex Korea - site enhancements (no server / no DB)
// - Auto active nav highlight
(function(){
  function ready(fn){
    if(document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  function currentPage(){
    var p = (location.pathname || '').split('/').pop();
    return p ? p : 'index.html';
  }

  ready(function(){
    var page = currentPage();
    document.querySelectorAll('.navbar-nav .nav-link').forEach(function(a){
      var href = (a.getAttribute('href') || '').split('#')[0];
      if(!href) return;
      if(href === page){
        var li = a.closest('.nav-item');
        if(li) li.classList.add('active');
        a.setAttribute('aria-current','page');
      }
    });
  });
})();
