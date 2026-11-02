/* Clipr Website: den privata rapportsidan. Allt som kommer från kundens sajt skrivs med textContent (aldrig innerHTML). */
(function(){
 var API='https://cliprauto-mottagning.mottagning.workers.dev';
 var root=document.getElementById('rep'); if(!root)return;
 var id=(new URLSearchParams(location.search).get('id')||'').replace(/[^a-z0-9]/gi,'').slice(0,40);
 function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
 function tom(){while(root.firstChild)root.removeChild(root.firstChild)}
 var TEXT={verify:['Confirm your email','We sent you an email with a button. Press it and the review starts. Nothing happens before you do.'],
  queue:['You are in line','Your website is waiting for its turn. This page updates by itself, and we also email you when the review is ready.'],
  full:['We are full for today','Reviews are limited per day so every one gets done properly. Yours is saved and starts as soon as there is room. We email you when it is ready.'],
  scanning:['Reviewing your website','We are visiting your site on a phone and on a computer. This usually takes a few minutes.'],
  failed:['We could not finish this one','This usually means the site blocks automatic visitors or could not be reached. Write to info@cliprauto.com and a person will take a look.'],
  expired:['This link is not valid any more','Review pages are deleted after 30 days. You can ask for a new review on the Clipr Website page.']};
 function stat(s,extra){tom();var d=el('div','pf-wstate');d.appendChild(el('div','pf-wdot'));var t=TEXT[s]||TEXT.queue;d.appendChild(el('h1',null,t[0]));d.appendChild(el('p',null,s==='failed'&&extra?extra+' '+t[1]:t[1]));
  if(s==='expired'||s==='failed'){var a=el('a','btn','Back to Clipr Website');a.href='./';d.appendChild(a)}root.appendChild(d)}
 var OMR=['Mobile','Search and sharing','Speed','Trust and contact','Technical'];
 var PRIO={1:['Fix first','p1'],2:['Should fix','p2'],3:['Nice to have','p3']};
 function fynd(f){var li=el('li','pf-wf '+(PRIO[f.prio]||PRIO[2])[1]);var h=el('div','h');h.appendChild(el('span','tag',(PRIO[f.prio]||PRIO[2])[0]));h.appendChild(el('b',null,f.rubrik));li.appendChild(h);
  if(f.varfor)li.appendChild(el('p','why',f.varfor));if(f.bevis)li.appendChild(el('p','ev',f.bevis));if(f.atgard){var a=el('p','fix');a.appendChild(el('b',null,'How to fix it: '));a.appendChild(document.createTextNode(f.atgard));li.appendChild(a)}return li}
 function visa(r,host){
  tom();var wrap=el('div','pf-wrap');var h=el('div','pf-whead');h.appendChild(el('div','pf-eyebrow','Website review'));h.appendChild(el('h1',null,r.host||host));
  h.appendChild(el('p','meta','Reviewed '+(r.datum||'')+(r.mat&&r.mat.sidor?' · '+r.mat.sidor+' page'+(r.mat.sidor>1?'s':'')+' checked':'')));wrap.appendChild(h);
  var list=(r.fynd||[]).slice().sort(function(a,b){return (a.prio||2)-(b.prio||2)});
  if(r.sammanfattning){var s=el('div','pf-card pf-wsum');s.appendChild(el('h2',null,'In short'));s.appendChild(el('p',null,r.sammanfattning));wrap.appendChild(s)}
  var forst=list.filter(function(f){return f.prio===1}).slice(0,3);
  if(forst.length){var c=el('div','pf-card');c.appendChild(el('h2',null,'Fix these first'));var ul=el('ol','pf-wlist');forst.forEach(function(f){ul.appendChild(fynd(f))});c.appendChild(ul);wrap.appendChild(c)}
  var rest=list.filter(function(f){return forst.indexOf(f)<0});
  if(rest.length){var c2=el('div','pf-card');c2.appendChild(el('h2',null,'Everything else we found'));
   OMR.forEach(function(o){var g=rest.filter(function(f){return f.omrade===o});if(!g.length)return;c2.appendChild(el('h3','pf-wgrp',o));var ul2=el('ul','pf-wlist');g.forEach(function(f){ul2.appendChild(fynd(f))});c2.appendChild(ul2)});wrap.appendChild(c2)}
  if(!list.length){var c3=el('div','pf-card');c3.appendChild(el('h2',null,'Nothing needs fixing right away'));c3.appendChild(el('p',null,'We did not find anything on the pages we checked that needs fixing. That does not mean nothing can be improved, only that the basics are in place.'));wrap.appendChild(c3)}
  if((r.ok||[]).length){var d=el('details','pf-card pf-wok');d.appendChild(el('summary',null,'What is already fine ('+r.ok.length+')'));var u3=el('ul',null);r.ok.forEach(function(o){u3.appendChild(el('li',null,o.rubrik))});d.appendChild(u3);wrap.appendChild(d)}
  if(r.mobil&&/^data:image\/jpeg;base64,[A-Za-z0-9+\/=]+$/.test(r.mobil)){var m=el('div','pf-card pf-wmob');m.appendChild(el('h2',null,'How your first screen looks on a phone'));var im=document.createElement('img');im.src=r.mobil;im.alt='Your website on a phone, first screen';im.width=390;im.height=844;m.appendChild(im);wrap.appendChild(m)}
  var cta=el('div','pf-card pf-wcta');cta.appendChild(el('h2',null,'Want help with this?'));cta.appendChild(el('p',null,'Write to us and tell us which points you want fixed. We reply with what it would take.'));
  var a=el('a','btn','Write to CliprAuto');a.href='mailto:info@cliprauto.com?subject='+encodeURIComponent('Website review '+(r.host||host));cta.appendChild(a);wrap.appendChild(cta);
  wrap.appendChild(el('p','pf-wnote','This page is private: only people with the link can open it. It is deleted after 30 days. We read only the public pages of your site and changed nothing on it. The review is automatic, based on measurements of your pages.'));
  root.appendChild(wrap)}
 var timer=null;
 function hamta(){fetch(API+'/api/webb/status/'+id).then(function(r){return r.json().catch(function(){return {ok:false}})}).then(function(j){
   if(!j||!j.ok){stat('expired');return}
   if(j.state==='ready'&&j.rapport){visa(j.rapport,j.host);return}
   stat(j.state,j.orsak);if(j.state==='queue'||j.state==='scanning'||j.state==='verify'||j.state==='full')timer=setTimeout(hamta,j.state==='scanning'?6000:12000)
  }).catch(function(){stat('queue');timer=setTimeout(hamta,15000)})}
 if(!id){stat('expired')}else{hamta()}
})();
