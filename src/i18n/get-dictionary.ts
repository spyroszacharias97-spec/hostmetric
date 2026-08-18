import type { Locale } from "./config";

const dictionaries = {
  el: () =>
    import("./dictionaries/el.json").then(
      (module) => module.default
    ),

  en: () =>
    import("./dictionaries/en.json").then(
      (module) => module.default
    ),

  de: () =>
    import("./dictionaries/de.json").then(
      (module) => module.default
    ),

  fr: () =>
    import("./dictionaries/fr.json").then(
      (module) => module.default
    ),

  it: () =>
    import("./dictionaries/it.json").then(
      (module) => module.default
    ),

  es: () =>
    import("./dictionaries/es.json").then(
      (module) => module.default
    ),

  pt: () =>
    import("./dictionaries/pt.json").then(
      (module) => module.default
    ),

  bg: () =>
    import("./dictionaries/bg.json").then(
      (module) => module.default
    ),

  sr: () =>
    import("./dictionaries/sr.json").then(
      (module) => module.default
    ),

  tr: () =>
    import("./dictionaries/tr.json").then(
      (module) => module.default
    ),
};

export const getDictionary = async (
  locale: Locale
) => dictionaries[locale]();