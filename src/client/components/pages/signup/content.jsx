import React from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useActionDispatch } from '../../../hooks';
import { manageUser } from '../../../redux/actions/profile';

import Form from './form';
import Verification from './verification';
import LanguageSelection from './language-selection';

const STATE_LANGUAGE = 1;
const STATE_FORM = 2;
const STATE_VERIFICATION = 3;

const Content = () => {
  const { t } = useTranslation();

  const [state, setState] = React.useState(STATE_LANGUAGE);
  const [error, setError] = React.useState({});
  const [data, setData] = React.useState({});
  const [language, setLanguage] = React.useState('en-US');
  const { type } = useParams();

  const userType = React.useMemo(() => {
    if (type === 'manager') {
      return 'Manager';
    }
    if (type === 'worker') {
      return 'Worker';
    }
    return 'Owner';
  }, [type]);

  const registerUser = useActionDispatch(manageUser);

  const handleSelectLanguage = (language) => {
    setLanguage(language);
    setState(STATE_FORM);
  };

  const handleSubmitForm = async (formData, img) => {
    setData({ ...formData, img });
    setError(null);
    
    const {
      userName,
      email,
      firstName,
      lastName,
      password,
      pin,
      // state: userType,
      phone: mobilePhone,
    } = formData;
    
    const dataToSend = {
      userName,
      firstName,
      lastName,
      email,
      userType,
      mobilePhone,
      password: password || pin,
      languagePreference: language,
      img,
    };
    try {
      await registerUser(dataToSend);
      setState(STATE_VERIFICATION);
    } catch (e) {
      window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
      setError(e && e.data && e.data.errorCode ? e.data: {errorCode:'-1', message: t('Failed to create user')});
    }
  };

  return (
    <>
      {state === STATE_LANGUAGE ? (
        <div className="col-9 col-md-5 col-lg-4">
          <LanguageSelection onContinue={handleSelectLanguage} />
        </div>
      ) : (
        <div className="col-12 col-md-6">
          {state === STATE_FORM && <Form handleSubmit={handleSubmitForm} error={error} />}
          {state === STATE_VERIFICATION &&
            <Verification
              phone={data.phone}
              username={data.userName}
            />
          }
        </div>
      )}
    </>
  );
};

Content.displayName = 'SignupContent';
export default Content;
