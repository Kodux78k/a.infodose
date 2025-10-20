// HUB UNO — Config Loader (external JSON + PWA hooks)
(() => {
  const log = (...a) => console.log("%c[UNO:config]", "color:#39ffb6", ...a);
  const $ = (q,r=document) => r.querySelector(q);

  // 1) Load apps.json (replaces embedded APPS_JSON if present)
  fetch("./config/apps.json", {cache:"no-store"})
    .then(r => r.ok ? r.json() : null)
    .then(data => {
      if (!data || !Array.isArray(data.apps)) return;
      if (window.RAW) {
        window.RAW.apps = data.apps;
        if (typeof window.renderApps === "function") window.renderApps();
        if (typeof window.ensureDefaultGroups === "function") window.ensureDefaultGroups();
        log("apps.json carregado:", data.apps.length);
      }
    }).catch(()=>{});

  // 2) Load archetypes.json → rebuild select + overlay map
  fetch("./config/archetypes.json", {cache:"no-store"})
    .then(r => r.ok ? r.json() : null)
    .then(cfg => {
      if (!cfg || !cfg.items) return;
      const sel = $("#arch-select");
      if (sel) {
        const keys = Object.keys(cfg.items);
        sel.innerHTML = keys.map(id => `<option value="./archetypes/${id}.html">${id}.html</option>`).join("");
      }

      // Build overlay map with 0.22 alpha (matches current style)
      const map = {};
      Object.entries(cfg.items).forEach(([id, it]) => {
        const hex = String(it.overlay || "#000000").trim();
        // simple hex→rgba (no alpha in hex) with fixed 0.22
        map[id.toLowerCase()] = `color-mix(in srgb, ${hex} 22%, transparent)`;
      });
      // Prefer patched map used by hardlock
      window.ARCH_OVERLAYS_PATCHED = map;
      // Apply current
      try {
        const cur = (sel?.value || "").replace(/.*\/|\.html$/g,"");
        if (typeof window.applyArchOverlay === "function") window.applyArchOverlay(cur);
      } catch {}

      // Voices per archetype preset (optional restore later)
      if (!localStorage.getItem("infodose:voices")) {
        const voices = {};
        Object.entries(cfg.items).forEach(([id, it]) => { voices[`${id}.html`] = it.voice || ""; });
        localStorage.setItem("infodose:voices", JSON.stringify(voices));
      }

      log("archetypes.json carregado:", Object.keys(cfg.items).length);
    }).catch(()=>{});

  // 3) Manifest link (in case it's missing)
  if (!document.querySelector('link[rel="manifest"]')) {
    const lk = document.createElement("link");
    lk.rel = "manifest";
    lk.href = "./manifest.webmanifest";
    document.head.appendChild(lk);
  }
})();
