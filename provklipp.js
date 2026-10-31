/* Provklipp-formuläret (FÖRHANDSVISNING: inget skickas). Kontrollerna här är bara för användaren; de riktiga skydden körs alltid på servern. */
(function(){
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
   if(f.website.value||Date.now()-t0<3000){return fake(f,sent,mail.value)}          // robot: fyllde dolda fältet eller var för snabb
   if(forsok()>3){return msg(f,'Too many attempts from this device. Please try again in an hour.')}
   var u; try{u=new URL(link.value.trim())}catch(e){u=null}
   if(!u||u.protocol!=='https:'||OK_HOSTS.indexOf(u.hostname.toLowerCase())<0){bad(link,1);return msg(f,'Please paste a link from YouTube, Vimeo or Loom.')}
   var m=mail.value.trim().toLowerCase();
   if(!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(m)){bad(mail,1);return msg(f,'Please enter a valid email address.')}
   if(ENGANG.indexOf(m.split('@')[1])>=0){bad(mail,1);return msg(f,'Please use a permanent email address, not a temporary one.')}
   if(!f.own.checked){return msg(f,'Please confirm this is your own content, or that you have permission.')}
   var b=f.querySelector('button'); b.disabled=true; b.textContent='Sending…';
   setTimeout(function(){fake(f,sent,m);b.disabled=false;b.textContent='Get a free sample'},700);
  });
 });
 function fake(f,sent,mail){var l=f.link.value.trim();f.hidden=true;sent.hidden=false;location.href='mailto:info@cliprauto.com?subject='+encodeURIComponent('Free sample request')+'&body='+encodeURIComponent('Hi,\n\nPlease make a free sample from my video:\n'+l+'\n\nMy email: '+(mail||'')+'\nI post on: ')}
 document.querySelectorAll('.sent .back').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();var s=a.closest('.sent');s.hidden=true;s.parentNode.querySelector('form').hidden=false})});
})();
