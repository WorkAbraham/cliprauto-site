/* design-g.js – sidornas beteende i G-designen (6 nov 2026): klippen (tryck = spela med ljud, övriga pausas),
   hjältens länkfält (fyller i huvudformuläret och skrollar dit) och Mac/Windows-valet (sparas som i dag i localStorage "pf-os"). */
(function(){
 var klipp=document.querySelectorAll('.vid');
 klipp.forEach(function(f){var v=f.querySelector('video');if(!v)return;f.addEventListener('click',function(){
  klipp.forEach(function(o){if(o!==f){var ov=o.querySelector('video');if(ov){ov.pause();ov.muted=true}o.classList.remove('spelar')}});
  if(v.paused){v.muted=false;v.play();f.classList.add('spelar')}else{v.pause();v.muted=true;f.classList.remove('spelar')}})});
 document.querySelectorAll('form[data-mini]').forEach(function(m){m.addEventListener('submit',function(e){e.preventDefault();
  var mal=document.querySelector(m.dataset.mini),f=mal&&mal.querySelector('form');if(!f){location.hash=m.dataset.mini;return}
  var falt=f.querySelector('[name='+m.dataset.falt+']'),in_=m.querySelector('input');if(falt&&in_)falt.value=in_.value;
  mal.scrollIntoView({behavior:'smooth',block:'start'});var nasta=f.querySelector('[name=email]');setTimeout(function(){if(nasta)nasta.focus({preventScroll:true})},450)})});
 var mac=document.getElementById('os-mac'),win=document.getElementById('os-win');
 if(mac&&win){var o='mac';try{o=localStorage.getItem('pf-os')||(/Win/i.test(navigator.platform||navigator.userAgent)?'win':'mac')}catch(e){}
  (o==='win'?win:mac).checked=true;[mac,win].forEach(function(r){r.addEventListener('change',function(){try{localStorage.setItem('pf-os',r===win?'win':'mac')}catch(e){}})})}
})();
