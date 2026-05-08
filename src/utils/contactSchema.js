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
});
