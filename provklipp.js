/* Provklipp-formuläret: skickar till mottagningen (Cloudflare Worker), som mejlar bekräftelsen. Kontrollerna här är bara för användaren; de riktiga skydden körs alltid på servern. */
(function(){
 var API='https://cliprauto-mottagning.mottagning.workers.dev';
 var OK_HOSTS=['youtube.com','www.youtube.com','m.youtube.com','youtu.be','vimeo.com','player.vimeo.com','loom.com','www.loom.com'];
 var ENGANG=['mailinator.com','guerrillamail.com','10minutemail.com','tempmail.com','yopmail.com','trashmail.com','sharklasers.com','getnada.com','throwawaymail.com'];
 var t0=Date.now();
 function msg(f,t){f.querySelector('.msg').textContent=t||''}
 function bad(el,on){el.classList.toggle('bad',!!on)}
 function forsok(){try{var a=JSON.parse(localStorage.getItem('prov_f')||'[]').filter(function(x){return Date.now()-x<36e5});a.push(Date.now());localStorage.setItem('prov_f',JSON.stringify(a));return a.length}catch(e){return 0}}
 function maska(e){var p=e.split('@');return p[0].slice(0,1)+'***@'+p[1]}
 document.querySelectorAll('form[data-prov]').forEach(function(f){
  var box=f.parentNode, sent=box.querySelector('.sent');
  f.addEventListener('submit',function(ev){
   ev.preventDefault(); msg(f,''); var link=f.link, mail=f.email; bad(link,0); bad(mail,0);
   if(f.website.value||Date.now()-t0<3000){f.hidden=true;sent.hidden=false;return}          // robot: fyllde dolda fältet eller var för snabb
   if(forsok()>3){return msg(f,'Too many attempts from this device. Please try again in an hour.')}
   var u; try{u=new URL(link.value.trim())}catch(e){u=null}
   if(!u||u.protocol!=='https:'||OK_HOSTS.indexOf(u.hostname.toLowerCase())<0){bad(link,1);return msg(f,'Please paste a link from YouTube, Vimeo or Loom.')}
   var m=mail.value.trim().toLowerCase();
   if(!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(m)){bad(mail,1);return msg(f,'Please enter a valid email address.')}
   if(ENGANG.indexOf(m.split('@')[1])>=0){bad(mail,1);return msg(f,'Please use a permanent email address, not a temporary one.')}
   if(!f.own.checked){return msg(f,'Please confirm this is your own content, or that you have permission.')}
   var b=f.querySelector('button'),old=b.innerHTML; b.classList.add('laddar'); b.setAttribute('aria-disabled','true'); b.innerHTML='<span class="spinn"></span><span>Sending</span>';
   function klar(){b.classList.remove('laddar');b.removeAttribute('aria-disabled');b.innerHTML=old}
   fetch(API+'/api/request',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({link:link.value.trim(),email:m,own:true,website:f.website.value,t:t0})})
    .then(function(r){return r.json().catch(function(){return {ok:false,message:'Something went wrong. Please try again or write to info@cliprauto.com.'}})})
    .then(function(j){klar(); if(j&&j.ok){f.hidden=true;sent.hidden=false;var p=sent.querySelector('.to');if(p)p.textContent=m}else{msg(f,(j&&j.message)||'Something went wrong. Please try again or write to info@cliprauto.com.')}})
    .catch(function(){klar();msg(f,'We could not reach the server. Please check your connection and try again, or write to info@cliprauto.com.')});
  });
 });
 document.querySelectorAll('.sent .back').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();var s=a.closest('.sent');s.hidden=true;s.parentNode.querySelector('form').hidden=false})});
})();
