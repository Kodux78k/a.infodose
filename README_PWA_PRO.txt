HUB-UNO — PWA PRO (a partir do Monolito PRO)
============================================

Como usar (local):
1) Rode um servidor local (HTTPS ou localhost):
   - Python:  python -m http.server 8080
   - Node:    npx serve -p 8080
2) Abra http://localhost:8080/
3) Instale: Menu do navegador → "Instalar aplicativo" (ou A2HS no iOS).

Arquivos incluídos:
- index.html               (Monolito PRO, com SW register + manifest)
- manifest.webmanifest     (nome, ícones, cores)
- sw.js                    (Service Worker — cache + offline)
- /icons/icon-192.png
- /icons/icon-512.png

Precache (CORE do sw.js):
- Por padrão, leva index + manifest + ícones.
- Para garantir offline de páginas/recursos, adicione no array CORE, por exemplo:
  './archetypes/atlas.html',
  './archetypes/nova.html',
  './archetypes/vitalis.html',
  './apps/apps.json',
  [suas libs/patches estáticos]

Dica PRO:
- Sempre mude a string CACHE ao publicar (ex.: 'uno-pro-pwa-v2') para forçar atualização.
- Se um item listado no CORE não existir, o install do SW falha — cheque os caminhos antes de adicionar.
