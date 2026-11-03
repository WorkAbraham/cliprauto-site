/* Plan-knapparna (a[data-plan] inne i ett .pkg3-kort). Ägaren 3 nov 2026: "Vi tar bort faktura helt". Ingen beställningsruta längre:
   finns en PayPal-länk för planen i betalning.json går knappen direkt till PayPals betalsida (ny flik). Saknas länken står knappens
   vanliga mejl kvar (info@cliprauto.com med planen ifylld). window.cliprBestall() binder knappar som läggs till efteråt. */
(function(){
 var BASE=(document.currentScript&&document.currentScript.src||'').replace(/[^\/]*$/,''), betal={};
 function bind(){
  document.querySelectorAll('a[data-plan]').forEach(function(a){
   var l=betal[a.dataset.plan];
   if(l&&/^https:\/\/www\.paypal\.com\//.test(l)){a.href=l;a.target='_blank';a.rel='noopener'}
  });
 }
 window.cliprBestall=bind;
 try{fetch(BASE+'betalning.json',{cache:'no-store'}).then(function(r){return r.ok?r.json():{}}).then(function(j){betal=j||{};bind()}).catch(function(){})}catch(e){}
})();
