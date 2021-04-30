import React from 'react';
import { Link } from 'react-router-dom';
import { Trans } from 'react-i18next';
import { classnames } from 'react-form-dynamic';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';

import * as URLS from '../../../urls';
import { Locales } from '../../../constants';

const LanguageSelection = ({ onContinue }) => {
  const [language, setLanguage] = React.useState('en-US');

  const handleSelect = (value) => () => {
    setLanguage(value);
  };

  return (
    <div>
      <img className="d-block mt-5 mx-auto" src="/assets/img/logo-blue.png" width="80" />
      <h1 className="text-center mb-4 mt-2 "><Trans>Welcome!</Trans></h1>
      <p className="text-center mb-4 font-weight-light">
        <Trans>Select your language preference.</Trans>
      </p>
      <form>
        <div className="form-group">
          <div className="d-flex justify-content-center">
            {Locales.map((locale, index) => (
              <div
                key={locale.value}
                className={
                  classnames([
                    'btn p-2 border rounded',
                    language === locale.value ? 'bg-light border-primary' : 'border-white disabled',
                    index < Locales.length - 1 && 'mr-2',
                  ])
                }
                data-target="language-selection"
                onClick={handleSelect(locale.value)}
              >
                <a className={classnames('language-selector', language === locale.value ? 'text-primary' : 'text-muted')} role="radio">
                  {locale.label}
                </a>
              </div>
            ))}
          </div>
        </div>
        <Button className="mt-4" variant="primary" onClick={() => onContinue(language)} block>
          <Trans>Continue</Trans>
        </Button>
        <p className="text-secondary mt-3 small text-center">
          <Trans>Confidence&trade; provides instant language translation so team communication can be optimized.</Trans>
        </p>
        <hr className="mt-4" />
        <p className="text-center">
          <Link to={URLS.LOGIN}><Trans>Already have an account?</Trans></Link>
        </p>
      </form>
    </div>
  );
};

LanguageSelection.propTypes = {
  onContinue: PropTypes.func.isRequired,
};

LanguageSelection.displayName = 'LanguageSelection';

export default LanguageSelection;
