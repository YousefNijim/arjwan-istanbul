import { useLanguage } from './LanguageContext';
import { translations } from './translations';

export const useTranslation = () => {
  const { lang, dir } = useLanguage();

  const t = (section: keyof typeof translations, key: string): string => {
    const sec = translations[section] as any;
    if (!sec || !sec[key]) return key;
    return sec[key][lang] || sec[key]['en'] || key;
  };

  return { t, lang, dir };
};
