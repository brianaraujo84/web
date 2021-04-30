import React from 'react';
import { shallow } from 'enzyme';
import ReactRouterDom from 'react-router-dom';
import ReactRedux from 'react-redux';

import Hooks from '../../hooks';
import TemplateSelectionContent from '../../components/pages/template-selection/content';

describe('TemplateSelectionContent', () => {
  let props;
  let state;

  const history = {
    push: jest.fn(),
  };

  beforeEach(() => {
    props = {};

    state = {
      templates: {
        items: [
          { templateId: 1 },
          { templateId: 2 }
        ]
      },
      myTemplates: {
        items: [
          { templateId: 3 },
          { templateId: 4 }
        ]
      },
      newTemplate: {
        data: {},
      }
    };

    global.scrollTo = jest.fn();

    jest.useFakeTimers();
    jest.spyOn(ReactRouterDom, 'useHistory').mockReturnValue(history);

    jest.spyOn(ReactRedux, 'useSelector').mockImplementation((callback) => {
      return callback(state);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('render correctly', () => {
    const wrapper = shallow(<TemplateSelectionContent {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('handleTemplateSelection', () => {
    const event = {
      preventDefault: jest.fn(),
    };

    jest.spyOn(React, 'useMemo').mockReturnValueOnce([[{ templateId: 1 }]]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([2, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([[{ templateId: 1 }], jest.fn()]);
    const wrapper = shallow(<TemplateSelectionContent {...props} />);
    const onClick = wrapper.find('[data-target="template-container-0"]').at(0).invoke('onClick');
    onClick(event);
    expect(event.preventDefault).toHaveBeenCalled();
    expect(history.push).toHaveBeenCalled();
  });

  it('useEffect', () => {
    const getLocation = jest.fn();
    const getTemplates = jest.fn();
    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(getLocation);
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(getTemplates);
    shallow(<TemplateSelectionContent {...props} />);
    expect(getLocation).toHaveBeenCalled();
    expect(getTemplates).toHaveBeenCalled();
  });

  it('useEffect initList', () => {
    const setList = jest.fn();

    jest.spyOn(React, 'useState').mockReturnValueOnce([2, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([[], setList]);
    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());
    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());
    shallow(<TemplateSelectionContent {...props} />);
    expect(setList).toHaveBeenCalled();
  });

  it('useEffect initList with SCREENT_MY', () => {
    const setList = jest.fn();

    jest.spyOn(React, 'useState').mockReturnValueOnce([1, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([[], setList]);
    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());
    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());
    shallow(<TemplateSelectionContent {...props} />);
    expect(setList).toHaveBeenCalled();
  });

  it('handleScreenChange with all templates', () => {
    const setScreen = jest.fn();
    const event = {
      stopPropagation: jest.fn(),
      preventDefault: jest.fn(),
    };

    jest.spyOn(React, 'useState').mockReturnValueOnce([2, setScreen]);
    const wrapper = shallow(<TemplateSelectionContent {...props} />);
    const onClick = wrapper.find('[data-target="all-templates-selection"]').invoke('onClick');
    onClick(event);
    expect(event.stopPropagation).toHaveBeenCalled();
    expect(event.preventDefault).toHaveBeenCalled();
    expect(setScreen).toHaveBeenCalled();
  });

  it('handleScreenChange with my templates', () => {
    const setScreen = jest.fn();
    const event = {
      stopPropagation: jest.fn(),
      preventDefault: jest.fn(),
    };

    jest.spyOn(React, 'useState').mockReturnValueOnce([2, setScreen]);
    const wrapper = shallow(<TemplateSelectionContent {...props} />);
    const onClick = wrapper.find('[data-target="my-templates-selection"]').invoke('onClick');
    onClick(event);
    expect(event.stopPropagation).toHaveBeenCalled();
    expect(event.preventDefault).toHaveBeenCalled();
    expect(setScreen).toHaveBeenCalled();
  });

  it('handleSearchChange', () => {
    const setSearch = jest.fn();
    const event = {
      target: { value: 'search' }
    };

    jest.spyOn(React, 'useState').mockReturnValueOnce([2, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([[], jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce(['', setSearch]);

    const wrapper = shallow(<TemplateSelectionContent {...props} />);
    const onChange = wrapper.find('[data-target="template-search-input"]').invoke('onChange');
    onChange(event);
    expect(setSearch).toHaveBeenCalledWith(event.target.value);
  });

  it('toggle filter', () => {
    const setShowFilters = jest.fn();

    jest.spyOn(React, 'useState').mockReturnValueOnce([2, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([[], jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, setShowFilters]);

    const wrapper = shallow(<TemplateSelectionContent {...props} />);
    const onClick = wrapper.find('[data-target="toggle-filter-btn"]').invoke('onClick');
    onClick();
    expect(setShowFilters).toHaveBeenCalled();
  });
});
