/* Gratis arbetsprov (Pitch Engine). Tills mottagningen har en egen väg: öppnar ett ifyllt mejl till info@cliprauto.com. */
(function(){
 var TILL='info@cliprauto.com';
 function adress(v){v=(v||'').trim();if(!v)return null;if(!/^https?:\/\//i.test(v))v='https://'+v;try{var u=new URL(v);return /\./.test(u.hostname)?u.href:null}catch(e){return null}}
 document.querySelectorAll('form[data-prov]').forEach(function(f){
  var box=f.parentNode,sent=box.querySelector('.sent'),msg=f.querySelector('.msg');
  f.addEventListener('submit',function(ev){ev.preventDefault();msg.textContent='';
   ['agency','site','email','area'].forEach(function(n){f[n].classList.remove('bad')});
   if(!f.agency.value.trim()){f.agency.classList.add('bad');f.agency.focus();return msg.textContent='Please enter your agency name.'}
   var a=adress(f.site.value);if(!a){f.site.classList.add('bad');f.site.focus();return msg.textContent='Please enter a valid website address, for example youragency.com.'}
   var m=f.email.value.trim();if(!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(m)){f.email.classList.add('bad');f.email.focus();return msg.textContent='Please check your email address and try again.'}
   if(!f.area.value.trim()){f.area.classList.add('bad');f.area.focus();return msg.textContent='Please tell us the city or area you sell in.'}
   var kropp='Agency: '+f.agency.value.trim()+'\nWebsite: '+a+'\nEmail: '+m+'\nArea: '+f.area.value.trim()+'\nType of business: '+(f.industry.value.trim()||'-')+'\n\nPlease prepare a free Pitch Engine work sample.';
   location.href='mailto:'+TILL+'?subject='+encodeURIComponent('Free work sample: '+f.agency.value.trim())+'&body='+encodeURIComponent(kropp);
   f.hidden=true;sent.hidden=false;
  });
 });
 document.querySelectorAll('.sent .back').forEach(function(a){if(a.dataset.b)return;a.dataset.b=1;a.addEventListener('click',function(e){e.preventDefault();var s=a.closest('.sent');s.hidden=true;s.parentNode.querySelector('form').hidden=false})});
})();
