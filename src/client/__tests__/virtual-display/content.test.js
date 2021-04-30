import React from 'react';
import { shallow } from 'enzyme';

import Content from '../../components/pages/virtual-display/content';

describe('Content', () => {
  let props;

  beforeEach(() => {
    jest.useFakeTimers();
    props = {
      details: {
        auditedDate: '2020-11-12 12:58:40',
        confidenceNumber: '000109',
        deviceUId: 'VIR202009201000000109',
        dispScreenId: 'Compliant',
        eventCompletedOnText: 'Checked on',
        eventNextScheduledFor: 'Next Check',
        hdrTxt: 'Compliant',
        imageUri: '5056/virtualDisplayCompliantImage/badge.png',
        nextAuditDate: '2020-11-13 12:58:40',
        templateFooter: 'This is the badge footer text',
        timeZone: 'America/Los_Angeles',
      },
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('renders correctly', () => {
    const wrapper = shallow(<Content {...props} />);
    expect(wrapper.length).toBe(1);
  });
});
