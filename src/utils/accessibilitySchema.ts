// website/src/utils/accessibilitySchema.ts
//
// Zod-skeema src/data/accessibility.json -tiedoston validointiin.
// Käytetään server-puolella (api/admin-save.js) varmistamaan ettei admin-SPA
// pääse tallentamaan rikkinäistä saavutettavuusselostetta GitHubiin.
//
// Mirror-tiedosto: src/utils/accessibilitySchema.js — pidä synkassa.

import { z } from "zod";

const sectionSchema = z.object({
  title: z.string().min(1, "Sektion otsikko ei voi olla tyhjä"),
  body: z.string().min(1, "Sektion teksti ei voi olla tyhjä"),
  list: z.array(z.string().min(1)).optional().default([]),
});

export const accessibilitySchema = z.object({
  title: z.string().min(1, "Sivun otsikko ei voi olla tyhjä"),
  intro: z.string().min(1, "Intro-teksti ei voi olla tyhjä"),
  sections: z
    .array(sectionSchema)
    .min(1, "Sektioita on oltava vähintään yksi"),
});

export type Accessibility = z.infer<typeof accessibilitySchema>;
