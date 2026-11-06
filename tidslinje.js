/* I – den sanna tidslinjen (6 nov 2026). Allt här bygger på uppmätta tider: klippens position i källan (passning.json, ordföljdsmatchning
   mot källans transkript), ordtiderna i klippen och källans längd. Inget är uppskattat. */
(function () {
  var P = window.PASSNING; if (!P) return;
  var dur = P.source.duration, rem = document.querySelector('.remsa'), spel = document.querySelector('.spelhuvud'), tcEl = document.querySelector('.tl-tc');
  var tc = function (s) { s = Math.max(0, s); var h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), x = Math.floor(s % 60); return (h ? String(h).padStart(2, '0') + ':' : '00:') + String(m).padStart(2, '0') + ':' + String(x).padStart(2, '0'); };
  // klippens verkliga områden på linjalen
  var spann = document.querySelector('.tl-spann'); var klipp = {}; var lagen = {};
  P.clips.forEach(function (c) { klipp[c.name] = c; var k = c.source_start + '-' + c.source_end; if (lagen[k]) return; lagen[k] = c;
    var el = document.createElement('a'); el.href = '#looks'; el.className = 'tl-klipp'; el.dataset.name = c.name;
    el.style.left = (c.source_start / dur * 100) + '%'; el.style.width = Math.max(0.6, (c.source_end - c.source_start) / dur * 100) + '%';
    el.setAttribute('aria-label', 'Play the clip cut at ' + tc(c.source_start)); el.innerHTML = '<span class="tc">' + tc(c.source_start) + ' – ' + tc(c.source_end) + '</span>';
    spann.appendChild(el); el.addEventListener('click', function (e) { e.preventDefault(); spelaKlipp(c.name); });
    var yta = document.createElement('div'); yta.className = 'klippyta'; yta.style.left = el.style.left; yta.style.width = el.style.width; rem.appendChild(yta); });
  // spelhuvudet följer pekaren/fingret över remsan
  function flytta(x) { var r = rem.getBoundingClientRect(); var f = Math.min(1, Math.max(0, (x - r.left) / r.width)); spel.style.left = (f * 100) + '%'; tcEl.textContent = tc(f * dur);
  }
  rem.addEventListener('pointermove', function (e) { flytta(e.clientX); });
  rem.addEventListener('pointerdown', function (e) { flytta(e.clientX); });
  // ordvis undertext + avläsning medan ett klipp spelar
  var vids = document.querySelectorAll('.tl-vid'), orden = document.querySelector('.ord'), rakna = document.querySelector('.avl-ord'), langd = document.querySelector('.avl-langd'), hel = document.querySelector('.avl-hel');
  function spelaKlipp(name) { vids.forEach(function (f) { var v = f.querySelector('video'); if (f.dataset.name === name) { f.classList.add('spelar'); v.muted = false; v.currentTime = 0; v.play(); } else { f.classList.remove('spelar'); v.pause(); v.muted = true; } });
    document.querySelectorAll('.tl-klipp').forEach(function (b) { b.classList.toggle('aktiv', b.dataset.name === name); }); }
  vids.forEach(function (f) { var v = f.querySelector('video'), c = klipp[f.dataset.name]; if (!v || !c) return;
    f.addEventListener('click', function () { if (v.paused) spelaKlipp(c.name); else { v.pause(); v.muted = true; f.classList.remove('spelar'); } });
    v.addEventListener('timeupdate', function () { if (f.dataset.name !== (document.querySelector('.tl-vid.spelar') || {}).dataset?.name) return; var t = v.currentTime, n = 0, akt = '';
      for (var i = 0; i < c.words.length; i++) { if (c.words[i][0] <= t) { n = i + 1; akt = c.words[i][2]; } }
      var a = Math.max(0, n - 7), z = Math.min(c.words.length, a + 16); orden.innerHTML = c.words.slice(a, z).map(function (w, i) { var k = a + i; return '<span' + (k < n ? ' class="sagt"' : '') + (k === n - 1 ? ' aria-current="true"' : '') + '>' + w[2] + '</span>'; }).join(' ');
      rakna.textContent = n + ' of ' + c.words.length + ' words'; langd.textContent = t.toFixed(1) + ' s'; hel.textContent = t < 0.4 ? 'start on a full sentence' : (v.duration - t < 0.6 ? 'ends on a full sentence' : 'inside a whole sentence'); });
    v.addEventListener('ended', function () { f.classList.remove('spelar'); }); });
  // entré en gång: klippen faller ur källan (bara om besökaren inte bett om mindre rörelse)
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) { document.querySelector('.hero-art').classList.add('entre'); setTimeout(function () { document.querySelector('.hero-art').classList.add('inne'); }, 60); }
})();
