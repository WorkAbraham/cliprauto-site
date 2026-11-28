/* Meny på mobil + före/efter-reglaget. */
(function(){
 var b=document.querySelector('.meny-knapp'),m=document.getElementById('meny');
 if(b&&m){b.addEventListener('click',function(){var o=m.classList.toggle('open');b.setAttribute('aria-expanded',o?'true':'false');b.querySelector('.mk-t').textContent=o?'Close menu':'Open menu'});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&m.classList.contains('open')){m.classList.remove('open');b.setAttribute('aria-expanded','false');b.querySelector('.mk-t').textContent='Open menu';b.focus()}})}
 document.querySelectorAll('[data-kopiera]').forEach(function(k){k.addEventListener('click',function(){var t=document.getElementById(k.dataset.kopiera);if(!t||!navigator.clipboard)return;navigator.clipboard.writeText(t.textContent).then(function(){var ik=k.querySelector('.ik'),g=k.firstChild.nodeValue;k.firstChild.nodeValue=k.dataset.klar;setTimeout(function(){k.firstChild.nodeValue=g},2000)}).catch(function(){})})});
 try{fetch((document.querySelector('link[rel=stylesheet]').href.replace(/stil\.css.*$/,''))+'betalning.json',{cache:'no-store'}).then(function(r){return r.ok?r.json():{}}).then(function(j){document.querySelectorAll('a[data-plan][data-betald]').forEach(function(a){var l=j[a.dataset.plan];if(l&&/^https:\/\/www\.paypal\.com\//.test(l)){var ik=a.querySelector('.ik');a.textContent=a.dataset.betald;if(ik)a.appendChild(ik);a.href=l;a.target='_blank';a.rel='noopener'}})}).catch(function(){})}catch(e){}
 document.querySelectorAll('.fe input[type=range]').forEach(function(r){var f=r.closest('.fe');function s(){f.style.setProperty('--x',r.value+'%')}r.addEventListener('input',s);s()});
})();
