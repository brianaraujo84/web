import React from 'react';
import PropTypes from 'prop-types';

let fetchTO;

const GooglePlacesAutocomplete = ({
  ac,
  idPrefix,
  inputClassName,
  inputStyle,
  placeholder,
  renderInput,
  required,
  disabled,
  autocompletionRequest,
  debounce,
  onSelect,
  handleChange,
  loader,
  renderSuggestions,
  suggestionsClassNames,
  suggestionsStyles,
  initialValue,
  ts,
}) => {
  const [value, setValue] = React.useState('');
  const [suggestions, setSuggestions] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [activeSuggestion, setActiveSuggestion] = React.useState(null);

  const placesService = React.useMemo(() => new window.google.maps.places.AutocompleteService(), []);

  const autocompletionRequestBuilder = (autocompletionRequest) => {
    const res = { ...autocompletionRequest };
    const google = window.google;

    if (autocompletionRequest.bounds) {
      res.bounds = new google.maps.LatLngBounds(...autocompletionRequest.bounds);
    }

    if (autocompletionRequest.location) {
      res.location = new google.maps.LatLng(autocompletionRequest.location);
    }

    return res;
  };

  const fetchSuggestionsCallback = (value, suggestions) => {
    setLoading(false);
    setSuggestions(suggestions || []);
    if (!suggestions || !suggestions.length) {
      handleChange(value);
    }
  };

  const fetchSuggestions = (value) => {
    if (fetchTO) {
      window.clearTimeout(fetchTO);
    }

    fetchTO = window.setTimeout(() => {
      const autocompletionReq = { ...autocompletionRequest };
      setLoading(true);

      placesService.getPlacePredictions(
        {
          ...autocompletionRequestBuilder(autocompletionReq),
          input: value,
        },
        fetchSuggestionsCallback.bind(null, value),
      );
    }, debounce);
  };

  const changeValue = (value) => {
    setValue(value);

    if (value.length > 0) {
      fetchSuggestions(value);
    } else {
      // setSuggestions([]);
      clearSuggestions();
    }
  };

  const onSuggestionSelect = (suggestion, event = null) => {
    if (event) {
      event.stopPropagation();
    }

    setActiveSuggestion(null);
    setSuggestions([]);
    setValue(suggestion.description);

    onSelect(suggestion);
  };

  const changeActiveSuggestion = (direction) => {
    if (!suggestions.length) {
      return;
    }

    switch (direction) {
      case 1: {
        setActiveSuggestion(
          (suggestion => activeSuggestion === null || activeSuggestion === suggestions.length - 1 ? 0 : suggestion + 1)
        );
        break;
      }
      case -1: {
        setActiveSuggestion(
          (suggestion => !suggestion ? suggestions.length - 1 : suggestion - 1)
        );
        break;
      }
    }
  };

  const clearSuggestions = () => {
    handleChange(value);
    setActiveSuggestion(null);
    setSuggestions([]);
  };

  const handleKeyDown = (event) => {
    switch (event.key) {
      case 'Enter':
        event.preventDefault();
        if (activeSuggestion !== null) {
          onSuggestionSelect(suggestions[activeSuggestion]);
        }
        break;
      case 'ArrowDown':
        changeActiveSuggestion(1);
        break;
      case 'ArrowUp':
        changeActiveSuggestion(-1);
        break;
      case 'Escape':
        clearSuggestions();
        break;
      default:
    }
  };

  const Input = renderInput ? renderInput({
    autoComplete: 'off',
    id: `${idPrefix ? `${idPrefix}-` : ''}react-google-places-autocomplete-input`,
    value,
    onChange: ({ target }) => changeValue(target.value),
    onKeyDown: handleKeyDown,
    type: 'text',
    placeholder,
    required,
    disabled,
  }) :
    (
      <input
        autoComplete={ac}
        className={inputClassName || 'google-places-autocomplete__input'}
        id={`${idPrefix ? `${idPrefix}-` : ''}react-google-places-autocomplete-input`}
        onChange={({ target }) => changeValue(target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        style={inputStyle}
        type="text"
        value={value}
        required={required}
        disabled={disabled}
      />
    );

  const Loader = loader ? loader :
    (
      <div className="google-places-autocomplete__suggestions-container">
        <div className="google-places-autocomplete__suggestions">
          Loading...
        </div>
      </div>
    );

  const Suggestions = !!suggestions.length && (
    renderSuggestions
      ? renderSuggestions(
        activeSuggestion,
        suggestions,
        onSuggestionSelect,
      ) :
      (
        <div
          id={`${idPrefix}-google-places-suggestions-container`}
          className={suggestionsClassNames.container || 'google-places-autocomplete__suggestions-container'}
          style={suggestionsStyles.container}
        >
          {
            suggestions.map((suggestion, index) => (
              <div
                id={`${idPrefix}-google-places-autocomplete-suggestion--${index}`}
                key={suggestion.id || index}
                className={`${suggestionsClassNames.suggestion || 'google-places-autocomplete__suggestion'} ${activeSuggestion === index ? suggestionsClassNames.suggestionActive || 'google-places-autocomplete__suggestion--active' : ''}`}
                style={suggestionsStyles.suggestion}
                onClick={(event) => onSuggestionSelect(suggestion, event)}
                role="presentation"
              >
                {suggestion.description}
              </div>
            ))
          }
        </div>
      )
  );

  const handleClick = (ev) => {
    if (!suggestions.length) {
      return;
    }

    if (!ev.target.id.includes(`${idPrefix}-google-places-autocomplete`)) {
      clearSuggestions();
    }
  };

  React.useEffect(() => {
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue, ts]);

  return (
    <div className="google-places-autocomplete">
      {Input}
      {loading ? Loader : Suggestions}
    </div>
  );
};

GooglePlacesAutocomplete.propTypes = {
  ac: PropTypes.string,
  debounce: PropTypes.number,
  ts: PropTypes.number,
  disabled: PropTypes.bool,
  idPrefix: PropTypes.string,
  initialValue: PropTypes.string,
  inputClassName: PropTypes.string,
  suggestionsClassNames: PropTypes.object,
  suggestionsStyles: PropTypes.object,
  inputStyle: PropTypes.object,
  autocompletionRequest: PropTypes.object,
  loader: PropTypes.node,
  onSelect: PropTypes.func,
  placeholder: PropTypes.string,
  renderInput: PropTypes.func,
  renderSuggestions: PropTypes.func,
  required: PropTypes.bool,
  handleChange: PropTypes.func
};

GooglePlacesAutocomplete.defaultProps = {
  autocompletionRequest: {},
  debounce: 600,
  ts: 0,
  disabled: false,
  idPrefix: '',
  ac: 'off',
  initialValue: '',
  inputClassName: '',
  inputStyle: {},
  loader: null,
  onSelect: () => { },
  placeholder: '',
  renderInput: undefined,
  renderSuggestions: undefined,
  required: false,
  handleChange: () => { },
  suggestionsClassNames: {
    container: '',
    suggestion: '',
    suggestionActive: '',
  },
  suggestionsStyles: {
    container: {},
    suggestion: {},
  },
};

GooglePlacesAutocomplete.displayName = 'GooglePlacesAutocomplete';
export default GooglePlacesAutocomplete;
