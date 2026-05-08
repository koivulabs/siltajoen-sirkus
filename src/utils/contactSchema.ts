// website/src/utils/contactSchema.ts
//
// Zod-skeema src/data/contact.json -tiedoston validointiin.
// Käytetään ensisijaisesti server-puolella (api/admin-save.js) varmistamaan
// ettei admin-SPA pääse committaamaan rikkinäistä contact.jsonia GitHubiin.
//
// Mirror-tiedosto: src/utils/contactSchema.js (sama logiikka JS-muodossa,
// jota Vercel-serverless-function `admin-save.js` voi importata suoraan).
// Pidä molemmat synkronoituina, jos kenttiä muutetaan.

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
});

export type Contact = z.infer<typeof contactSchema>;
