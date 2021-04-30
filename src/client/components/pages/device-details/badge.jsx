import React from 'react';
import { Trans } from 'react-i18next';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';

import { DateUtils } from '../../../utils';

const styles = {
  img: {
    marginLeft: '10px',
    width: '140px',
  },
};

function Badge({ details, setLastUpdate }) {
  const [imageUri, setImageUri] = React.useState('');

  React.useEffect(() => {
    if (details && details.imageUri) {
      setImageUri(`/api/files/template/${details.imageUri.slice(0,-9)}6`);
    }
    if (details && details.auditedDate && details.auditedDate.length > 3) {
      setLastUpdate(DateUtils.unicodeFormat(DateUtils.parseISO(details.auditedDate), 'P p') + ' ' + moment().tz(details.timeZone).format('zz'));
    }
  },[details, details?.imageUri]);

  return (
    <div className="d-flex flex-column justify-content-between text-center" id="tablet-container">
      <div className="bg-black">
        <div className="container p-1">
          <h2 id="status" className="text-light text-uppercase display-1 mb-0">{details.hdrTxt || 'READY'}</h2>
        </div>
      </div>
      <div className="p-2">
        <img 
          id="badge" 
          style={styles.img} 
          src={imageUri} 
          alt={details.hdrTxt || ''} 
          onError={(e)=>{e.target.onerror = null; e.target.src='/assets/img/default_badge.png';}} 
        />
      </div>
      <div className="px-1">
        <h4 className="mb-1">
          <Trans>{details.eventCompletedOnText || 'Ready to be activated'}</Trans>
        </h4>
        {details && details.auditedDate && details.auditedDate.length > 3 && details.timeZone ? (
          <h3 className="p-0 mb-1">{DateUtils.unicodeFormat(DateUtils.parseISO(details.auditedDate), 'P p') + ' ' + moment().tz(details.timeZone).format('zz')}</h3>
        ) : (
          <h3 className="p-0 mb-1">00/00/0000 @ 0:00</h3>
        ) }
        <h5 className="mt-1">
          <Trans>{details.eventNextScheduledFor || 'Ready to be activated'}</Trans>
        </h5>
        {details && details.auditedDate && details.nextAuditDate.length > 3 && details.timeZone ? (
          <h5 className="font-weight-light">{DateUtils.unicodeFormat(DateUtils.parseISO(details.nextAuditDate), 'P p') + ' ' + moment().tz(details.timeZone).format('zz')}</h5>
        ) : (
          <h5 className="font-weight-light">00/00/0000 @ 0:00</h5>
        )}
      </div>
      <div className="bg-black align-self-stretch px-1 py-2">
        <p className="text-light lead mb-1">
          <Trans>{details.templateFooter || 'This badge indicates that this device is Ready to be activated. Once activated, completed events can be viewed at confidence.org'}</Trans>
        </p>
        <h3 className="text-light">
          Confidence #: {details.confidenceNumber || 'N/A'}
        </h3>
      </div>
    </div>
  );
}

Badge.propTypes = {
  details: PropTypes.object,
  setLastUpdate: PropTypes.func,
};

Badge.displayName = 'Badge';

export default Badge;
