// website/src/utils/contactSchema.js
//
// JS-mirror tiedostosta src/utils/contactSchema.ts.
// Tarkoitettu serverless API-funktiolle (api/admin-save.js), joka ajetaan
// Vercelillä Node.js:llä eikä käännä TS-tiedostoja `api/`-polkujen ulkopuolelta.
//
// PIDÄ TÄMÄ SYNKRONISSA contactSchema.ts -tiedoston kanssa.

import { z } from "zod";

export const contactSchema = z.object({
  street: z.string().min(1, "Katuosoite on pakollinen"),
  city: z.string().min(1, "Kaupunki / postinumero on pakollinen"),
  email1: z.string().email("Sähköposti 1 ei ole validi"),
  email2: z
    .string()
    .email("Sähköposti 2 ei ole validi")
    .or(z.literal(""))
    .optional(),
  phone: z
    .string()
    .regex(
      /^\+?[0-9 ]{7,20}$/,
      "Puhelinnumeron muoto ei kelpaa (vain numeroita, välilyöntejä ja valinnainen +)"
    ),
  heroImage: z.string().optional(),
  heroFocalX: z.number().min(0).max(100).optional(),
  heroFocalY: z.number().min(0).max(100).optional(),
  page: z
    .object({
      heroTagline: z.string().min(1, "Hero-tagline ei voi olla tyhjä"),
      heroTitle: z.string().min(1, "Hero-otsikko ei voi olla tyhjä"),
      heroBody: z.string().min(1, "Hero-teksti ei voi olla tyhjä"),
      ctaTitle: z.string().min(1, "CTA-otsikko ei voi olla tyhjä"),
      ctaBody: z.string().min(1, "CTA-teksti ei voi olla tyhjä"),
      ctaCallButton: z.string().min(1, "Soita-napin teksti ei voi olla tyhjä"),
      ctaEmailButton: z.string().min(1, "Sähköposti-napin teksti ei voi olla tyhjä"),
      faqTitle: z.string().min(1, "FAQ-otsikko ei voi olla tyhjä"),
      faqs: z.array(
        z.object({
          question: z.string().min(1, "FAQ-kysymys ei voi olla tyhjä"),
          answer: z.string().min(1, "FAQ-vastaus ei voi olla tyhjä"),
        })
      ),
      mapTitle: z.string().min(1, "Karttaosion otsikko ei voi olla tyhjä"),
      mapBody: z.string().min(1, "Karttaosion teksti ei voi olla tyhjä"),
    }),
});
