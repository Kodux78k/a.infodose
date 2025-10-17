// UNO • Arch ORB — component API
// Usage:
// 1) Include arch-orb.css
// 2) Call ArchOrb.loadDefs('/orb/arch-orb.svg') once
// 3) Place <div id="arch-orb-wrap"><svg id="arch-orb" viewBox="0 0 200 200"></svg></div>
// 4) ArchOrb.mount('#arch-orb'); ArchOrb.set('nova')

(function(global){
  const ARCHES = [
    {id:'atlas',label:'Atlas'},{id:'nova',label:'Nova'},{id:'vitalis',label:'Vitalis'},{id:'pulse',label:'Pulse'},
    {id:'artemis',label:'Artemis'},{id:'serena',label:'Serena'},{id:'kaos',label:'Kaos'},{id:'genus',label:'Genus'},
    {id:'lumine',label:'Lumine'},{id:'solus',label:'Solus'},{id:'aion',label:'Aion'},{id:'rhea',label:'Rhea'}
  ];
  let $svg, idx=0, defsLoaded=false;

  async function loadDefs(url){
    if(defsLoaded) return;
    const res = await fetch(url, {credentials:'same-origin'});
    const txt = await res.text();
    const holder = document.createElement('div');
    holder.innerHTML = txt;
    const svg = holder.querySelector('svg');
    if(svg) document.body.appendChild(svg);
    defsLoaded = true;
  }

  function mount(selector){
    $svg = typeof selector==='string' ? document.querySelector(selector) : selector;
    if(!$svg) throw new Error('ArchOrb.mount: target not found');
    // Ensure DEFs exist (if user forgot, we warn)
    if(!document.getElementById('orb-horus')){
      console.warn('[ArchOrb] defs not found. Call ArchOrb.loadDefs("/orb/arch-orb.svg") before mount.');
    }
    // Paint initial structure
    $svg.innerHTML = [
      '<use href="#orb-horus"></use>',
      '<g opacity=".28"><use href="#delta-vortex"></use></g>',
      '<g id="arch-icon-holder" transform="translate(100,100) translate(-50,-50)">',
      '  <use id="arch-icon" href="#icon-atlas"></use>',
      '</g>'
    ].join('');
  }

  function setArch(key){
    const i = typeof key==='number' ? ((key%ARCHES.length)+ARCHES.length)%ARCHES.length
                                    : ARCHES.findIndex(a=>a.id===String(key).toLowerCase());
    if(i<0) return;
    idx = i;
    const use = $svg && $svg.querySelector('#arch-icon');
    if(use) use.setAttribute('href', '#icon-'+ARCHES[i].id);
    global.dispatchEvent(new CustomEvent('arch:changed', {detail:{id: ARCHES[i].id}}));
    return ARCHES[i];
  }

  function get(){ return ARCHES[idx]; }
  function svg(){ return new XMLSerializer().serializeToString($svg); }

  global.ArchOrb = { loadDefs, mount, set: setArch, get, svg };
})(window);
