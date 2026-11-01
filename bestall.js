/* Beställningsdialogen: plan-knapparna öppnar ett formulär i stället för ett mejl. Skickar till mottagningen (/api/order). Kontrollerna här är bara för användaren; de riktiga skydden körs på servern.
   Utan JavaScript fungerar knapparna som förut (mejl till info@cliprauto.com med planen ifylld). Priser och namn läses ur planernas kort, så att de bara finns på ett ställe. */
(function(){
 var API='https://cliprauto-mottagning.mottagning.workers.dev', dlg=document.getElementById('order'); if(!dlg||!dlg.showModal) return;
 var f=dlg.querySelector('form'), sent=dlg.querySelector('.sent'), sel=f.plan, t0=Date.now(), trigger=null, planer={};
 var ENGANG=['mailinator.com','guerrillamail.com','10minutemail.com','tempmail.com','yopmail.com','trashmail.com','sharklasers.com','getnada.com','throwawaymail.com'];
 document.querySelectorAll('a[data-plan]').forEach(function(a){
  var kort=a.closest('.pkg3'), pr=kort.querySelector('.price'), k=a.dataset.plan;
  planer[k]={namn:kort.querySelector('h3').textContent.trim(),pris:pr.firstChild.textContent.trim()};
  var o=document.createElement('option'); o.value=k; o.textContent=planer[k].namn+' · '+planer[k].pris; sel.appendChild(o);
  a.addEventListener('click',function(ev){ev.preventDefault(); trigger=a; sel.value=k; visa(); f.hidden=false; sent.hidden=true; dlg.showModal(); (f.name.value?f.email:f.name).focus()});
 });
 function visa(){var p=planer[sel.value];dlg.querySelector('.op').textContent=p.namn;dlg.querySelector('.opr').textContent=p.pris+' per month, invoiced monthly'}
 sel.addEventListener('change',visa);
 function msg(t){f.querySelector('.msg').textContent=t||''}
 function bad(el,on){el.classList.toggle('bad',!!on)}
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
  fetch(API+'/api/order',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({plan:sel.value,name:n,email:m,address:ad,vat:f.vat.value.trim(),website:f.website.value,t:t0})})
   .then(function(r){return r.json().catch(function(){return {ok:false,message:'Something went wrong. Please try again or write to info@cliprauto.com.'}})})
   .then(function(j){klar(); if(j&&j.ok){f.hidden=true;sent.hidden=false;sent.querySelector('.to').textContent=m}else{msg((j&&j.message)||'Something went wrong. Please try again or write to info@cliprauto.com.')}})
   .catch(function(){klar();msg('We could not reach the server. Please check your connection and try again, or write to info@cliprauto.com.')});
 });
})();
