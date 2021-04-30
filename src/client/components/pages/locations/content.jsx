import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
import PropTypes from 'prop-types';
import { Accordion } from 'react-bootstrap';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';

import * as URLS from '../../../urls';
import Header from './header';
import Location from './location';
import LocationWorker from './location-worker';
import Empty from '../home/content';
import ToggleButton from '../location-details/toggle-button.jsx';
import { toggleShortcuts, catchShortcut } from '../../../utils/electron';
import NoMatchingWorkspaces from '../../shared/no-matching-workspaces';

const Content = ({ fetchMore, searchTerm, setSearchTerm }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const locations = useSelector(state => state.locations.items);
  const locationsTotal = useSelector(state => state.locations.total);
  const locationsLoading = useSelector(state => state.locations.inprogress);
  const profile = useSelector(state => state.profile.data);
  const shortcuts = useSelector(state => state.electron.shortcuts);

  const [locationList, setlocationList] = React.useState(locations);
  const [loading, setLoading] = React.useState(true);

  const locationsNumber = locations.length;
  const hasMore = !Number.isInteger(locationsTotal) || locationsTotal > locationsNumber;


  const addNewWorkspace = () => {
    const isSubscriptionActive = profile.subscription && profile.subscription.subscriptionValid;
    if (isSubscriptionActive) {
      history.push(URLS.ADD_LOCATION);
    } else {
      history.push(URLS.SUBSCRIPTION);
    }
  };

  const handleSearchChange = ({ target: { value } }) => {
    setSearchTerm(value);
  };

  const addShortcutListeners = () => {
    catchShortcut(shortcuts.CREATE_WORKSPACE, () => {
      history.push(URLS.ADD_LOCATION);
    });
  };

  const wrapWithTwoItems = (items) => {
    const wrappedItems = [];
    for (let i = 0; i < items.length; i += 2) {
      const l = items[i], l2 = items[i + 1];
      wrappedItems.push({ l, l2 });
    }
    return wrappedItems;
  };

  React.useEffect(() => {
    setlocationList(locations);
  }, [locations]);

  React.useEffect(() => {
    fetchMore();
    setLoading(false);
  }, []);

  React.useEffect(() => {
    toggleShortcuts([shortcuts.CREATE_WORKSPACE], []);
    if (!profile.isWorker) { addShortcutListeners(); }
    return () => {
      if (!profile.isWorker) { toggleShortcuts([], [shortcuts.CREATE_WORKSPACE]); }
    };
  }, [profile]);

  if (!locationsNumber && !locationsLoading && !loading && searchTerm === undefined) {
    return (
      <div className="container pb-4">
        <Empty />
      </div>
    );
  }

  return (
    <div className="">
      <Header />

      <div className="container pt-2">
        <Accordion defaultActiveKey={null}>
          <div className="row justify-content-center pt-3 pb-2 bg-light" id="locations">

            <a className="add-task btn btn-primary rounded-circle text-white position-fixed pt-2" onClick={addNewWorkspace} title={t('Add Space')}>
              <i className="far fa-plus" aria-hidden="true"></i><span className="sr-only"><Trans i18nKey="add" /></span>
            </a>

            <div className="col-12">
              <div className="d-flex pt-1">
                <div className="px-0">
                  <h4 className="mt-1"><Trans i18nKey="workspaces" /> <small className="text-muted">({locationsTotal})</small></h4>
                </div>

                <div className="col px-0 text-right">
                  <ToggleButton eventKey='1' disabled={!locationsNumber}>
                    <i className="fas fa-search" aria-hidden="true"></i>
                    <span className="sr-only">Search</span>
                  </ToggleButton>
                </div>
              </div>
              <Accordion.Collapse eventKey='1' className="row pt-3" id="search">
                <div className="col">
                  <InputGroup>
                    <InputGroup.Prepend>
                      <InputGroup.Text >
                        <i className="fas fa-search" aria-hidden="true" />
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      value={searchTerm}
                      onChange={handleSearchChange}
                      placeholder={t('Search Workspace')}
                      data-target="workspace-search-input"
                    />
                  </InputGroup>
                </div>
              </Accordion.Collapse>
              {(!locationsNumber && !locationsLoading && !loading && searchTerm) ? (<NoMatchingWorkspaces />) : (<div className="pb-4 pt-3">
                <div>
                  <div>
                    <InfiniteScroll
                      dataLength={locationsNumber}
                      next={fetchMore}
                      hasMore={hasMore}
                    >
                      {
                        wrapWithTwoItems(locationList).map(({ l, l2 }, i) => (
                          <div className="d-flex row justify-content-center" key={i}>
                            <div className="col-12 col-lg-6 mb-3 mb-lg-4 d-flex align-items-stretch" key={i}>
                              {l && l.locationUserRole === 'Member' && <LocationWorker location={l} key={l.locationId} index={i} fetchMore={fetchMore} />}
                              {l && l.locationUserRole !== 'Member' && <Location location={l} key={l.locationId} index={i} />}
                            </div>
                            <div className="col-12 col-lg-6 mb-3 mb-lg-4 d-flex align-items-stretch">
                              {l2 && l2.locationUserRole === 'Member' && <LocationWorker location={l2} key={l2.locationId} index={i} fetchMore={fetchMore} />}
                              {l2 && l2.locationUserRole !== 'Member' && <Location location={l2} key={l2.locationId} index={i} />}
                            </div>
                          </div>
                        ))
                      }
                    </InfiniteScroll>
                  </div>
                </div>
              </div>)}
            </div>
          </div>
        </Accordion>
      </div>
    </div>
  );
};


Content.propTypes = {
  fetchMore: PropTypes.func.isRequired,
  searchTerm: PropTypes.string,
  setSearchTerm: PropTypes.func,
};

Content.displayName = 'LocationsContent';
export default Content;
