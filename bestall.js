/* Beställningsdialogen: plan-knapparna (a[data-plan] inne i ett .pkg3-kort) öppnar ett formulär i stället för ett mejl. Skickar till mottagningen (/api/order). Kontrollerna här är bara för användaren; de riktiga skydden körs på servern.
   Dialogen byggs här (ett ställe) och används både på startsidan och på provsidan. Utan JavaScript fungerar knapparna som förut (mejl till info@cliprauto.com med planen ifylld).
   Priser och namn läses ur planernas kort, så att de bara finns på ett ställe. Kommer sidan från en provsida (?id=…) följer id:t med beställningen. window.cliprBestall() binder knappar som läggs till efteråt. */
(function(){
 var API='https://cliprauto-mottagning.mottagning.workers.dev', t0=Date.now(), trigger=null, planer={}, betal={};
 var ENGANG=['mailinator.com','guerrillamail.com','10minutemail.com','tempmail.com','yopmail.com','trashmail.com','sharklasers.com','getnada.com','throwawaymail.com'];
 var REF=(new URLSearchParams(location.search).get('id')||'').replace(/[^a-z0-9]/g,'');
 var HTML='<div class="obox"><button class="x" type="button" aria-label="Close" data-close><svg class="ic" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button>'
 +'<form class="req" data-order novalidate><h3 id="orderT">Choose how to pay</h3><p class="osum"><b class="op"></b> <span class="opr"></span></p>'
 +'<div class="paycard" hidden><a class="btn" href="#" target="_blank" rel="noopener"><span class="etikett">Pay by card</span><svg class="ic" viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6"/></svg></a><p class="small">Secure checkout by Stripe. Your receipt comes by email.</p><div class="or"><span>or get an invoice</span></div></div>'
 +'<div class="f"><label class="l" for="OP">Plan</label><select id="OP" name="plan"></select></div>'
 +'<div class="f"><label class="l" for="ON">Name or company for the invoice</label><input id="ON" name="name" type="text" autocomplete="organization"></div>'
 +'<div class="f"><label class="l" for="OE">Email for the invoice</label><input id="OE" name="email" type="email" placeholder="you@company.com" autocomplete="email"></div>'
 +'<div class="f"><label class="l" for="OA">Billing address</label><textarea id="OA" name="address" rows="3" autocomplete="street-address"></textarea></div>'
 +'<div class="f"><label class="l" for="OV">VAT number <span class="opt">(optional)</span></label><input id="OV" name="vat" type="text" autocomplete="off"></div>'
 +'<input class="hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">'
 +'<button class="btn" type="submit"><span class="etikett">Request my invoice</span><svg class="ic" viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6"/></svg></button>'
 +'<p class="msg" role="alert"></p><p class="small">You pay nothing here. We email you the invoice, and work starts when it is paid.</p></form>'
 +'<div class="sent" hidden><svg class="ic" viewBox="0 0 24 24" style="width:22px;height:22px"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg><h3>We have your order</h3><p><b>Check your inbox<span class="toS"> at <span class="to"></span></span>.</b> We sent you a confirmation.</p>'
 +'<ol class="after"><li>We email you an invoice with the payment details.</li><li>Work starts when it is paid.</li><li>Send your first episode and the 48 hours begin.</li></ol><p style="margin-top:14px"><button class="btn ghost" type="button" data-close><span class="etikett">Close</span></button></p></div></div>';
 var dlg=document.getElementById('order');
 if(!dlg){dlg=document.createElement('dialog');dlg.id='order';dlg.setAttribute('aria-labelledby','orderT');dlg.innerHTML=HTML;document.body.appendChild(dlg)}
 if(!dlg.showModal) return;
 var f=dlg.querySelector('form'), sent=dlg.querySelector('.sent'), sel=f.plan;
 function visa(){var p=planer[sel.value];if(!p)return;dlg.querySelector('.op').textContent=p.namn;var pc=dlg.querySelector('.paycard'),l=betal[sel.value];dlg.querySelector('.opr').textContent=p.pris+(l?' per month':' per month, invoiced monthly');pc.hidden=!l;if(l)pc.querySelector('a').href=l;dlg.querySelector('#orderT').textContent=l?'Choose how to pay':'Request your invoice'}
 try{fetch('betalning.json',{cache:'no-store'}).then(function(r){return r.ok?r.json():{}}).then(function(j){betal=j||{};visa()}).catch(function(){})}catch(e){}
 function bind(){
  document.querySelectorAll('a[data-plan]:not([data-bound])').forEach(function(a){
   var kort=a.closest('.pkg3'), pr=kort&&kort.querySelector('.price'), k=a.dataset.plan; if(!pr) return; a.dataset.bound='1';
   if(!planer[k]){planer[k]={namn:kort.querySelector('h3').textContent.trim(),pris:pr.firstChild.textContent.trim()};var o=document.createElement('option');o.value=k;o.textContent=planer[k].namn+' · '+planer[k].pris;sel.appendChild(o)}
   a.addEventListener('click',function(ev){ev.preventDefault();trigger=a;sel.value=k;visa();f.hidden=false;sent.hidden=true;dlg.showModal();(f.name.value?f.email:f.name).focus()});
  });
 }
 window.cliprBestall=bind; bind();
 function msg(t){f.querySelector('.msg').textContent=t||''}
 function bad(el,on){el.classList.toggle('bad',!!on)}
 sel.addEventListener('change',visa);
 dlg.querySelectorAll('[data-close]').forEach(function(b){b.addEventListener('click',function(){dlg.close()})});
 dlg.addEventListener('click',function(ev){if(ev.target===dlg)dlg.close()});
 dlg.addEventListener('close',function(){if(trigger)trigger.focus()});
 f.addEventListener('submit',function(ev){
  ev.preventDefault(); msg(''); [f.name,f.email,f.address].forEach(function(e){bad(e,0)});
  if(f.website.value||Date.now()-t0<3000){f.hidden=true;sent.hidden=false;return}
  var n=f.name.value.trim(), m=f.email.value.trim().toLowerCase(), ad=f.address.value.trim();
  if(n.length<2){bad(f.name,1);f.name.focus();return msg('Please enter the name or company for the invoice.')}
  if(!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(m)){bad(f.email,1);f.email.focus();return msg('Please enter a valid email address.')}
  if(ENGANG.indexOf(m.split('@')[1])>=0){bad(f.email,1);return msg('Please use a permanent email address, not a temporary one.')}
  if(ad.length<8){bad(f.address,1);f.address.focus();return msg('Please enter the billing address.')}
  var b=f.querySelector('button[type=submit]'),old=b.innerHTML; b.classList.add('laddar'); b.setAttribute('aria-disabled','true'); b.innerHTML='<span class="spinn"></span><span>Sending</span>';
  function klar(){b.classList.remove('laddar');b.removeAttribute('aria-disabled');b.innerHTML=old}
  fetch(API+'/api/order',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({plan:sel.value,name:n,email:m,address:ad,vat:f.vat.value.trim(),ref:REF||undefined,website:f.website.value,t:t0})})
   .then(function(r){return r.json().catch(function(){return {ok:false,message:'Something went wrong. Please try again or write to info@cliprauto.com.'}})})
   .then(function(j){klar(); if(j&&j.ok){f.hidden=true;sent.hidden=false;sent.querySelector('.to').textContent=m}else{msg((j&&j.message)||'Something went wrong. Please try again or write to info@cliprauto.com.')}})
   .catch(function(){klar();msg('We could not reach the server. Please check your connection and try again, or write to info@cliprauto.com.')});
 });
})();
