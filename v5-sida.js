/* Sidornas egna beteende i V5-designen – samma beteende som dagens inbäddade skript på cliprauto.com:
   toppfilmen (tryck för ljud), klippen (tryck = spela med ljud, övriga pausas), provdialogen (a[data-sample]),
   Mac/Windows-valet för CliprAuto-paketen (sparas som i dag i localStorage "pf-os") och paketdialogen (a[data-paket-open], #paket). */
(function(){
 var hp=document.getElementById('heroPhone'),hv=hp&&hp.querySelector('video'),tp=document.getElementById('tap');
 function tyst(){if(hv&&!hv.muted){hv.muted=true;if(tp)tp.textContent='Tap for sound'}}
 if(hp&&hv)hp.addEventListener('click',function(){hv.muted=!hv.muted;if(tp)tp.textContent=hv.muted?'Tap for sound':'Sound on';if(hv.paused)hv.play()});
 var klipp=document.querySelectorAll('.clip');
 klipp.forEach(function(f){var v=f.querySelector('video');if(!v)return;f.addEventListener('click',function(){
  klipp.forEach(function(o){if(o!==f){var ov=o.querySelector('video');if(ov)ov.pause();o.classList.remove('on')}});
  if(v.paused){tyst();v.muted=false;v.play();f.classList.add('on')}else{v.pause();f.classList.remove('on')}})});
 function dialog(d,oppnare,falt){if(!d||!d.showModal)return null;
  function opna(e){if(e)e.preventDefault();if(!d.open)d.showModal();var i=falt&&d.querySelector(falt);if(i)i.focus()}
  document.querySelectorAll(oppnare).forEach(function(a){a.addEventListener('click',opna)});
  var x=d.querySelector('.v5-x');if(x)x.addEventListener('click',function(){d.close()});
  d.addEventListener('click',function(e){if(e.target===d)d.close()});return opna}
 dialog(document.getElementById('sampleDlg'),'a[data-sample]','input[name=link]');
 var paket=document.getElementById('paket'),opnaPaket=dialog(paket,'a[data-paket-open]',null);
 if(opnaPaket){if(location.hash==='#paket')opnaPaket();window.addEventListener('hashchange',function(){if(location.hash==='#paket')opnaPaket()});
  paket.addEventListener('close',function(){if(location.hash==='#paket')history.replaceState(null,'',location.pathname+location.search)})}
 var b=document.querySelectorAll('.pf-os button'),g=document.querySelectorAll('.pf-plans[data-grupp]');
 if(b.length){function sat(o){b.forEach(function(x){x.setAttribute('aria-pressed',x.dataset.os===o?'true':'false')});g.forEach(function(x){x.hidden=x.dataset.grupp!==o});try{localStorage.setItem('pf-os',o)}catch(e){}}
  b.forEach(function(x){x.addEventListener('click',function(){sat(x.dataset.os)})});
  var o='mac';try{o=localStorage.getItem('pf-os')||(/Win/i.test(navigator.platform||navigator.userAgent)?'win':'mac')}catch(e){}sat(o)}
})();
