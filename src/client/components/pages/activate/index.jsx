import React from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useTitle, useActionDispatch } from '../../../hooks';
import { postIOTObject, getIOTObject } from '../../../redux/actions/object';

import ActivateLanding from './activate-landing';
import ActivateScanning from './activate-scanning';
import ActivateQAScanning from './activate-qr-scanning';
import ActivateConnected from './activate-connected';
import ActivateNotConnected from './activate-not-connected';
import ActivateStep1 from './steps/activate-step1';
import ActivateStep2 from './steps/activate-step2';
import ActivateStep3 from './steps/activate-step3';
import ActivateStep4 from './steps/activate-step4';
import ActivateStep5 from './steps/activate-step5';
import ActivateLocations from './steps/activate-locations';
import ActivateGroups from './steps/activate-groups';
import ActivateStep5Error from './steps/activate-step5-error';
import GroupStep1 from './group-steps/group-step1';
import GroupStep2 from './group-steps/group-step2';
import ACT_STEPS from './activate-constants';
import { setItem, getItem } from '../../../utils/storage-utils';

const VALIDATE_IOT = 'validateIOT';
const CONNECT_IOT = 'connectIOT';
const IOT_STORE = 'IOT_STORE';

const Activate = () => {
  const { t } = useTranslation();
  useTitle(t('Activate'));
  const { step } = useParams();
  const [showDeviceFound, setShowDeviceFound] = React.useState(false);
  const dId = getItem(IOT_STORE) || false;
  const [deviceId, setDeviceId] = React.useState(dId === 'false' ? false : dId);

  const activateHW = useActionDispatch(postIOTObject(VALIDATE_IOT, undefined, 'hardware/registration'));
  const connectHW = useActionDispatch(getIOTObject(CONNECT_IOT, undefined, 'device'));

  const activateDevice = async (deviceId) => {
    setDeviceId(deviceId);
    setItem(IOT_STORE, deviceId);
    const data = await activateHW({deviceId: deviceId, deviceType:'hardware'});
    if (!data.errorCode) {
      setShowDeviceFound(true);
    }
    return data;
  };

  const connectDevice = () => {
    const data = connectHW(`${deviceId}/status`);
    return data;
  };

  const setDevice = (deviceId) => {
    setItem(IOT_STORE, deviceId);
  };

  React.useEffect(() => {
    //return () => removeItem(IOT_STORE);
  }, []);

  switch (step) {
    case ACT_STEPS.GRP_STEP_1:
      return <GroupStep1 />;
    case ACT_STEPS.GRP_STEP_2:
      return <GroupStep2 connectDevice={connectDevice}/>;
    case ACT_STEPS.NOT_CONNECTED:
      return <ActivateNotConnected setDevice={setDevice} />;
    case ACT_STEPS.CONNECTED:
      return <ActivateConnected isNoLoc={true}/>;
    case ACT_STEPS.CONNECTING:
      return <ActivateConnected />;
    case ACT_STEPS.DISPLAY:
      return <ActivateConnected isNoLoc={true} type="display"/>;
    case ACT_STEPS.STEP_1:
      return <ActivateStep1 />;
    case ACT_STEPS.STEP_2:
      return <ActivateStep2 />;
    case ACT_STEPS.STEP_3:
      return <ActivateStep3 />;
    case ACT_STEPS.STEP_4:
      return <ActivateStep4 connectDevice={connectDevice}/>;
    case ACT_STEPS.STEP_5:
      return <ActivateStep5 />;
    case ACT_STEPS.LOCATIONS:
      return <ActivateLocations />;
    case ACT_STEPS.LOCATIONS_GROUPS:
      return <ActivateGroups deviceId={dId}/>;
    case ACT_STEPS.STEP_5_ERROR:
      return <ActivateStep5Error />;
    case ACT_STEPS.QR_SCAN:
      return <ActivateQAScanning activateDevice={activateDevice} showDeviceFound={showDeviceFound}/>;
    case ACT_STEPS.SCAN:
      return <ActivateScanning activateDevice={activateDevice} showDeviceFound={showDeviceFound}/>;
    default:
      return <ActivateLanding />;
  }
};

Activate.displayName = 'Activate';
export default Activate;
