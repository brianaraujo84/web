import React from 'react';
import { shallow } from 'enzyme';

import GooglePlacesAutocomplete from '../../../components/shared/geo/google-place-autocomplete';

// const flushPromises = () => new Promise(setImmediate);

describe('GeoAutocomplete', () => {
  let props;

  beforeEach(() => {
    props = {
      idPrefix: 'prefix',
      initialValue: '',
      handleChange: jest.fn(),
    };
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('renders correctly', () => {
    const wrapper = shallow(<GooglePlacesAutocomplete {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('renders correctly default props', () => {
    const p = {};
    const wrapper = shallow(<GooglePlacesAutocomplete {...p} />);
    expect(wrapper.length).toBe(1);
  });

  it('useEffect', () => {
    const setValue = jest.fn();
    let cleanupFunc;
    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => { cleanupFunc = f(); });
    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());
    jest.spyOn(React, 'useState').mockReturnValueOnce(['', setValue]);
    shallow(<GooglePlacesAutocomplete {...props} />);
    cleanupFunc();
    expect(setValue).toHaveBeenCalled();
  });

  it('handleClick', () => {
    const suggestions = [
      {
        id: 1,
        description: 'desc',
      }
    ];
    const setValue = jest.fn();
    const setSuggestions = jest.fn();
    const setActiveSuggestion = jest.fn();
    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());
    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());
    jest.spyOn(React, 'useState').mockReturnValueOnce(['', setValue]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([suggestions, setSuggestions]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, setActiveSuggestion]);
    const getEvent = jest.spyOn(document, 'addEventListener');
    shallow(<GooglePlacesAutocomplete {...props} />);
    const [, handleClick] = getEvent.mock.calls[0];
    expect(setValue).toHaveBeenCalled();
    handleClick({ target: { id: 'some' } });
    expect(props.handleChange).toHaveBeenCalled();
    props.handleChange.mockClear();
    handleClick({ target: { id: 'prefix-google-places-autocomplete' } });
    expect(props.handleChange).not.toHaveBeenCalled();
  });

  it('handleClick no suggestion', () => {
    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());
    const getEvent = jest.spyOn(document, 'addEventListener');
    shallow(<GooglePlacesAutocomplete {...props} />);
    const [, handleClick] = getEvent.mock.calls[0];
    handleClick({ target: { id: 'some' } });
    expect(props.handleChange).not.toHaveBeenCalled();
  });

  it('handleClick default', () => {
    const suggestions = [
      {
        id: 1,
        description: 'desc',
      }
    ];
    const p = {};
    const setValue = jest.fn();
    const setSuggestions = jest.fn();
    const setActiveSuggestion = jest.fn();
    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());
    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());
    jest.spyOn(React, 'useState').mockReturnValueOnce(['', setValue]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([suggestions, setSuggestions]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, setActiveSuggestion]);
    const getEvent = jest.spyOn(document, 'addEventListener');
    shallow(<GooglePlacesAutocomplete {...p} />);
    const [, handleClick] = getEvent.mock.calls[0];
    expect(setValue).toHaveBeenCalled();
    handleClick({ target: { id: 'some' } });
  });

  it('handleKeyDown enter', () => {
    const event = {
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
    };
    const suggestions = [
      {
        id: 1,
        description: 'desc',
      }
    ];
    const setValue = jest.fn();
    const setSuggestions = jest.fn();
    const setActiveSuggestion = jest.fn();
    jest.spyOn(React, 'useState').mockReturnValueOnce(['', setValue]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([suggestions, setSuggestions]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([0, setActiveSuggestion]);
    const wrapper = shallow(<GooglePlacesAutocomplete {...props} />);
    const handleKeyDown = wrapper.find('input').invoke('onKeyDown');
    handleKeyDown({ ...event, key: 'Enter' });
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('handleKeyDown enter no active', () => {
    const event = {
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
    };
    const suggestions = [
      {
        id: 1,
        description: 'desc',
      }
    ];
    const setValue = jest.fn();
    const setSuggestions = jest.fn();
    const setActiveSuggestion = jest.fn();
    jest.spyOn(React, 'useState').mockReturnValueOnce(['', setValue]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([suggestions, setSuggestions]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([null, setActiveSuggestion]);
    const wrapper = shallow(<GooglePlacesAutocomplete {...props} />);
    const handleKeyDown = wrapper.find('input').invoke('onKeyDown');
    handleKeyDown({ ...event, key: 'Enter' });
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('handleKeyDown ArrowDown', () => {
    const event = {
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
    };
    const suggestions = [
      {
        id: 1,
        description: 'desc',
      },
      {
        id: 2,
        description: 'desc',
      },
    ];
    const setValue = jest.fn();
    const setSuggestions = jest.fn();
    const setActiveSuggestion = jest.fn();
    jest.spyOn(React, 'useState').mockReturnValueOnce(['', setValue]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([suggestions, setSuggestions]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([null, setActiveSuggestion]);
    const wrapper = shallow(<GooglePlacesAutocomplete {...props} />);
    const handleKeyDown = wrapper.find('input').invoke('onKeyDown');
    handleKeyDown({ ...event, key: 'ArrowDown' });
    expect(setActiveSuggestion).toHaveBeenCalled();
    setActiveSuggestion.mockClear();
    handleKeyDown({ ...event, key: 'ArrowUp' });
    expect(setActiveSuggestion).toHaveBeenCalled();
    setActiveSuggestion.mockClear();
    handleKeyDown({ ...event, key: 'Escape' });
    expect(props.handleChange).toHaveBeenCalled();
    setActiveSuggestion.mockClear();
    handleKeyDown({ ...event, key: 'b' });
    expect(setActiveSuggestion).not.toHaveBeenCalled();
  });

  it('loader', () => {
    const p = {
      ...props,
      loader: (<div>load</div>),
    };
    const wrapper = shallow(<GooglePlacesAutocomplete {...p} />);
    expect(wrapper.length).toBe(1);
    expect(wrapper.find('.google-places-autocomplete__suggestions-container').length).toBe(0);
  });

  it('renderSuggestions', () => {
    const suggestions = [
      {
        id: 1,
        description: 'desc',
      },
      {
        id: 2,
        description: 'desc',
      },
    ];
    const p = {
      ...props,
      renderSuggestions: jest.fn(),
    };
    jest.spyOn(React, 'useState').mockReturnValueOnce(['', jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([suggestions, jest.fn()]);
    shallow(<GooglePlacesAutocomplete {...p} />);
    expect(p.renderSuggestions).toHaveBeenCalled();
  });

  it('renderSuggestions empty', () => {
    const p = {
      ...props,
      renderSuggestions: jest.fn(),
    };
    shallow(<GooglePlacesAutocomplete {...p} />);
    expect(p.renderSuggestions).not.toHaveBeenCalled();
  });

  it('renderInput', () => {
    const p = {
      ...props,
      renderInput: jest.fn(),
    };
    shallow(<GooglePlacesAutocomplete {...p} />);
    expect(p.renderInput).toHaveBeenCalled();
  });

  it('changeValue', () => {
    const setValue = jest.fn();
    jest.spyOn(React, 'useState').mockReturnValueOnce(['', setValue]);
    const wrapper = shallow(<GooglePlacesAutocomplete {...props} />);
    const onChange = wrapper.find('input').invoke('onChange');

    onChange({ target: { value: 'something' } });
    expect(setValue).toHaveBeenCalledWith('something');
  });

  it('changeValue renderInput', () => {
    const setValue = jest.fn();
    const p = {
      ...props,
      renderInput: jest.fn(),
    };
    jest.spyOn(React, 'useState').mockReturnValueOnce(['', setValue]);
    shallow(<GooglePlacesAutocomplete {...p} />);
    const [{ onChange }] = p.renderInput.mock.calls[0];
    onChange({ target: { value: 'something' } });
    expect(setValue).toHaveBeenCalledWith('something');
  });

  it('changeValue renderInput no prefix', () => {
    const suggestions = [
      {
        id: 1,
        description: 'desc',
      }
    ];
    const setValue = jest.fn();
    const setSuggestions = jest.fn();
    const setActiveSuggestion = jest.fn();
    jest.spyOn(React, 'useState').mockReturnValueOnce(['', setValue]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([suggestions, setSuggestions]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([null, setActiveSuggestion]);
    const p = {
      ...props,
      idPrefix: '',
      renderInput: jest.fn(),
    };
    shallow(<GooglePlacesAutocomplete {...p} />);
    const [{ onChange }] = p.renderInput.mock.calls[0];
    onChange({ target: { value: '' } });
    expect(setValue).toHaveBeenCalledWith('');
  });

  it('onSuggestionSelect click', () => {
    const suggestions = [
      {
        id: 1,
        description: 'desc',
      }
    ];
    const setValue = jest.fn();
    const setSuggestions = jest.fn();
    const setActiveSuggestion = jest.fn();
    jest.spyOn(React, 'useState').mockReturnValueOnce(['', setValue]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([suggestions, setSuggestions]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([null, setActiveSuggestion]);
    const p = {
      ...props,
      renderInput: jest.fn(),
      idPrefix: 'p',
    };
    const wrapper = shallow(<GooglePlacesAutocomplete {...p} />);
    const onClick = wrapper.find('#p-google-places-autocomplete-suggestion--0').invoke('onClick');
    const event = {
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
    };
    onClick(event);
    expect(setActiveSuggestion).toHaveBeenCalled();
  });

  it('fetchSuggestions', () => {
    const p = {
      ...props,
      autocompletionRequest: {
        bounds: [],
        location: {},
      },
    };
    const setValue = jest.fn();
    const setSuggestions = jest.fn();
    const setLoading = jest.fn();
    const setActiveSuggestion = jest.fn();
    jest.spyOn(React, 'useState').mockReturnValueOnce(['', setValue]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([[], setSuggestions]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, setLoading]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([null, setActiveSuggestion]);
    jest.spyOn(React, 'useMemo').mockReturnValueOnce({
      getPlacePredictions: jest.fn(),
    });
    const wrapper = shallow(<GooglePlacesAutocomplete {...p} />);
    const onChange = wrapper.find('input').invoke('onChange');

    onChange({ target: { value: 'something' } });
    expect(setValue).toHaveBeenCalledWith('something');
    onChange({ target: { value: 'something else' } });
    expect(setValue).toHaveBeenCalledWith('something else');
    jest.runAllTimers();
    expect(setLoading).toHaveBeenCalled();
  });

  it('fetchSuggestions no bonds and locations', () => {
    const p = {
      ...props,
    };
    const setValue = jest.fn();
    const setSuggestions = jest.fn();
    const setLoading = jest.fn();
    const setActiveSuggestion = jest.fn();
    jest.spyOn(React, 'useState').mockReturnValueOnce(['', setValue]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([[], setSuggestions]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, setLoading]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([null, setActiveSuggestion]);
    jest.spyOn(React, 'useMemo').mockReturnValueOnce({
      getPlacePredictions: jest.fn(),
    });
    const wrapper = shallow(<GooglePlacesAutocomplete {...p} />);
    const onChange = wrapper.find('input').invoke('onChange');

    onChange({ target: { value: 'something' } });
    expect(setValue).toHaveBeenCalledWith('something');
    onChange({ target: { value: 'something else' } });
    expect(setValue).toHaveBeenCalledWith('something else');
    jest.runAllTimers();
    expect(setLoading).toHaveBeenCalled();
  });

  it('changeActiveSuggestion', () => {
    const event = {
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
    };
    const suggestions = [
      {
        id: 1,
        description: 'desc',
      },
      {
        id: 2,
        description: 'desc',
      },
    ];
    const setValue = jest.fn();
    const setSuggestions = jest.fn();
    const setActiveSuggestion = jest.fn();
    jest.spyOn(React, 'useState').mockReturnValueOnce(['', setValue]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([suggestions, setSuggestions]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([0, setActiveSuggestion]);
    const wrapper = shallow(<GooglePlacesAutocomplete {...props} />);
    const handleKeyDown = wrapper.find('input').invoke('onKeyDown');
    handleKeyDown({ ...event, key: 'ArrowDown' });
    expect(setActiveSuggestion).toHaveBeenCalled();
    const [callbackDown] = setActiveSuggestion.mock.calls[0];
    expect(callbackDown(1)).toBe(2);
    expect(callbackDown(0)).toBe(1);
    setActiveSuggestion.mockClear();
    handleKeyDown({ ...event, key: 'ArrowUp' });
    expect(setActiveSuggestion).toHaveBeenCalled();
    const [callbackUp] = setActiveSuggestion.mock.calls[0];
    expect(callbackUp()).toBe(1);
    expect(callbackUp(1)).toBe(0);
  });

  it('changeActiveSuggestion no active', () => {
    const event = {
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
    };
    const suggestions = [
      {
        id: 1,
        description: 'desc',
      },
      {
        id: 2,
        description: 'desc',
      },
    ];
    const setValue = jest.fn();
    const setSuggestions = jest.fn();
    const setActiveSuggestion = jest.fn();
    jest.spyOn(React, 'useState').mockReturnValueOnce(['', setValue]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([suggestions, setSuggestions]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([null, setActiveSuggestion]);
    const wrapper = shallow(<GooglePlacesAutocomplete {...props} />);
    const handleKeyDown = wrapper.find('input').invoke('onKeyDown');
    handleKeyDown({ ...event, key: 'ArrowDown' });
    expect(setActiveSuggestion).toHaveBeenCalled();
    const [callbackDown] = setActiveSuggestion.mock.calls[0];
    expect(callbackDown(1)).toBe(0);
  });

  it('changeActiveSuggestion empty', () => {
    const event = {
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
    };
    const suggestions = [];
    const setValue = jest.fn();
    const setSuggestions = jest.fn();
    const setActiveSuggestion = jest.fn();
    jest.spyOn(React, 'useState').mockReturnValueOnce(['', setValue]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([suggestions, setSuggestions]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([null, setActiveSuggestion]);
    const wrapper = shallow(<GooglePlacesAutocomplete {...props} />);
    const handleKeyDown = wrapper.find('input').invoke('onKeyDown');
    handleKeyDown({ ...event, key: 'ArrowDown' });
    expect(setActiveSuggestion).not.toHaveBeenCalled();
    setActiveSuggestion.mockClear();
    handleKeyDown({ ...event, key: 'ArrowUp' });
    expect(setActiveSuggestion).not.toHaveBeenCalled();
    setActiveSuggestion.mockClear();
  });

  it('fetchSuggestionsCallback', () => {
    const p = {
      ...props,
    };
    const setValue = jest.fn();
    const setSuggestions = jest.fn();
    const setLoading = jest.fn();
    const setActiveSuggestion = jest.fn();
    const getPlacePredictions = jest.fn();
    jest.spyOn(React, 'useState').mockReturnValueOnce(['', setValue]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([[], setSuggestions]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, setLoading]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([null, setActiveSuggestion]);
    jest.spyOn(React, 'useMemo').mockReturnValueOnce({ getPlacePredictions });
    const wrapper = shallow(<GooglePlacesAutocomplete {...p} />);
    const onChange = wrapper.find('input').invoke('onChange');

    onChange({ target: { value: 'something' } });
    expect(setValue).toHaveBeenCalledWith('something');
    onChange({ target: { value: 'something else' } });
    expect(setValue).toHaveBeenCalledWith('something else');
    jest.runAllTimers();
    expect(setLoading).toHaveBeenCalled();
    expect(getPlacePredictions).toHaveBeenCalled();
    const [, callback] = getPlacePredictions.mock.calls[0];
    callback();
    expect(setSuggestions).toHaveBeenCalledWith([]);
    callback([{}]);
    expect(setSuggestions).toHaveBeenCalledWith([{}]);
  });
});
