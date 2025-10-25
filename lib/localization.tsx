import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import { translations, TranslationKey } from '../locales';

type Locale = 'en' | 'hi';

interface LocalizationContextType {
  locale: Locale;
  setLocale: (locale: string) => void;
  t: (key: TranslationKey, options?: { [key: string]: string | number }) => string;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export const LocalizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const savedLocale = localStorage.getItem('locale');
    return (savedLocale === 'en' || savedLocale === 'hi') ? savedLocale : 'en';
  });

  useEffect(() => {
    localStorage.setItem('locale', locale);
  }, [locale]);

  const setLocale = (newLocale: string) => {
    if (newLocale === 'en' || newLocale === 'hi') {
        setLocaleState(newLocale);
    }
  }

  const t = useMemo(() => (key: TranslationKey, options?: { [key: string]: string | number }): string => {
    let text = translations[locale][key] || translations['en'][key] || key;
    if (options) {
      Object.keys(options).forEach(optKey => {
        text = text.replace(`{{${optKey}}}`, String(options[optKey]));
      });
    }
    return text;
  }, [locale]);

  return (
    <LocalizationContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = (): LocalizationContextType => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};