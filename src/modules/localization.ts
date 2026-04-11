import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enLang from "@/localization/en.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enLang },
  },
  lng: "en",
  fallbackLng: "en",
});

(window as any).i18n = i18n;
export default i18n;
