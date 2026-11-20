/* Clipr Website (Stacco-stil): hero-fältet fyller i formuläret längre ned, och före/efter-reglaget glider av sig självt. */
(function(){
 document.querySelectorAll('form[data-mini]').forEach(function(m){m.addEventListener('submit',function(e){e.preventDefault();
  var mal=document.querySelector(m.dataset.mini),f=mal&&mal.querySelector('form');if(!f){location.hash=m.dataset.mini;return}
  var falt=f.querySelector('[name='+m.dataset.falt+']'),i=m.querySelector('input');if(falt&&i)falt.value=i.value;
  mal.scrollIntoView({behavior:'smooth',block:'start'});var n=f.querySelector('[name=email]');setTimeout(function(){if(n)n.focus({preventScroll:true})},450)})});
 var c=document.getElementById('cmp');if(!c)return;var r=c.querySelector('input'),on=false,t0=null,rm=matchMedia('(prefers-reduced-motion: reduce)').matches;
 function set(v){c.style.setProperty('--p',v+'%');r.value=v}
 ['pointerdown','keydown','focus','touchstart'].forEach(function(e){c.addEventListener(e,function(){on=true})});
 r.addEventListener('input',function(){set(parseFloat(r.value))});
 function f(t){if(on||rm)return;if(t0===null)t0=t;set(50+28*Math.sin((t-t0)/1000*0.9));requestAnimationFrame(f)}
 if(!rm)requestAnimationFrame(f);
})();
