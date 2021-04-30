import React from 'react';
import { shallow } from 'enzyme';
import ReactRedux from 'react-redux';

import TemplatesModal from '../../components/pages/location-details/templates-modal';

describe('LocationDetailsTemplatesModal', () => {
  let props, state;

  beforeEach(() => {
    props = {
      onClose: jest.fn(),
      onUpdate: jest.fn(),
      show: true,
    };
    state = {
      templates: {
        items: [
          {
            templateId: 1,
            templateName: 'Covid 19 Cleanup',
            templateType: 'Main',
          },
          {
            templateId: 2,
            templateName: 'Test Template',
            templateType: 'Main',
          },
        ]
      }
    };

    jest.spyOn(ReactRedux, 'useSelector').mockImplementation((callback) => {
      return callback(state);
    });

    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('renders correctly', () => {
    const wrapper = shallow(<TemplatesModal {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('handleTemplateSelection', async () => {
    const wrapper = shallow(<TemplatesModal {...props} />);
    const handleTemplateSelection = wrapper.find('[data-target="template-container-1"]').invoke('onClick');
    const templateId = 4;
    handleTemplateSelection(templateId);
    expect(wrapper.find('[data-target="template-container-1"]')).toHaveLength(1);
  });

  it('updateSelection', async () => {
    jest.spyOn(React, 'useState').mockReturnValueOnce([1, jest.fn()]);
    const wrapper = shallow(<TemplatesModal {...props} />);
    const updateSelection = wrapper.find('[data-target="update-selection"]').invoke('onClick');
    updateSelection();
    expect(wrapper.find('[data-target="update-selection"]')).toHaveLength(1);
  });

  it('updateSelection without template selected', async () => {
    jest.spyOn(React, 'useState').mockReturnValueOnce([-1, jest.fn()]);
    const wrapper = shallow(<TemplatesModal {...props} />);
    const updateSelection = wrapper.find('[data-target="update-selection"]').invoke('onClick');
    updateSelection();
    expect(wrapper.find('[data-target="update-selection"]')).toHaveLength(1);
  });
});
