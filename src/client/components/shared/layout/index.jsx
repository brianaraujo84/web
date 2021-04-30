import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { useActionDispatch } from '../../../hooks';
import { getLocation } from '../../../redux/actions/location';
import { removeToast } from '../../../redux/actions/toasts';
import { checkUserUpgrade, isSubscriptionValid } from '../../../redux/actions/profile';

import Header from './header';
import Footer from './footer';
import HeaderNoLogin from './header-no-login';
import Toast from '../../shared/toast';
import Tooltip from '../../shared/tooltip';

const Layout = ({ children, noheader, blue, breadcrumbs }) => {
  const loggedIn = useSelector(state => state.profile.loggedIn);
  const geolocation = useSelector(state => state.geolocation.location);
  const toasts = useSelector(state => state.toasts.list);
  const getGeoLocation = useActionDispatch(getLocation);
  const deleteToast = useActionDispatch(removeToast);

  const profile = useSelector(state => state.profile.data);
  const checkTeamMigration = useActionDispatch(checkUserUpgrade);
  const isSubscriptionExpired = useActionDispatch(isSubscriptionValid);

  const delToast = (index) => {
    deleteToast(index);
  };

  const checkUserUpgradeInfo = () => {
    if (loggedIn && !profile.isUpgradeCheckCompleted) {
      checkTeamMigration();
      isSubscriptionExpired();
    }
  };

  React.useEffect(() => {
    if (!geolocation) {
      getGeoLocation();
    }
    checkUserUpgradeInfo();
  }, []);

  return (
    <>
      <div className={blue ? 'bg-primary text-light' : ''} style={{ ...(blue && { height: '100vh' }) }}>
        {
          !noheader && (
            !loggedIn ?
              (
                <HeaderNoLogin />
              ) :
              (
                <Header breadcrumbs={breadcrumbs} />
              )
          )
        }
        {children}
        {
          toasts.map(({ message, delay, handlerName, handlerFn }, index) =>
            <Toast
              key={index}
              message={message}
              delay={delay}
              onClose={() => delToast(index)}
              handlerName={handlerName}
              handlerFn={handlerFn}
            />
          )
        }
        {loggedIn && <Tooltip />}
        <Footer />
      </div>
    </>
  );
};

Layout.propTypes = {
  noheader: PropTypes.bool,
  breadcrumbs: PropTypes.array,
  blue: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired
};

Layout.defaultProps = {
  noheader: false,
  blue: false,
};

Layout.displayName = 'Layout';
export default Layout;
