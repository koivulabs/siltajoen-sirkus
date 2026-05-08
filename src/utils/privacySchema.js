// website/src/utils/privacySchema.js
//
// JS-mirror tiedostosta src/utils/privacySchema.ts.
// Tarkoitettu serverless API-funktiolle (api/admin-save.js).
//
// PIDÄ TÄMÄ SYNKRONISSA privacySchema.ts -tiedoston kanssa.

import { z } from "zod";

const sectionSchema = z.object({
  title: z.string().min(1, "Sektion otsikko ei voi olla tyhjä"),
  body: z.string().min(1, "Sektion teksti ei voi olla tyhjä"),
  list: z.array(z.string().min(1)).optional().default([]),
});

export const privacySchema = z.object({
  title: z.string().min(1, "Sivun otsikko ei voi olla tyhjä"),
  sections: z
    .array(sectionSchema)
    .min(1, "Sektioita on oltava vähintään yksi"),
});
