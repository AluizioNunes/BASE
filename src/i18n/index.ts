import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      welcome: 'Welcome',
      login: 'Login',
      email: 'Email',
      password: 'Password',
      enter: 'Enter',
      loading: 'Loading...'
    }
  },
  pt: {
    translation: {
      welcome: 'Bem-vindo',
      login: 'Entrar',
      email: 'Email',
      password: 'Senha',
      enter: 'Entrar',
      loading: 'Carregando...'
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'pt',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  }
});

export default i18n; 