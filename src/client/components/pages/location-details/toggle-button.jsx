import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Button from 'react-bootstrap/Button';
import AccordionContext from 'react-bootstrap/AccordionContext';
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';

const StyledButton = styled(Button)`
  &:not(.active):hover {
    background-color: transparent;
    color: #6c757d;
    border-color: currentColor;
  }
`;

const ToggleButton = ({ children, eventKey, className, disabled }) => {
  const currentEventKey = React.useContext(AccordionContext);
  const expanded = currentEventKey === eventKey;
  const handleToggle = useAccordionToggle(eventKey, () => {});

  return (
    <StyledButton
      variant="outline-secondary"
      type="button"
      className={className}
      onClick={handleToggle}
      disabled={disabled}
      active={expanded}
    >
      {children}
    </StyledButton>
  );
};

ToggleButton.propTypes = {
  children: PropTypes.node.isRequired,
  eventKey: PropTypes.string.isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool
};

ToggleButton.defaultProps = {
  disabled: false,
};

ToggleButton.displayName = 'ToggleButton';
export default ToggleButton;
