
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default (title) => {
  const { t } = useTranslation();
  useEffect(() => {
    const defaultTitle = t('Confidence');
    document.title = `${title} | ${defaultTitle}`;
    return () => {
      document.title = defaultTitle;
    };
  }, []);
};
