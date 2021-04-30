import React from 'react';
import { useParams, useHistory, useLocation, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation, Trans } from 'react-i18next';
import { useForm, Input } from 'react-form-dynamic';
import Button from 'react-bootstrap/Button';

import Layout from '../../shared/layout';
import { useActionDispatch, useTitle } from '../../../hooks';
import * as URLS from '../../../urls';

import { login } from '../../../redux/actions/profile';

import PhoneInput from '../../shared/phone-input';
import WelcomeModal from './welcome-modal';

const styles = {
  mainContainer: {
    height: '100vh',
  },
};

const classes = {
  inputPhone: {
    input: 'form-control',
    container: 'input-group mb-3',
  },
  inputEmail: {
    input: 'form-control rounded',
    container: 'input-group mb-3',
  },
  password: {
    input: 'form-control',
  },
  select: {
    select: 'text-secondary form-control custom-select rounded-left',
  },
};

const Login = () => {
  const { t } = useTranslation();
  useTitle(t('Log In'));
  const history = useHistory();
  const { data = {} } = useLocation();
  const { username = '', welcome } = data;

  const [error, setError] = React.useState(false);
  const [disabled, setDisabled] = React.useState(false);

  const doLogin = useActionDispatch(login);
  const loggedIn = useSelector(state => state.profile.loggedIn);
  const { redirect } = useParams();
  const redirectTo = redirect ? decodeURIComponent(redirect) : '/';

  const fields = [
    {
      name: 'username',
      label: t('Email or mobile number'),
      classes: {
        input: 'form-control mb-3',
      },
      validations: [
        {
          rule: 'required',
        }
      ],
      initialValue: username,
    },
    {
      name: 'password',
      label: t('Password'),
      validations: [
        {
          rule: 'required',
        }
      ],
    },
    // {
    //   name: 'countryCode',
    //   initialValue: '+1',
    // },
  ];

  const onSubmit = async (values) => {
    const { username, password } = values;

    const data = {
      username: username,
      // username: isPhone ? `${countryCode}${username}` : username,
      password,
    };

    setError(false);
    try {
      await doLogin(data);
      setDisabled(true);
      window.location.replace(redirectTo);
    } catch (e) {
      setError(e.message);
      formik.handleReset();
    }
  };

  const formik = useForm({ fields, onSubmit });

  // const isPhone = React.useMemo(() => {
  //   if (formik.values.username.match(/^\d+$/)) {
  //     return true;
  //   }
  //   return false;
  // }, [formik.values.username]);

  // const usernamePrepend = (
  //   <div className="input-group-prepend">
  //     <Select
  //       name="countryCode"
  //       inline
  //       formik={formik}
  //       options={countryCodes}
  //       classes={classes.select}
  //       showError={false}
  //       data-target="select-country-code"
  //     />
  //   </div>
  // );

  React.useEffect(() => {
    if (loggedIn) {
      history.push(redirectTo);
      return;
    }
    formik.validateForm();
  }, []);

  return (
    <>
      <Layout noheader>
        <div>
          <div style={styles.mainContainer}>
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-9 col-md-5 col-lg-4">
                  <img className="d-block mt-5 mx-auto" src={'/assets/img/logo-blue.png'} width="80" />
                  <h1 className="text-center mb-4 mt-2"><Trans>Welcome!</Trans></h1>
                  <p className="text-center mb-4 font-weight-light"><Trans>Sign in to your Confidence account.</Trans></p>
                  <form onSubmit={formik.handleSubmit} autoComplete="off">
                    {!!error &&
                      (
                        <div className="error text-danger mb-3" role="alert">
                          <small className="mb-0">
                            <i className="fas fa-exclamation-triangle" aria-hidden="true" /> {error}
                          </small>
                        </div>
                      )
                    }
                    <PhoneInput
                      showError={false}
                      name="username"
                      formik={formik}
                      classes={classes}
                      placeholder={t('Email or mobile number')}
                    />
                    <Input
                      showError={false}
                      type={'password'}
                      classes={classes.password}
                      name="password"
                      formik={formik}
                      placeholder={t('Password')}
                    />
                    <p className="text-right mb-4">
                      <small>
                        <Link to="/forgot-password">
                          Forgot Password?
                        </Link>
                      </small>
                    </p>
                    <Button
                      variant="primary"
                      type="submit"
                      block
                      disabled={!formik.isValid || formik.isSubmitting || disabled}
                    >
                      <Trans>Log In</Trans>
                    </Button>
                    <hr className="mt-4" />
                    <p className="text-center">
                      <Link to={URLS.SIGNUP}><Trans>Don't have an account?</Trans></Link>
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
      {!!welcome && <WelcomeModal />}
    </>
  );
};

Login.displayName = 'Login';
export default Login;
