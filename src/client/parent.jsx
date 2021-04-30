import React from 'react';
import PropTypes from 'prop-types';
import { useLocation, matchPath, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import RecentComments from './components/shared/recent-comments';
import * as URLS from './urls';
import { CommentsContext } from './contexts';
//import ReactGA from 'react-ga';

const STORAGE_KEY_SHOWN_MARKETING = 'shown_m';

const Parent = ({ children }) => {
  const { data: profile, loggedIn } = useSelector(state => state.profile);
  const location = useLocation();
  const history = useHistory();
  const commentsRef = React.useRef();

  const { pathname } = history.location;

  const alreadyShown = window.localStorage.getItem(STORAGE_KEY_SHOWN_MARKETING);
  const [showMarketing, setShowMarketing] = React.useState(!alreadyShown);
  const Marketing = (
    <div className="bg-primary text-light d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <img className="pb-5" src="/assets/img/icons/logo_confidence_white.svg" width="280" />
    </div>
  );

  React.useEffect(() => {
    //ReactGA.initialize(window.GLOBAL_VARIABLES.ga_tracking_id);
    if (showMarketing) {
      window.setTimeout(() => {
        setShowMarketing(false);
        window.localStorage.setItem(STORAGE_KEY_SHOWN_MARKETING, true);
      }, 5000);
    }
  }, []);

  React.useEffect(() => {
    //ReactGA.pageview(location.pathname + location.search);
    //TODO: Experimental will be streamlined in few days after seeing analytics quality.
    setTimeout(() => {
      const match = matchPath(pathname, { path: URLS.LOCATION(':locationId') });
      const locationId = match ? match.params.locationId : undefined;

      if (typeof window !== 'undefined') {

        window.gtag('config', window.GLOBAL_VARIABLES?.ga_tracking_id, {
          user_id: profile.username,
          custom_map: { dimension1: 'user_id' },
        });
        window.gtag('config', window.GLOBAL_VARIABLES?.ga_ua_tracking_id, {
          user_id: profile.username,
          custom_map: { dimension1: 'user_id' },
        });
        window.gtag('set', { 'user_id': profile.username });
  
        window.gtag('send', 'pageview', {
          page_title: document.title,
          page_location: locationId,
          page_path: pathname,
          user_id: profile.username,
        });
      }

    });
  }, [location.pathname]);

  const isRouteOf = (path) => {
    const match = matchPath(pathname, { path, exact: true });
    return match && match.isExact;
  };

  return (
    <>
      <CommentsContext.Provider value={{
        openTaskComments: commentsRef.current?.openTaskComments,
      }}>
        {showMarketing ? Marketing : children}
      </CommentsContext.Provider>
      {
        !isRouteOf(URLS.VIRTUAL_DISPLAY(':deviceId')) && loggedIn && (
          <div className="fixed-bottom d-flex justify-content-end px-2">
            <RecentComments ref={commentsRef} />
          </div>
        )
      }
    </>
  );
};

Parent.displayName = 'Parent';

Parent.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired
};
export default Parent;
