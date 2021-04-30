import React from 'react';
import PropTypes from 'prop-types';
import { useHistory, useParams, Link } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import moment from 'moment-timezone';
import { useActionDispatch } from '../../../hooks';
import { getIOTObject, postIOTObject } from '../../../redux/actions/object';

import Layout from '../../shared/layout';
import { useTitle } from '../../../hooks';
import * as URLS from '../../../urls';
import { getItem } from '../../../utils/storage-utils';
import { DateUtils } from '../../../utils';

const IOT_STORE = 'IOT_STORE';
const GET_HW_DETAILS = 'IOT_STORE';

const ActivateConnected = ({ isNoLoc, type }) => {
  const { t } = useTranslation();
  useTitle(t('ActivateConnected'));
  const history = useHistory();
  const { id } = useParams();

  const [imageUri, setImageUri] = React.useState('');

  const dId = (type === 'display') ? id : getItem(IOT_STORE);
  const isVD = dId.startsWith('VIR');
  const [device, setDevice] = React.useState(false);
  const [activityData, setActivityData] = React.useState(false);
  const getHWDetails = useActionDispatch(getIOTObject(GET_HW_DETAILS, undefined, `devices/${dId}/details`));
  const getHWActivity = useActionDispatch(postIOTObject(GET_HW_DETAILS, 'v2', 'device/jobactivity'));

  const getNumInQuarters = (num) => {
    if (!num || (num && num < 0)) {
      return 0;
    }
    num = parseInt(num);
    if (num > 0 && num <= 25) {
      return 1;
    } else if (num > 25 && num <= 50) {
      return 2;
    } else if (num > 50 && num <= 75) {
      return 3;
    } else {
      return 4;
    }
  };
  const getBatteryNum = (num) => {
    const n = getNumInQuarters(num);
    return n === 4 ? 'full' : n === 3 ? 'three-quarters' : n === 2 ? 'half' : n === 1 ? 'quarter' : 'empty';
  };
  const getSignalNum = (num) => {
    const n = getNumInQuarters(num);
    return n === 4 ? 'alt' : n === 3 ? 'alt-3' : n === 2 ? 'alt-2' : n === 1 ? 'alt-1' : 'slash';
  };

  const getLabelByStatus = () => {
    let str = 'READY';
    if (device?.deviceStatus?.toLocaleLowerCase() === 'connected') {
      str = 'CONNECTED';
    }
    return str;
  };

  React.useEffect(() => {
    getHWDetails().then((data) => {
      setDevice(data);

      if (data.deviceStatus && data.deviceStatus.toLocaleLowerCase() === 'connected') {
        setImageUri('/assets/img/connected_badge.png');
      }

      if (data.deviceStatus && data.deviceStatus.toLocaleLowerCase() === 'registered') {
        setImageUri('/assets/img/registred_badge.png');
        setActivityData({});
      } else {
        getHWActivity({ fwVersion: '01.00.01', deviceId: dId, isVirtual: isVD, state: 'refresh', battVolt: 3.3, rssi: -80 }).then((dataHW = {}) => {
          dataHW.ADFormatted = dataHW.auditedDate && !dataHW.auditedDate.startsWith('00/00') && dataHW.auditedDate.length > 3 && dataHW.timeZone
            ? dataHW.auditedDate + ' ' + moment().tz(dataHW.timeZone).format('zz')
            : '00/00/0000 - 0:00';
          dataHW.NDFormatted = dataHW.nextAuditDate && !dataHW.nextAuditDate.startsWith('00/00') && dataHW.nextAuditDate.length > 3 && dataHW.timeZone
            ? dataHW.nextAuditDate + ' ' + moment().tz(dataHW.timeZone).format('zz')
            : '00/00/0000 - 0:00';
          setActivityData(dataHW);
        });
      }
    });
    window.scrollTo(0, 0);
  }, []);

  React.useEffect(() => {
    if (activityData?.imageUri) {
      setImageUri(`/api/files/template/${activityData?.imageUri?.slice(0,-9)}6`);
    }
  },[activityData]);

  return (
    <Layout>
      <div className="container mt-3 content-wrapper bg-white">
        <div className="row justify-content-center">
          <div className="col-11 col-md-6 text-center">
            <div className="small-badge mb-3 mt-5">
              {activityData && <div className="badge-border" style={{ width: '200px', height: '100%'}}>
                <div className="d-flex flex-column justify-content-between text-center" id="tablet-container">
                  <div className="bg-black">
                    <div className="container p-1">
                      <h2 id="status" className="text-light text-uppercase display-1 mb-0">{activityData.hdrTxt || getLabelByStatus()}</h2>
                    </div>
                  </div>
                  <div className="p-2">
                    <img 
                      id="badge" 
                      src={imageUri}
                      alt="READY"
                      onError={(e)=>{e.target.onerror = null; e.target.src='/assets/img/default_badge.png';}}
                    />
                  </div>
                  <div>
                    <h4 className="font-weight-light mb-1"><Trans>{activityData.eventCompletedOnText  || 'Ready to be activated'}</Trans></h4>
                    <h3 className="p-0 mb-1">{activityData.ADFormatted}</h3>
                    <h5 className="font-weight-light mt-1"><Trans>{activityData.eventNextScheduledFor || 'Ready to be activated'}</Trans></h5>
                    <h5 className="font-weight-light pb-2">{activityData.NDFormatted}</h5>
                  </div>
                  <div className="bg-black align-self-stretch px-1 py-2">
                    <p className="text-light lead mb-1"><Trans>{activityData.templateFooter || 'This badge indicates that this device is Ready to be activated. Once activated, completed events can be viewed at confidence.org'}</Trans></p>
                    <h3 className="text-light">Confidence #: {activityData.confidenceNumber || device.deviceUId?.slice(-6) || 'N/A'}</h3>
                  </div>
                </div>
              </div>}
              {!activityData && <div className="badge-border" style={{ width: '200px', height: '100%'}}>
                <div className="d-flex flex-column justify-content-between text-center" id="tablet-container">
                  <div className="bg-black">
                    <div className="container p-1">
                      <h2 id="status" className="text-light text-uppercase display-1 mb-0">READY</h2>
                    </div>
                  </div>
                  <div className="p-2" style={{height: '92px'}}>
                    <i className="far fa-spinner fa-spin fa-3x" aria-hidden="true"></i>
                  </div>
                  <div>
                    <h4 className="font-weight-light mb-1"><Trans>Ready to be activated</Trans></h4>
                    <h3 className="p-0 mb-1">00/00/0000 @ 0:00</h3>
                    <h5 className="font-weight-light mt-1"><Trans>Ready to be activated</Trans></h5>
                    <h5 className="font-weight-light pb-2">00/00/0000 @ 0:00</h5>
                  </div>
                  <div className="bg-black align-self-stretch px-1 py-2">
                    <p className="text-light lead mb-1"><Trans>This badge indicates that this device is Ready to be activated. Once activated, completed events can be viewed at confidence.org</Trans></p>
                    <h3 className="text-light">Confidence #: N/A</h3>
                  </div>
                </div>
              </div>}
            </div>
            <div className="d-inline-block text-white bg-primary rounded-pill py-1 px-3"><Trans i18nKey="connected" defaults="Connected" /></div>
            <h4 className="text-monospace my-3">{dId}</h4>
          </div>
        </div>

        <hr className="my-0" />
        <div className="row justify-content-center">
          <div className="col-12">
            <div className="row pt-1">
              <div className={`col col-auto ${isVD && 'py-3'}`}>
                <small className="d-block text-secondary">Last updated: {DateUtils.unicodeFormat(new Date(), 'PPpp')}</small>
              </div>
              {!isVD && <div className="col">
                <div className="d-flex align-items-center justify-content-end pr-2 py-2">
                  <i className={`fad fa-signal-${getSignalNum(device.signalStrength)} text-primary`} aria-hidden="true"></i>
                  <small className="mr-1 ml-2 text-secondary">{(parseInt(device.battery) < 0 || !device.battery) ? '0' : parseInt(device.battery)}%</small>
                  <i className={`fad fa-lg fa-battery-${getBatteryNum(device.battery)} text-primary`} aria-hidden="true"></i>
                </div>
              </div>}
            </div>
          </div>
        </div>
        {!isNoLoc && <div className="row justify-content-center pt-3 pb-4 bg-primary text-white border-top border-bottom">
          <div className="col-12">
            <div className="row pt-1">
              <div className="col">
                <h4 className="mt-1">Set up a workspace</h4>
                <p>This device is connected to the Confidence Cloud. Let’s associate it with a Workspace.</p>
                <Button
                  variant="light"
                  onClick={() => history.push(URLS.ACTIVATE('locations'))}
                  className="text-primary">
                    Start <i className="ml-1 fas fa-arrow-right" aria-hidden="true"></i>
                </Button>
              </div>
            </div>
          </div>
        </div>}
        <div className="row justify-content-center pt-3 pb-4 bg-light border-top border-bottom">
          <div className="col-12">
            <div className="row mb-3 pt-1">
              <div className="col">
                <h4 className="mt-1">{!isVD ? 'Badge' : 'Display'}
                  <a className="mt-2 ml-1 text-primary">
                    <small onClick={() => history.push(URLS.ACTIVATE('locations'))}>
                      <i className="far fa-pencil-alt" aria-hidden="true"></i>
                      <span className="sr-only">Edit Device Details</span>
                    </small>
                  </a>
                </h4>
              </div>
            </div>
            <dl className="row mb-0">
              <dt className="col-3"><small className="text-secondary">Template</small></dt>
              <dd className="col-9">{device.referenceTemplateName}</dd>
              <dt className="col-3"><small className="text-secondary">Group</small></dt>
              <dd className="col-9"><Link to={URLS.TASK_DETAILS(device.locationId, device.templateId)}>{device.templateName}</Link></dd>
              <dt className="col-3"><small className="text-secondary">Space</small></dt>
              <dd className="col-9">
                <p className="mb-0"><Link to={URLS.LOCATION(device.locationId)}>{device.locationName}</Link> <span className="small text-secondary">{device.locationDetails}</span></p>
                {device.address && <p className="mb-0"><small>{device?.address?.addressLine1}, {device?.address?.city}, {device?.address?.state}, {device?.address?.country} {device?.address?.zip}</small></p>}
              </dd>
            </dl>
          </div>
        </div>
        <div className="row justify-content-center pt-3 pb-4">
          <div className="col-12">
            <div className="row mb-3 pt-1">
              <div className="col">
                <h4 className="mt-1">Device Details</h4>
              </div>
            </div>
            {!isVD && <dl className="row mb-0">
              <dt className="col-3"><small className="text-secondary">Device</small></dt>
              <dd className="col-9">E-Ink Reader</dd>
              <dt className="col-3"><small className="text-secondary">Model Number</small></dt>
              <dd className="col-9">0920</dd>
              <dt className="col-3"><small className="text-secondary">Serial Number</small></dt>
              <dd className="col-9">{dId}</dd>
              <dt className="col-3"><small className="text-secondary">Year</small></dt>
              <dd className="col-9">2020</dd>
              <dt className="col-3"><small className="text-secondary">Firmware Version</small></dt>
              <dd className="col-9">01.00.01</dd>
            </dl>}
            {isVD && <dl className="row mb-0">
              <dt className="col-3"><small className="text-secondary">Device</small></dt>
              <dd className="col-9">Virtual Smart Display</dd>
              <dt className="col-3"><small className="text-secondary">URL</small></dt>
              <dd className="col-9 small text-break"><a className="text-primary" href={`${window.location.origin}/tablet/virtual/${dId}`}>{`${window.location.origin}/tablet/virtual/${dId}`}</a></dd>
              <dt className="col-3"><small className="text-secondary">Activation Code</small></dt>
              <dd className="col-9">{dId}</dd>
            </dl>}
          </div>
        </div>
      </div>
    </Layout>
  );
};

ActivateConnected.propTypes = {
  isNoLoc: PropTypes.bool,
  type: PropTypes.string,
};
ActivateConnected.defaultProps = {
  isNoLoc: false,
  type: '',
};
ActivateConnected.displayName = 'ActivateConnected';
export default ActivateConnected;
