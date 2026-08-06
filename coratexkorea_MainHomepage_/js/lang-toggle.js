/* Coratex Korea - Language toggle (KR/EN)
   - No server, no DB
   - Persists user choice in localStorage
*/
(function(){
  var STORAGE_KEY = 'coratex_lang';
  var DEFAULT_LANG = 'kr';

  function setLang(lang){
    if(lang !== 'kr' && lang !== 'en') lang = DEFAULT_LANG;
    document.body.setAttribute('data-lang', lang);
    try{ localStorage.setItem(STORAGE_KEY, lang); }catch(e){}

    var btns = document.querySelectorAll('.lang-switch [data-lang]');
    btns.forEach(function(btn){
      var isOn = (btn.getAttribute('data-lang') === lang);
      btn.setAttribute('aria-pressed', isOn ? 'true' : 'false');
    });
  }

  function init(){
    // Apply stored choice early
    var saved = null;
    try{ saved = localStorage.getItem(STORAGE_KEY); }catch(e){}
    setLang(saved || DEFAULT_LANG);

    // Wire buttons
    document.querySelectorAll('.lang-switch [data-lang]').forEach(function(btn){
      btn.addEventListener('click', function(){
        setLang(btn.getAttribute('data-lang'));
      });
    });
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  }else{
    init();
  }
})();
