import React from 'react';
import PropTypes from 'prop-types';
import { classnames } from 'react-form-dynamic';

export const InputItem = ({
  first,
  last,
  className,
  initialValue,
  onChange,
  inputRef,
  onBackspace,
}) => {
  const [value, setValue] = React.useState(initialValue);
  const handleKeyDown = (e) => {
    if (e.keyCode === 8 && !value.length) {
      onBackspace();
    }
  };
  const handleChange = ({ target: { value } }) => {
    const v = value[0] || '';
    setValue(v);
    onChange(v);
  };

  const handleFocus = (e) => {
    e.target.select();
  };

  return (
    <>
      <input
        ref={inputRef}
        type="number"
        className={classnames([className, first && 'first', last && 'last', !first && !last && 'mid'])}
        onKeyDown={handleKeyDown}
        onChange={handleChange}
        onFocus={handleFocus}
        value={value}
      />
    </>
  );
};

InputItem.propTypes = {
  first: PropTypes.bool,
  last: PropTypes.bool,
  className: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  initialValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onBackspace: PropTypes.func.isRequired,
  inputRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.any })
  ]),
};
InputItem.defaultProps = {
  first: false,
  last: false,
  className: '',
  initialValue: '',
  inputRef: null,
};
InputItem.displayName = 'InputItem';

export default React.forwardRef((props, ref) => (
  <InputItem inputRef={ref} {...props} />
));
