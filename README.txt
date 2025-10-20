HUB UNO — Starter (config + PWA)

1) Pastas
   /config/archetypes.json
   /config/apps.json
   /core/config-loader.js
   /sw.js
   /manifest.webmanifest
   /icons/icon-192.png   (adicione seus ícones)
   /icons/icon-512.png

2) No seu index.html (HEAD), garanta:
   <link rel="manifest" href="./manifest.webmanifest" />

3) Antes dos seus scripts finais, inclua:
   <script defer src="./core/config-loader.js"></script>

   • Isso vai:
     - Ler /config/apps.json e popular a tela "Apps"
     - Ler /config/archetypes.json, reconstruir o <select id="arch-select">
       e atualizar o overlay usando applyArchOverlay/ARCH_OVERLAYS_PATCHED
     - Manter compatível com seu APPS_JSON embutido (fallback)

4) Service Worker
   • Se já existe registro de ./sw.js no seu index, mantenha.
   • Este SW usa cache-first para os arquivos do núcleo e dá suporte a SKIP_WAITING.

5) Dica
   • Para adicionar/editar rapidamente um app: edite /config/apps.json.
   • Para trocar cores/vozes/ações dos arquétipos: edite /config/archetypes.json.
