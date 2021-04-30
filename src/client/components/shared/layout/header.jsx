import React from 'react';
import { Link, useHistory, matchPath } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Trans } from 'react-i18next';
import { classnames } from 'react-form-dynamic';
import InfiniteScroll from 'react-infinite-scroll-component';
import PropTypes from 'prop-types';

import * as URLS from '../../../urls';
import { useActionDispatch } from '../../../hooks';
import { logout } from '../../../redux/actions/profile';
import { resetObject, setObject } from '../../../redux/actions/object';
import GroupNav from './group-nav';
import { getPostStandardObjectsList } from '../../../redux/actions/objects';
import Breadcrumbs from '../breadcrumbs';
import useIsMobile from '../../../hooks/is-mobile';

const LOCATION_TYPE = 'locationType';
const OBJECT_DEVICE_LOCATIONS = 'deviceLocations';
const IS_SUB_MENU_EXPANDED = 'isSubMenuExpanded';

const Header = ({ breadcrumbs }) => {
  const { logo } = window.GLOBAL_VARIABLES;

  const [sideOpen, setSideOpen] = React.useState(false);
  const [groupNavOpen, setGroupNavOpen] = React.useState(false);
  const [addingALocation, setAddingALocation] = React.useState(false);
  const [tabType, setTabType] = React.useState('');
  const history = useHistory();
  const profile = useSelector(state => state.profile.data);
  const loc = useSelector(state => state.loc.data);
  const menuState = useSelector(state => state.isSubMenuExpanded.data);

  const newTemplateData = useSelector(state => state.newTemplate?.data);
  const locationType = useSelector(state => state.locationType.data);

  const doLogout = useActionDispatch(logout);
  const resetLocationType = useActionDispatch(resetObject(LOCATION_TYPE));
  const isSubMenuExpanded = useActionDispatch(setObject(IS_SUB_MENU_EXPANDED));
  const getDeviceLocations = useActionDispatch(getPostStandardObjectsList(
    OBJECT_DEVICE_LOCATIONS,
    'locations',
    'v2',
    'locations',
    '',
    10,
    'numberOfLocations'
  ));
  const getTemplates = useActionDispatch(getPostStandardObjectsList('templates', 'templates', undefined, 'marketplace/template'));

  const {
    items: locations,
    total: locationsTotal,
  } = useSelector(state => state.deviceLocations);
  const templatesList = useSelector(state => state.templates.items);

  const locationsNumber = locations.length;
  const hasMore = !Number.isInteger(locationsTotal) || locationsTotal > locationsNumber;
  const locationUserRole = loc?.locationUserRole;
  const {
    username,
    firstName,
    imgThumb,
  } = profile;

  const { pathname } = history.location;

  const handleGroupNavOpen = React.useCallback(() => {
    setGroupNavOpen(!groupNavOpen);
  }, [groupNavOpen]);

  const handleBackClick = () => {
    resetLocationType(LOCATION_TYPE);
    setAddingALocation(false);
  };

  const isRouteOf = (path) => {
    const match = matchPath(pathname, { path, exact: true });
    return match && match.isExact;
  };

  const active = React.useMemo(() => {
    if (pathname === '/' || pathname.match(/^\/home\/?/)) {
      return 'home';
    }
    if (pathname.match(/^\/locations\/?/)) {
      return 'locations';
    }
    if (pathname.match(/^\/marketplace\/?/)) {
      return 'marketplace';
    }
    if (pathname.match(/^\/devices\/?/)) {
      return 'devices';
    }
    return 'unknown';
  }, [pathname]);

  const { Logo } = React.useMemo(() => {
    const ret = {
      Logo: (
        <Link className="navbar-brand" to={URLS.HOME} data-target="header-logo-link"> <img src={logo} height="27" /></Link>
      )
    };
    if (pathname.match(/^\/(location\/)|(location$)|(location-my\/)/)) {
      ret.Logo = (
        <Link className="col w-100 p-0 navbar-brand d-flex align-items-center" to={URLS.LOCATIONS} data-target="header-img-link">
          <i className="far fa-arrow-left text-white mr-1" aria-hidden="true"></i> <Trans i18nKey="workspaces" />
        </Link>
      );
      if (loc.address) {
        ret.address = loc.address.addressLine1;
      }
    }
    if (isRouteOf(URLS.TASK_COMMENTS(':locationId', ':templateId', ':taskId')) && loc.address) {
      const info = loc.locationName;
      ret.Logo = (
        <Link className="col w-100 p-0 navbar-brand d-flex align-items-center" to={URLS.LOCATION(loc.locationId)}>
          <i className="far fa-arrow-left text-white mr-1" aria-hidden="true"></i>  <span className="truncate-1">{info}</span>
        </Link>
      );
      ret.address = null;
    }
    if (isRouteOf(URLS.LOCATION_COMMENTS(':locationId')) && loc.address) {
      const info = loc.locationName;
      ret.Logo = (
        <Link className="col w-100 p-0 navbar-brand d-flex align-items-center" to={URLS.LOCATION(loc.locationId)}>
          <i className="far fa-arrow-left text-white mr-1" aria-hidden="true"></i> <span className="truncate-1">{info}</span>
        </Link>
      );
      ret.address = null;
    }
    if (isRouteOf(URLS.ADD_LOCATION) && addingALocation) {
      ret.Logo = (
        <Link className="col w-100 p-0 navbar-brand d-flex align-items-center" data-target="header-img-link" onClick={handleBackClick}>
          <i className="far fa-arrow-left text-white mr-1" aria-hidden="true"></i> <span className="truncate-1">Add a Workspace</span>
        </Link>
      );
      if (loc.address) {
        ret.address = loc.address.addressLine1;
      }
    }
    if (pathname.match(/^\/marketplace\/products\/.*/)) {
      ret.Logo = (
        <Link className="col w-100 p-0 navbar-brand d-flex align-items-center" to={{
          pathname: URLS.MARKETPLACE,
          state: { screen: history.location.state.screen }
        }} data-target="header-img-link">
          <i className="far fa-arrow-left text-white mr-1" aria-hidden="true"></i> <Trans i18nKey="marketplace" />
        </Link>
      );
      if (loc.address) {
        ret.address = loc.address.addressLine1;
      }
    }
    if (isRouteOf(URLS.LOCATION_CONFIGURE_ZONES(':locationId')) && loc.address) {
      const info = loc.locationName;
      ret.Logo = (
        <Link className="col w-100 p-0 navbar-brand d-flex align-items-center" to={URLS.LOCATION(loc.locationId)}>
          <i className="far fa-arrow-left text-white mr-1" aria-hidden="true"></i> <span className="truncate-1">{info}</span>
        </Link>
      );
      ret.address = null;
    }
    if (isRouteOf(URLS.TASK_TEMPLATES(':locationId')) && loc.address && newTemplateData && newTemplateData.templateName) {
      const address = loc.address.addressLine1;
      ret.Logo = (
        <Link className="col w-100 p-0 navbar-brand d-flex align-items-center" to={{ pathname: URLS.TASK_DETAILS(loc.locationId, newTemplateData.taskTemplateId, newTemplateData.tm), state: { templateType: 'Main' } }}>
          <i className="far fa-arrow-left text-white mr-1" aria-hidden="true"></i>  <span className="truncate-1">{newTemplateData.templateName}</span>
        </Link>
      );
      ret.address = address;
    }
    if (isRouteOf(URLS.TASK_TEMPLATES(':locationId')) && loc.address) {
      const info = loc.locationName;
      ret.Logo = (
        <Link className="col w-100 p-0 navbar-brand d-flex align-items-center" to={URLS.LOCATION(loc.locationId)}>
          <i className="far fa-arrow-left text-white mr-1" aria-hidden="true"></i>  <span className="truncate-1">{info}</span>
        </Link>
      );
      ret.address = null;
    }
    if (isRouteOf(URLS.TASK_TEMPLATES(':locationId', ':templateId')) && loc.locationId && loc.templateId) {
      ret.Logo = (
        <Link className="col w-100 p-0 navbar-brand d-flex align-items-center" to={URLS.TASK_TEMPLATES(loc.locationId)}>
          <i className="far fa-arrow-left text-white mr-1" aria-hidden="true"></i>  <Trans i18nKey="templates" />
        </Link>
      );
      ret.address = null;
    }
    if (isRouteOf(URLS.TASK_TEMPLATE(':locationId', ':templateId')) && loc.locationId) {
      ret.Logo = (
        <Link className="col w-100 p-0 navbar-brand d-flex align-items-center" to={URLS.TASK_TEMPLATES(loc.locationId)}>
          <i className="far fa-arrow-left text-white mr-1" aria-hidden="true"></i> <Trans i18nKey="templates" />
        </Link>
      );
      ret.address = null;
    }
    if (isRouteOf(URLS.NOTIFY_MY_TASK_GRP(':locationId', ':cardType', ':taskId', ':templateId?')) && loc.locationId) {
      ret.Logo = (
        <Link className="col w-100 p-0 navbar-brand d-flex align-items-center" to={URLS.LOCATIONS}>
          <i className="far fa-arrow-left text-white mr-1" aria-hidden="true"></i> <Trans i18nKey="workspaces" />
        </Link>
      );
      ret.address = null;
    }
    if (isRouteOf(URLS.NOTIFY_OWNER_TASK_GRP(':locationId', ':cardType', ':taskId', ':templateId?')) && loc.locationId) {
      ret.Logo = (
        <Link className="col w-100 p-0 navbar-brand d-flex align-items-center" to={URLS.LOCATIONS}>
          <i className="far fa-arrow-left text-white mr-1" aria-hidden="true"></i> <Trans i18nKey="workspaces" />
        </Link>
      );
      ret.address = null;
    }
    if (
      (isRouteOf(URLS.TASK_DETAILS(':locationId', ':taskTemplateId')) || isRouteOf(URLS.TASK_DETAILS(':locationId', ':taskTemplateId', 'tm'))) &&
      loc.locationName
    ) {
      const info = loc.locationName;
      ret.Logo = (
        <Link className="col w-100 p-0 navbar-brand d-flex align-items-center" to={{
          pathname: URLS.LOCATION(loc.locationId),
          state: {
            tabType,
          }
        }}

        >
          <i className="far fa-arrow-left text-white mr-1" aria-hidden="true"></i> <span className="truncate-1">{info}</span>
        </Link>
      );
      ret.address = null;
    }
    if ((isRouteOf(URLS.ADD_DEVICE) || isRouteOf(URLS.DEVICE_DETAILS(':deviceId'))) && loc.locationName) {
      const info = loc.locationName;
      ret.Logo = (
        <Link className="col w-100 p-0 navbar-brand d-flex align-items-center" to={URLS.LOCATION(loc.locationId)}>
          <i className="far fa-arrow-left text-white mr-1" aria-hidden="true"></i> <span className="truncate-1">{info}</span>
        </Link>
      );
      ret.address = null;
    }
    if (isRouteOf(URLS.ACTIVATE(':Step?')) || isRouteOf(URLS.DEVICES_CONNECTED)) {
      ret.Logo = (
        <Link className="col w-100 p-0 navbar-brand d-flex align-items-center" to={URLS.DEVICES}>
          <i className="far fa-arrow-left text-white mr-1" aria-hidden="true"></i> <Trans i18nKey="devices" />
        </Link>
      );
      ret.address = null;
    }
    if (isRouteOf(URLS.DEVICES_LIST(':locationId'))) {
      ret.Logo = (
        <Link className="col w-100 p-0 navbar-brand d-flex align-items-center" to={URLS.DEVICES_CONNECTED}>
          <i className="far fa-arrow-left text-white mr-1" aria-hidden="true"></i> <Trans i18nKey="devices_connected" defaults="Connected Devices" />
        </Link>
      );
      ret.address = null;
    }
    if (isRouteOf(URLS.DEVICE_ACTIVATE(':deviceId')) && loc.locationName) {
      const info = loc.locationName;
      ret.Logo = (
        <Link className="col w-100 p-0 navbar-brand d-flex align-items-center" to={URLS.LOCATION(loc.locationId)}>
          <i className="far fa-arrow-left text-white mr-1" aria-hidden="true"></i> <span className="truncate-1">{info}</span>
        </Link>
      );
      ret.address = null;
    }
    if (isRouteOf(URLS.ACTIVATE(':step', ':id')) && loc.address) {
      const info = loc.locationName;
      ret.Logo = (
        <Link className="col w-100 p-0 navbar-brand d-flex align-items-center" to={URLS.LOCATION(loc.locationId)}>
          <i className="far fa-arrow-left text-white mr-1" aria-hidden="true"></i> <span className="truncate-1">{info}</span>
        </Link>
      );
      ret.address = null;
    }
    return ret;
  }, [pathname, loc, addingALocation]);

  const styles = {
    link: {
      cursor: 'pointer',
    }
  };

  const handleLogout = async () => {
    const data = {
      username,
    };
    await doLogout(data);
    history.push(URLS.LOGIN());
  };

  const handleProfileClick = () => {
    history.push(URLS.ACCOUNT);
  };

  React.useEffect(() => {
    if (locationType.length !== undefined) {
      setAddingALocation(true);
    }
  }, [locationType]);

  React.useEffect(() => {
    if (history && history.location && history.location.state && history.location.state.tabType) {
      setTabType(history.location.state.tabType);
    }
    if (history.location?.state?.GroupNavOpen) {
      setGroupNavOpen(true);
    }
  }, [history]);

  const handleSidebar = React.useCallback(() => {
    setSideOpen(open => !open);
    setGroupNavOpen(false);
  }, []);

  const handleWorkspaceNav = (workspaceId) => {
    isSubMenuExpanded({ workspaceId, isExpanded: true });
    history.push(URLS.LOCATION(workspaceId), { workspaceId });
  };

  const fetchLocations = (firstFetch = false) => {
    getDeviceLocations({ device: true }, undefined, '', '', firstFetch);
  };

  const handleSubMenuClick = () => {
    isSubMenuExpanded({ isExpanded: !menuState.isExpanded });
  };

  React.useMemo(() => {
    if (sideOpen && locations.length === 0) {
      fetchLocations(true);
    }
    if (sideOpen && templatesList.length === 0) {
      getTemplates({ 'templateType': 'Reference' });
    }
  }, [sideOpen]);

  const isMobile = useIsMobile();

  return (
    <div className="fixed-top">
      <nav
        className={classnames(['navbar navbar-dark bg-primary d-flex align-items-center', sideOpen && 'sidenav-open'])}
        data-target="navbar"
      >
        <div className='container p-0 px-sm-3'>
          {Logo}
          <button
            data-target="navbar-toggler"
            className="navbar-toggler"
            type="button"
            aria-controls="side-nav"
            aria-expanded="false"
            aria-label="Toggle navigation"
            onClick={handleSidebar}
          >
            <span className="dark-blue-text"><i className="fas fa-bars fa-1x"></i></span>
          </button>
        </div>
      </nav>

      <nav id="side-nav" className={classnames([sideOpen ? 'open' : 'closed'])}>
        <div id="side-navigation">
          <ul className="navbar-nav mr-auto">
            <li className="text-center border-bottom border-secondary pb-2">
              <img
                onClick={handleProfileClick}
                className="d-block mx-auto profile-pic mt-3 mb-1"
                src={imgThumb}
                data-target="profile-img"
              />
              <Link className='nav-link header-nav-link' to={URLS.ACCOUNT}>
                {firstName}
              </Link>
            </li>
            <li className={active === 'locations' ? 'nav-item d-flex justify-content-between active bg-primary' : 'nav-item d-flex justify-content-between'} data-target="menu-li-locations">
              <Link className="nav-link w-100" to={URLS.LOCATIONS}>
                <Trans i18nKey="workspaces" /> {active && <span className="sr-only">(<Trans>current</Trans>)</span>}
              </Link>
              <a className={menuState.isExpanded ? 'subnav-toggle btn' : 'subnav-toggle btn collapsed'} onClick={handleSubMenuClick}><i className={menuState.isExpanded ? 'fas fa-chevron-up' : 'fas fa-chevron-down'} aria-hidden="true"></i></a>
            </li>
            {menuState.isExpanded && (
              <InfiniteScroll
                height={locationsNumber >= 10 ? 300 : locationsNumber * 35}
                dataLength={locationsNumber}
                next={fetchLocations}
                hasMore={hasMore}
                loader={<div style={{ textAlign: 'center', padding: 20 }}><i className="far fa-spinner fa-spin fa-2x" aria-hidden="true" /></div>}
              >
                <li className='workspaces-nav-list'>
                  <ul className='list-unstyled'>
                    {locations.map((workspace, index) => (
                      <li className={pathname === `/location/${workspace.locationId}/` ? 'nav-item pl-2 active bg-primary' : 'nav-item pl-2'} key={index}>
                        <a className='nav-link pl-4' onClick={() => handleWorkspaceNav(workspace.locationId)}>
                          <span className='truncate-1'>{workspace.locationName}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              </InfiniteScroll>
            )}
            <li className={active === 'marketplace' ? 'nav-item active bg-primary' : 'nav-item'} data-target="menu-li-marketplace">
              <Link className="nav-link" to={URLS.MARKETPLACE}>
                <Trans i18nKey="marketplace" /> {active && <span className="sr-only">(<Trans>current</Trans>)</span>}
              </Link>
            </li>
            {profile.isOwner && !isMobile && !pathname.includes('/templates') && (
              <li className={active === 'devices' ? 'nav-item active bg-primary' : 'nav-item'} data-target="menu-li-templates">
                <Link className="nav-link" to={URLS.TEMPLATES}>
                  <Trans i18nKey="Manage Templates" /> {active && <span className="sr-only">(<Trans>current</Trans>)</span>}
                </Link>
              </li>
            )}
            {profile.isOwner && (
              <li className={active === 'devices' ? 'nav-item active bg-primary' : 'nav-item'} data-target="menu-li-devices">
                <Link className="nav-link" to={URLS.DEVICES}>
                  <Trans i18nKey="devices" /> {active && <span className="sr-only">(<Trans>current</Trans>)</span>}
                </Link>
              </li>
            )}
            <li className="nav-item border-top border-secondary pt-1" data-target="menu-li-logout">
              <a className="nav-link" style={styles.link} onClick={handleLogout} data-target="menu-link-logout">
                <Trans i18nKey="log_out" />
              </a>
            </li>
          </ul>
        </div>
      </nav>
      {breadcrumbs && <Breadcrumbs breadcrumbs={breadcrumbs} />}
      <GroupNav
        open={groupNavOpen}
        onToggle={handleGroupNavOpen}
        locationUserRole={locationUserRole}
      />

      <div
        id="grouplist-overlay"
        className={sideOpen || groupNavOpen ? 'in' : 'fade'}
        onClick={() => setSideOpen(false)}
        data-target="overlay"
      />
    </div>
  );
};

Header.propTypes = {
  breadcrumbs: PropTypes.array,
  isMobile: PropTypes.bool,
};

Header.displayName = 'Header';
export default Header;
