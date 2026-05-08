// website/src/utils/privacySchema.ts
//
// Zod-skeema src/data/privacy.json -tiedoston validointiin.
// Käytetään server-puolella (api/admin-save.js).
//
// Mirror-tiedosto: src/utils/privacySchema.js — pidä synkassa.

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

export type Privacy = z.infer<typeof privacySchema>;
