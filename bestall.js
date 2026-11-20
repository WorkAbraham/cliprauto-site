/* Plan-knapparna (a[data-plan] inne i ett .pkg3-kort). Ägaren 3 nov 2026: "Vi tar bort faktura helt". Ingen beställningsruta längre:
   finns en PayPal-länk för planen i betalning.json går knappen direkt till PayPals betalsida (ny flik). Saknas länken står knappens
   vanliga mejl kvar (info@cliprauto.com med planen ifylld). window.cliprBestall() binder knappar som läggs till efteråt. */
(function(){
 var BASE=(document.currentScript&&document.currentScript.src||'').replace(/[^\/]*$/,''), betal={};
 function bind(){
  document.querySelectorAll('a[data-plan]').forEach(function(a){
   var l=betal[a.dataset.plan];
   if(l&&/^https:\/\/www\.paypal\.com\//.test(l)){
    if(/^maskin-/.test(a.dataset.plan)){            /* maskinen: förnamn, efternamn och e-post är tvingande INNAN PayPal (ägaren 20 nov 2026) */
     if(!a.dataset.kop){a.dataset.kop='1';a.addEventListener('click',function(e){e.preventDefault();kopRuta(a.dataset.plan,betal[a.dataset.plan])})}
    }else{a.href=l;a.target='_blank';a.rel='noopener'}
   }
  });
 }

 var API='https://cliprauto-mottagning.mottagning.workers.dev',dlg=null,last=null;
 var MSG={bad_first_name:'Please enter your first name.',bad_last_name:'Please enter your last name.',bad_email:'Please enter a valid email address.',disposable:'Please use a permanent email address. Your licence key is sent there.',too_many:'Too many attempts. Please try again in an hour.'};
 function kopRuta(plan,link){
  last=document.activeElement;
  if(!dlg){
   dlg=document.createElement('dialog');dlg.className='kopruta';dlg.setAttribute('aria-labelledby','kop-h');
   dlg.innerHTML='<form novalidate><h2 id="kop-h">Where should we send your licence?</h2><p class="kop-p">We email your licence key and the download to this address after payment.</p>'+
    '<label for="kop-fn">First name</label><input id="kop-fn" name="firstName" autocomplete="given-name" required maxlength="60">'+
    '<label for="kop-en">Last name</label><input id="kop-en" name="lastName" autocomplete="family-name" required maxlength="60">'+
    '<label for="kop-em">Email</label><input id="kop-em" name="email" type="email" autocomplete="email" inputmode="email" required maxlength="120">'+
    '<input class="kop-fa" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">'+
    '<p class="kop-fel" role="alert" aria-live="assertive"></p>'+
    '<div class="kop-rad"><button type="submit" class="btn btn-p">Continue to PayPal</button><button type="button" class="btn btn-o kop-av">Cancel</button></div></form>';
   document.body.appendChild(dlg);
   dlg.querySelector('.kop-av').addEventListener('click',function(){dlg.close()});
   dlg.addEventListener('close',function(){if(last&&last.focus)last.focus()});
   dlg.addEventListener('click',function(e){if(e.target===dlg)dlg.close()});
   dlg.querySelector('form').addEventListener('submit',function(e){
    e.preventDefault();var f=e.target,fel=f.querySelector('.kop-fel'),b=f.querySelector('button[type=submit]');
    var fn=f.firstName.value.trim(),en=f.lastName.value.trim(),em=f.email.value.trim();
    fel.textContent='';
    if(!fn){fel.textContent=MSG.bad_first_name;f.firstName.focus();return}
    if(!en){fel.textContent=MSG.bad_last_name;f.lastName.focus();return}
    if(!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(em)){fel.textContent=MSG.bad_email;f.email.focus();return}
    b.disabled=true;b.textContent='One moment';
    fetch(API+'/api/kop',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({plan:dlg.dataset.plan,firstName:fn,lastName:en,email:em,website:f.website.value,t:dlg.dataset.t*1})})
     .then(function(r){return r.json().catch(function(){return{}})})
     .then(function(j){
      if(j&&j.ok){location.href=dlg.dataset.link;return}
      fel.textContent=(j&&(MSG[j.code]||j.message))||'Something went wrong. Please try again, or write to info@cliprauto.com.';b.disabled=false;b.textContent='Continue to PayPal'})
     .catch(function(){fel.textContent='We could not reach the server. Please try again, or write to info@cliprauto.com.';b.disabled=false;b.textContent='Continue to PayPal'});
   });
  }
  dlg.dataset.plan=plan;dlg.dataset.link=link;dlg.dataset.t=Date.now();
  if(dlg.showModal)dlg.showModal();else dlg.setAttribute('open','');
  dlg.querySelector('#kop-fn').focus();
 }
 window.cliprBestall=bind;
 try{fetch(BASE+'betalning.json',{cache:'no-store'}).then(function(r){return r.ok?r.json():{}}).then(function(j){betal=j||{};bind()}).catch(function(){})}catch(e){}
})();
