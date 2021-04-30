import React from 'react';
import PropTypes from 'prop-types';
import { classnames } from 'react-form-dynamic';

const ButtonLabel = ({
  state,
  buttonState,
  handleClick,
  stateUnselected,
  children,
}) => {

  const changeState = (st) => {
    handleClick(state === st ? stateUnselected : st);
  };

  return (state === stateUnselected || state === buttonState) && (
    <>
      <label
        className={classnames(['btn btn-block btn-outline-dark mb-3', state === buttonState && 'active'])}
        onClick={() => changeState(buttonState)}
      >
        {children}
      </label>
    </>
  );
};

ButtonLabel.propTypes = {
  state: PropTypes.any.isRequired,
  buttonState: PropTypes.any.isRequired,
  stateUnselected: PropTypes.any,
  handleClick: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired
};

ButtonLabel.defaultProps = {
  stateUnselected: 0,
  handleClick: () => { },
};

ButtonLabel.displayName = 'ButtonLabel';
export default ButtonLabel;
