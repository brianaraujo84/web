import React from 'react';
import PropTypes from 'prop-types';
import InputItem from './input-item';

import './bootstrap-pincode-input.css';

const PinInput = ({
  onChange,
  inputClassName,
  className,
  length,
  initialValue,
}) => {
  const [values, setValues] = React.useState([]);
  const ElRefs = React.useRef([]);

  const handleItemValueChange = (value, index) => {
    const v = values.slice(0);
    v[index] = value;
    setValues(v);
    onChange(v.join(''));
    if (!!value && index < values.length - 1) {
      ElRefs.current[index + 1].focus();
    }
  };

  const handleBackspace = (index) => {
    if (index > 0) {
      ElRefs.current[index - 1].focus();
    }
  };

  React.useEffect(() => {
    ElRefs.current = ElRefs.current.slice(0, length);

    const v = Array(length).fill('').map((x, i) => initialValue.toString()[i] || '');
    setValues(v);
  }, []);

  return (
    <>
      <div className={className}>
        {
          values.map((v, i) => (
            <InputItem
              ref={el => ElRefs.current[i] = el}
              initialValue={v}
              key={i}
              first={!i}
              last={i === values.length - 1}
              className={inputClassName}
              onChange={v => handleItemValueChange(v, i)}
              onBackspace={() => handleBackspace(i)}
              data-target="input-item"
            />
          ))
        }
      </div>

    </>
  );
};

PinInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  length: PropTypes.number,
  className: PropTypes.string,
  inputClassName: PropTypes.string,
  initialValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
PinInput.defaultProps = {
  length: 4,
  initialValue: '',
  className: 'pincode-input-container',
  inputClassName: 'form-control pincode-input-text',
};
PinInput.displayName = 'PinInput';

export default PinInput;
