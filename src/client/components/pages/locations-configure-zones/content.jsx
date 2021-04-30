import React from 'react';
import PropTypes from 'prop-types';
import { Trans, useTranslation } from 'react-i18next';
import { useParams, useHistory } from 'react-router-dom';
import { SortableContainer, SortableElement, sortableHandle } from 'react-sortable-hoc';
import { useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';

import { useActionDispatch } from '../../../hooks';
import { addToast } from '../../../redux/actions/toasts';
import { getStandardObjectsList, postStandardObjectsList, resetList } from '../../../redux/actions/objects';
import * as URLS from '../../../urls';
import { locationTypes, locationImageURLs } from '../../../constants';

import Zone from './zone';
import EditZoneModal from './edit-zone-modal';

let newCount = 0;

const OBJECT_LOСATION_ZONES = 'locationZones';
const ZONE_SAVE = 'save';
const ZONE_ADD = 'add';
const ZONE_DELETE = 'delete';
const ZONE_SORT = 'sort';

const Content = ({ isFirstTime, locationType }) => {
  const { t } = useTranslation();
  const history = useHistory();

  const [zones, setZones] = React.useState([]);
  const [zonesToDelete, setZonesToDelete] = React.useState([]);
  const [scheduleUpdate, setScheduleUpdate] = React.useState(false);
  const [addModal, setAddModal] = React.useState(false);
  const [isFirstLanding, setIsFirstLanding] = React.useState(isFirstTime);
  const [shouldTaskAdd, setShouldTaskAdd] = React.useState(false);
  const [showTip, setShowTip] = React.useState(true);

  const { locationId } = useParams();
  const getLocationZones = useActionDispatch(getStandardObjectsList(OBJECT_LOСATION_ZONES, 'zones', undefined, 'location', '/configuration'));
  const updateLocationZones = useActionDispatch(postStandardObjectsList(OBJECT_LOСATION_ZONES, undefined, undefined, 'location', '/configuration'));
  const resetZones = useActionDispatch(resetList(OBJECT_LOСATION_ZONES));
  const toast = useActionDispatch(addToast);
  const profile = useSelector(state => state.profile.data);

  const zoneTypesList = useSelector(state => state.zoneTypes.items);
  const locationZones = useSelector(state => state.locationZones.items);

  const locationZonesData = useSelector(state => state.locationZones);
  const zoneTypesData = useSelector(state => state.zoneTypes);

  const zoneTypes = React.useMemo(() => {
    return zoneTypesList.map((t) => ({ value: t.zoneType, label: t.zoneType }));
  }, [zoneTypesList]);

  const defaultZoneType = React.useMemo(() => {
    return zoneTypesList.find((t) => t.default);
  }, [zoneTypesList]);

  const handleSave = async () => {
    const data = {
      userName: profile.username,
    };

    data.zones = [...zones.map((z, i) => {
      const zone = {};
      if (!z.new) {
        zone.id = z.id;
      }
      zone.type = z.type;
      zone.label = z.label;
      zone.sequenceOrder = i + 1;
      return zone;
    }),
    ...zonesToDelete,
    ];

    try {
      await updateLocationZones(data, locationId);
      await getLocationZones(locationId);
    } catch (e) {
      history.push(URLS.PAGE_400);
    }
  };

  const handleAdd = ({ type, label }) => {
    setZones(zones => [
      ...zones,
      {
        type: type,
        label: label,
        id: `new-${newCount++}`,
        new: true,
      }
    ]);

    setShouldTaskAdd(false);
    setAddModal(false);
    setScheduleUpdate(ZONE_ADD);
  };

  const handleRemove = (index) => {
    const zone = zones[index];
    if (!zone.new) {
      setZonesToDelete(zonesToDelete => {
        zonesToDelete.push({
          id: zone.id,
          type: zone.type,
          action: 'delete',
        });
        return zonesToDelete;
      });
    }

    setZones(zones => {
      const z = [...zones];
      z.splice(index, 1);
      return z;
    });
    setScheduleUpdate(ZONE_DELETE);
  };

  const handleUpdate = (zone, index) => {
    setZones(zones => {
      const z = [...zones];
      z[index] = zone;
      return z;
    });
    setZonesToDelete([]);
    setScheduleUpdate(ZONE_SAVE);
  };

  const handleGoToLocationDetails = () => {
    history.push({ pathname: URLS.LOCATION(locationId), data: { isFirstTime: true } });
  };

  const updateZones = async (type) => {
    const msg = type === ZONE_DELETE
      ? t('Zone deleted.')
      : type === ZONE_ADD
        ? t('Zone added.')
        : t('All changes saved.');
    await handleSave();
    toast(msg);
  };

  const onSortEnd = ({ oldIndex, newIndex }) => {
    if (oldIndex !== newIndex) {
      const z = [...zones];
      z.splice(newIndex, 0, z.splice(oldIndex, 1)[0]);
      setZones(z);
      setScheduleUpdate(ZONE_SORT);
    }
  };

  const SortableItem = SortableElement(({ children }) => children);
  const DragHandle = sortableHandle(({ children }) => <div>{children}</div>);
  const SortableList = SortableContainer(({ items }) => {
    return (
      <div>
        {items.map((z, i) => (
          <SortableItem key={`item-${z.id}`} index={i}>
            <Zone
              key={i}
              index={i + 1}
              zone={z}
              zonesCount={items.length}
              onRemove={() => handleRemove(i)}
              onUpdate={(zone) => handleUpdate(zone, i)}
              zoneTypes={zoneTypes}
              DragHandle={DragHandle}
            />
          </SortableItem>
        ))}
      </div>
    );
  });

  const getZones = async () => {
    if (zoneTypesData.inprogress === false && locationZonesData.inprogress === false) {
      await getLocationZones(locationId);
    }
    if (isFirstLanding) {
      setTimeout(() => setShouldTaskAdd(true), 100);
    }
  };

  React.useMemo(() => {
    if (locationId && locationZones.length === 0) {
      getZones();
    }
    return resetZones;
  }, [locationId]);

  React.useEffect(() => {
    if (shouldTaskAdd && defaultZoneType) {
      handleAdd({ type: defaultZoneType.zoneType });
    }
  }, [shouldTaskAdd, defaultZoneType]);

  React.useEffect(() => {
    const clonedLocationZones = locationZones.slice(0);
    setZones(clonedLocationZones.sort((a, b) => a.sequenceOrder - b.sequenceOrder));
  }, [locationZones]);

  React.useEffect(() => {
    if (scheduleUpdate === ZONE_SAVE || scheduleUpdate === ZONE_DELETE ||
      scheduleUpdate === ZONE_ADD || scheduleUpdate === ZONE_SORT) {
      updateZones(scheduleUpdate);
      setScheduleUpdate(false);
    }
  }, [zones, scheduleUpdate]);

  return (
    <>
      <div className="row mb-1">
        {
          showTip && (
            <div className="col-12">
              <div className="alert alert-success alert-dismissible" role="alert">
                <button
                  type="button"
                  className="close"
                  data-target="close-button"
                  aria-label={t('Close')}
                  onClick={() => setShowTip(false)}
                >
                  <span aria-hidden="true">×</span>
                </button>
                <p className="mb-0">
                  <Trans i18nKey="zone_add_text" />
                </p>
              </div>
            </div>
          )
        }
        <div className="col-10">
          <h3 className="mb-2">
            <Trans i18nKey="zones" />
          </h3>
          <p className="lead mb-1">
            <Trans i18nKey="zone_for_space" />
          </p>
        </div>
        <div className="col-2 text-right">
          <button
            className="btn btn-primary text-white"
            role="button" 
            title={t('add_zone')}
            data-target="add-zone"
            onClick={() => setAddModal(true)}
          >
            <i className="fas fa-plus" aria-hidden="true"></i>
            <span className="sr-only"><Trans i18nKey="add_zone" /></span>
          </button>
        </div>
        <div className="col-12">
          <p className="text-secondary font-weight-light">
            <Trans i18nKey="rearrng_zones" />
          </p>
        </div>
        {isFirstLanding &&
          <div className="alert alert-success" role="alert">
            <button 
              type="button" 
              className="close" 
              data-dismiss="alert" 
              aria-label={t('Close')}
              onClick={() => setIsFirstLanding(false)}
            >
              <span aria-hidden="true">×</span>
            </button>
            <p>
              <Trans i18key="zones_org_tasks" />
            </p>
            <p className="mb-3">
              <img
                src={locationImageURLs[locationType] || locationImageURLs[locationTypes.HOME]}
                className="w-100"
                alt="floor plan image of an apartment"
              />
            </p>
            <p className="mb-0">
              <Trans i18nKey="default_zone_added" />
            </p>
          </div>
        }
      </div>

      <div className="list-group bg-primary rounded ui-sortable">
        <SortableList items={zones} onSortEnd={onSortEnd} useDragHandle data-target="sortable-list" />
      </div>

      {isFirstLanding &&
        <Button
          className="mt-3"
          variant="primary"
          data-target="save-btn"
          onClick={handleGoToLocationDetails}
          block
        >
          <Trans i18key="save" />
        </Button>
      }

      {addModal && (
        <EditZoneModal
          show
          onClose={() => setAddModal(false)}
          onUpdate={handleAdd}
          zone={{}}
          zoneTypes={zoneTypes}
        />
      )}

    </>
  );
};

Content.propTypes = {
  isFirstTime: PropTypes.bool,
  locationType: PropTypes.string,
};

Content.displayName = 'LocationsConfigureZonesContent';
export default Content;
