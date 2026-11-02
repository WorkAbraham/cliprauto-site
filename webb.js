/* Clipr Website: beställningsformuläret. Kontrollerna här är bara för användaren; de riktiga skydden körs alltid på servern. */
(function(){
 var API='https://cliprauto-mottagning.mottagning.workers.dev';
 var ENGANG=['mailinator.com','guerrillamail.com','10minutemail.com','tempmail.com','yopmail.com','trashmail.com','sharklasers.com','getnada.com','throwawaymail.com'];
 var t0=Date.now();
 function msg(f,t){f.querySelector('.msg').textContent=t||''}
 function bad(el,on){el.classList.toggle('bad',!!on)}
 function forsok(){try{var a=JSON.parse(localStorage.getItem('webb_f')||'[]').filter(function(x){return Date.now()-x<36e5});a.push(Date.now());localStorage.setItem('webb_f',JSON.stringify(a));return a.length}catch(e){return 0}}
 function adress(v){v=(v||'').trim();if(!v||v.length>200)return null;if(!/^https?:\/\//i.test(v))v='https://'+v;var u;try{u=new URL(v)}catch(e){return null}
  var h=u.hostname;if(!/\./.test(h)||/^\d+(\.\d+){3}$/.test(h)||/(^|\.)(localhost|local|internal|lan|test|invalid)$/i.test(h))return null;return u.href}
 document.querySelectorAll('form[data-webb]').forEach(function(f){
  var box=f.parentNode, sent=box.querySelector('.sent');
  f.addEventListener('submit',function(ev){
   ev.preventDefault(); msg(f,''); var site=f.site, mail=f.email; bad(site,0); bad(mail,0);
   if(f.website.value||Date.now()-t0<3000){f.hidden=true;sent.hidden=false;return}
   if(forsok()>3){return msg(f,'Too many attempts from this device. Please try again in an hour.')}
   var a=adress(site.value); if(!a){bad(site,1);return msg(f,'Please enter the address of your website, for example yourcompany.com.')}
   var m=mail.value.trim().toLowerCase();
   if(!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(m)){bad(mail,1);return msg(f,'Please enter a valid email address.')}
   if(ENGANG.indexOf(m.split('@')[1])>=0){bad(mail,1);return msg(f,'Please use a permanent email address, not a temporary one.')}
   var b=f.querySelector('button'),old=b.innerHTML; b.classList.add('laddar'); b.setAttribute('aria-disabled','true'); b.innerHTML='<span class="spinn"></span><span>Sending</span>';
   function klar(){b.classList.remove('laddar');b.removeAttribute('aria-disabled');b.innerHTML=old}
   fetch(API+'/api/webb',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({site:a,email:m,website:f.website.value,t:t0})})
    .then(function(r){return r.json().catch(function(){return {ok:false,message:'Something went wrong. Please try again or write to info@cliprauto.com.'}})})
    .then(function(j){klar(); if(j&&j.ok){f.hidden=true;sent.hidden=false;var p=sent.querySelector('.to');if(p)p.textContent=m}else{msg(f,(j&&j.message)||'Something went wrong. Please try again or write to info@cliprauto.com.')}})
    .catch(function(){klar();msg(f,'We could not reach the server. Please check your connection and try again, or write to info@cliprauto.com.')});
  });
 });
 document.querySelectorAll('.sent .back').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();var s=a.closest('.sent');s.hidden=true;s.parentNode.querySelector('form').hidden=false})});
 var m=document.getElementById('webbDlg');
 if(m&&m.showModal){document.querySelectorAll('a[data-webb-open]').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();m.showModal();var i=m.querySelector('input[name=site]');if(i)i.focus()})});
  m.querySelector('.pf-x').addEventListener('click',function(){m.close()});m.addEventListener('click',function(e){if(e.target===m)m.close()})}
})();
