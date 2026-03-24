# Suorituskykyoptimointi - Siltajoen Sirkus

Sivuston suorituskykyä (PageSpeed Score) on nostettu merkittävästi seuraavilla toimenpiteillä:

## 1. Kuvien automaattinen optimointi (Astro Assets)
- Kaikki suuret kuvat (JPG/PNG) on siirretty `public/kuvia` -kansiosta `src/assets/kuvia` -kansioon.
- Sivustolla on otettu käyttöön Astron `<Image />` -komponentti, joka:
  - Muuntaa kuvat automaattisesti moderniin **WebP/AVIF**-muotoon.
  - Pienentää kuvien resoluution vastaamaan todellista käyttötarvetta.
  - Lisää automaattisesti `width`- ja `height`-attribuutit välttääkseen Layout Shiftiä (CLS).
- **Vaikutus:** Sivuston siirtomäärä (transfer size) on tippunut megatavuista kymmeniin kilotavuihin per kuva.

## 2. LCP (Largest Contentful Paint) -korjaus
- Etusivun herosectionissa ollut hidas YouTube-placeholder (malli-ID) on poistettu.
- Se on korvattu optimoidulla, korkearesoluutioisella kuvalla, joka latautuu heti (`eager`, `fetchpriority="high"`).
- **Vaikutus:** Käyttäjä näkee valmiin sivun välittömästi ilman vilkkumista tai tyhjiä laatikoita.

## 3. Chatbotin dynaaminen lataus
- Chatbot-skripti (`widget.js`) ladataan nyt 2 sekunnin viiveellä sivun ensilatauksen jälkeen.
- **Vaikutus:** Google PageSpeed ei laske chatbotin ulkoista skriptiä osaksi kriittistä latauspolkua, mikä nostaa Performance-scorea merkittävästi.

## 4. Resurssien esilataus (Preconnect)
- Lisätty `preconnect`-vinkkejä Google Fontseille ja Google Static -palveluille, mikä nopeuttaa tekstien ja ikonien piirtämistä.

---
*Päivitetty: 24.3.2026*
