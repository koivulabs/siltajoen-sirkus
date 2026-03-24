# Chatbot-integraatio — Siltajoen Sirkus

## Missä chatbot on määritelty

Chatbot-widget upotetaan kaikille sivuille yhden script-tagin kautta:

**Tiedosto:** `src/layouts/BaseLayout.astro` (rivi ~75)

```html
<script
  src="https://rag-chatbot-api-unq6.onrender.com/widget.js"
  data-api="https://rag-chatbot-api-unq6.onrender.com"
  data-bot-id="siltajoen-sirkus"
  defer
></script>
```

## Toimintaperiaate

- `widget.js` haetaan suoraan Render-backendistä
- Widget hakee käynnistyessään konfiguraation (`GET /config/siltajoen-sirkus`)
- Kaikki asetukset (väri, otsikko, welcome-viesti, hakukynnys jne.) määritellään **superadminissa**, ei embed-koodissa
- Botti käyttää RAG-hakua (Qdrant) + OpenAI GPT-4o-mini

## Backend

| Palvelu | URL |
|---|---|
| FastAPI backend | `https://rag-chatbot-api-unq6.onrender.com` |
| Admin (superadmin) | `https://rag-chatbot-api-unq6.onrender.com/superadmin.html` |
| Bot ID | `siltajoen-sirkus` |

Backend on `kunta-rag-chatbot`-repossa (Koodaus/koivulabs/kunta-rag-chatbot).

## Tärkeät huomiot

- Backend pyörii **Render free tier** -tasolla → voi herätä hitaasti (~15s) pitkän tauon jälkeen
- **ÄLÄ** vaihda `src`-osoitetta `koivulabs.com`-domainiin — tiedosto ei sijaitse siellä
- Botin sisältö (tietopankki) hallitaan superadminin kautta, ei tässä repossa

## Muutoshistoria

| Päivä | Muutos |
|---|---|
| 2026-03-24 | Korjattu `src`-URL: `www.koivulabs.com/widget.js` → `rag-chatbot-api-unq6.onrender.com/widget.js` (botti ei latautunut lainkaan) |
