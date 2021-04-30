import React from 'react';
import { Trans } from 'react-i18next';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';

function Content({ details }) {
  const [imageUri, setImageUri] = React.useState('');

  React.useEffect(() => {
    if (details && details.imageUri) {
      setImageUri(`/api/files/template/${details?.imageUri?.slice(0,-9)}6`);
    }
  },[details, details?.imageUri]);

  return (
    <>
      <div className="py-5">
        <img 
          id="badge" 
          className='badgeImage' 
          src={imageUri} 
          alt="yes" 
          onError={(e)=>{e.target.onerror = null; e.target.src='/assets/img/default_badge.png';}} 
        />
      </div>
      <div>
        <h4 id="status" className="eventCompletedOnText font-weight-light mb-1">
          <Trans>{details.eventCompletedOnText  || 'Ready to be activated'}</Trans>
        </h4>
        {details && details.auditedDate && details.auditedDate.length > 3 && details.timeZone ? (
          <h4 id="status" className='auditedDate'>{details.auditedDate + ' ' + moment().tz(details.timeZone).format('zz')}</h4>
        ) : (
          <h4 className='auditedDate'>00/00/0000 @ 0:00</h4>
        )}
        <h4 id="status" className="eventNextScheduledFor font-weight-light mt-4">
          <Trans>{details.eventNextScheduledFor || 'Ready to be activated'}</Trans>
        </h4>
        {details && details.nextAuditDate && details.nextAuditDate.length > 3 && details.timeZone ? (
          <h4 id="status" className='nextAuditDate'>{details.nextAuditDate + ' ' + moment().tz(details.timeZone).format('zz')}</h4>
        ) : (
          <h4 className='nextAuditDate'>00/00/0000 @ 0:00</h4>
        )}
      </div>
      <div className="bg-black align-self-stretch py-4 px-5">
        <div className='footerContainer'>
          <h4 id="status" className="text-light lead templateFooter">
            <Trans>{details?.templateFooter?.replace(/\\n/gm, ' ') || 'This badge indicates that this device is Ready to be activated. Once activated, completed events can be viewed at confidence.org'}</Trans>
          </h4>
          <h4 id="status" className="text-light confidenceNumber">
            Confidence #: {details.confidenceNumber  || 'N/A'}
          </h4>
        </div>
      </div>
    </>
  );
}

Content.propTypes = {
  details: PropTypes.object,
};

Content.displayName = 'SanitizeTabletContent';

export default Content;
