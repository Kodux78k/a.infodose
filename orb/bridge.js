// UNO • Arch ORB Bridge — Tabs, Theme, Voices, Overlay Sync
// Expect: an ArchOrb already mounted
(function(global){
  const $ = sel=>document.querySelector(sel);
  const KEY = 'uno:arch:selected';
  const KEY_OVERLAY = 'uno:overlay:value';
  const KEY_OVERLAY_LOCK = 'uno:overlay:lock';

  // THEME
  const ARCH_THEME = {
    atlas:{a:'#ff52e5',b:'#00c5e5',overlay:'rgba(64,158,255,.22)'},
    nova:{a:'#ffd452',b:'#ff52e5',overlay:'rgba(255, 82, 229, .18)'},
    vitalis:{a:'#39FFB6',b:'#00c5e5',overlay:'rgba(57,255,182,.16)'},
    pulse:{a:'#00c5e5',b:'#39FFB6',overlay:'rgba(0,197,229,.18)'},
    artemis:{a:'#ff9e52',b:'#ffd452',overlay:'rgba(255, 158, 82, .18)'},
    serena:{a:'#8aa3ff',b:'#39FFB6',overlay:'rgba(138,163,255,.18)'},
    kaos:{a:'#ff52e5',b:'#d800d8',overlay:'rgba(216,0,216,.20)'},
    genus:{a:'#52ffcf',b:'#52a5ff',overlay:'rgba(82,165,255,.18)'},
    lumine:{a:'#ffd452',b:'#fff4a8',overlay:'rgba(255,212,82,.16)'},
    solus:{a:'#a8ffea',b:'#39FFB6',overlay:'rgba(168,255,234,.16)'},
    aion:{a:'#52a5ff',b:'#00c5e5',overlay:'rgba(82,165,255,.18)'},
    rhea:{a:'#52ffd4',b:'#8aa3ff',overlay:'rgba(138,163,255,.16)'}
  };

  function applyTheme(id){
    const t = ARCH_THEME[id] || ARCH_THEME.atlas;
    const root = document.documentElement;
    root.style.setProperty('--grad-a', t.a);
    root.style.setProperty('--grad-b', t.b);
    if(!isOverlayLocked() && t.overlay){
      setOverlay(t.overlay);
    }
    document.body.setAttribute('data-arch', id);
  }

  function setOverlay(value){
    if(!value) return;
    document.documentElement.style.setProperty('--arch-overlay', value);
    const radial = $('#orb-radial, .orb-radial, [data-orb-radial]');
    if(radial){ try{ radial.style.setProperty('--arch-overlay', value); radial.style.boxShadow = `0 0 42px 0 ${value}`;}catch{} }
    try{ localStorage.setItem(KEY_OVERLAY, value); }catch{}
    global.dispatchEvent(new CustomEvent('overlay:changed', {detail:{value}}));
  }
  function getOverlay(){ try{ return localStorage.getItem(KEY_OVERLAY) || getComputedStyle(document.documentElement).getPropertyValue('--arch-overlay') || ''; }catch{} return ''; }
  function isOverlayLocked(){ try{ return localStorage.getItem(KEY_OVERLAY_LOCK) === '1'; }catch{} return false; }
  function setOverlayLock(lock){ try{ localStorage.setItem(KEY_OVERLAY_LOCK, lock ? '1' : '0'); }catch{} const el=$('#ls-overlay-lock'); if(el) el.checked=!!lock; }

  // LSPanel wires (optional elements)
  function wireLSPanel(){
    const lockEl = $('#ls-overlay-lock');
    if(lockEl){ lockEl.addEventListener('change', ()=> setOverlayLock(lockEl.checked)); }
    const alphaEl = $('#ls-overlay-alpha');
    if(alphaEl){
      alphaEl.addEventListener('input', ()=>{
        const m = (getOverlay() || 'rgba(64, 158, 255, 0.22)').match(/\d+(\.\d+)?/g) || [64,158,255,0.22];
        const a = Math.max(0, Math.min(1, parseFloat(alphaEl.value||'0.22')));
        setOverlay(`rgba(${m[0]}, ${m[1]}, ${m[2]}, ${a})`);
      });
    }
    const colorEl = $('#ls-overlay-color');
    if(colorEl){
      colorEl.addEventListener('input', ()=>{
        const hex = colorEl.value || '#409EFF';
        const m = hex.replace('#','');
        const r = parseInt(m.slice(0,2),16), g = parseInt(m.slice(2,4),16), b = parseInt(m.slice(4,6),16);
        const alphaMatch = (getOverlay().match(/rgba?\(\s*\d+,\s*\d+,\s*\d+,\s*([\d.]+)\s*\)/i) || [,'0.22'])[1];
        setOverlay(`rgba(${r}, ${g}, ${b}, ${alphaMatch})`);
      });
    }
  }

  // Voices
  const VOICE_HINTS = {
    atlas:['Daniel','en-GB','en_GB'],
    nova:['Joana','pt-PT','pt_PT'],
    serena:['Luciana','pt-BR','pt_BR','pt'],
    rhea:['Luciana','pt-BR','pt_BR','pt'],
    aion:['Shelley','en-US','en_US'],
    genus:['Grandpa','en-US','en_US','en'],
    lumine:['Flo','en-US','en_US','en'],
    kaos:['Reed','en-US','en_US','en'],
    pulse:['fr','FR','Thomas','Paul','Male','France'],
    artemis:['it','IT','Luca','Paolo','Male','Italy'],
    vitalis:['es','ES','Miguel','Diego','es-'],
    solus:['en','en-US','en-GB','Neutral']
  };
  let VOICES=[];
  function loadVoices(){ VOICES = (global.speechSynthesis? speechSynthesis.getVoices():[]) || []; }
  if('speechSynthesis' in global){ loadVoices(); speechSynthesis.onvoiceschanged = loadVoices; }
  function pickVoice(hints){
    if(!VOICES.length||!hints) return null;
    const lower=s=>String(s||'').toLowerCase();
    let best=null,score=-1;
    for(const v of VOICES){
      const n=lower(v.name), l=lower(v.lang); let s=0;
      for(const h of hints){ const hh=lower(h); if(n.includes(hh)) s+=2; if(l.includes(hh)) s+=3; }
      if(s>score){best=v;score=s;}
    }
    return best;
  }
  function speak(id){
    if(!('speechSynthesis' in global)) return;
    const label = id.charAt(0).toUpperCase()+id.slice(1);
    const u = new SpeechSynthesisUtterance(label);
    const v = pickVoice(VOICE_HINTS[id]); if(v) u.voice=v;
    u.rate=1; u.pitch=1; u.volume=1; try{ speechSynthesis.cancel(); }catch{}
    speechSynthesis.speak(u);
  }

  // Tabs/Stacks hookup (IDs can be changed here)
  const TAB_ID   = '#tab-archetypes';
  const STACK_ID = '#stack-archetypes';
  const STACK_CLASS = '.stack';

  function activateStack(){
    const tab = $(TAB_ID), stack = $(STACK_ID);
    if(tab){
      const bar = tab.closest('.tabs, .tabbar, nav, .stack-tabs') || tab.parentElement;
      if(bar){ Array.from(bar.querySelectorAll('.active')).forEach(n=>n.classList.remove('active')); }
      tab.classList.add('active');
    }
    if(stack){
      const parent = stack.parentElement;
      if(parent){
        Array.from(parent.querySelectorAll(STACK_CLASS)).forEach(n=>{
          if(n!==stack){ n.setAttribute('hidden',''); n.style.display='none'; }
        });
      }
      stack.removeAttribute('hidden'); stack.style.display='block';
    }
  }

  // Bridge ArchOrb.set
  function bridge(){
    if(!global.ArchOrb || typeof global.ArchOrb.set!=='function') return;
    const prev = global.ArchOrb.set.bind(global.ArchOrb);
    global.ArchOrb.set = function(x){
      const res = prev(x);
      const cur = (global.ArchOrb.get && global.ArchOrb.get()) || null;
      const id = cur && cur.id || String(x).toLowerCase();
      applyTheme(id);
      speak(id);
      activateStack();
      try{ localStorage.setItem(KEY, id); }catch{}
      return res;
    };
  }

  // Global triggers (clicks)
  function onClick(e){
    const el = e.target.closest('[data-arch], a[href^="#arch-"]');
    if(!el) return;
    e.preventDefault();
    const id = (el.getAttribute('data-arch') || el.getAttribute('href').replace('#arch-','')).toLowerCase();
    if(id){ global.ArchOrb && global.ArchOrb.set(id); }
  }
  document.addEventListener('click', onClick, true);

  // Boot
  function restore(){
    let id = location.hash.slice(1);
    if(!id){ try{ id = localStorage.getItem(KEY) || ''; }catch{} }
    if(id){ global.ArchOrb && global.ArchOrb.set(id); }
    // restore overlay if saved
    const ov = getOverlay(); if(ov) setOverlay(ov);
  }

  // public tiny api
  global.ArchOrbBridge = { applyTheme, setOverlay, isOverlayLocked };

  document.addEventListener('DOMContentLoaded', ()=>{
    wireLSPanel();
    bridge();
    restore();
  });
})(window);
