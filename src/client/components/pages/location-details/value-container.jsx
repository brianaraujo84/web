import React from 'react';
import PropTypes from 'prop-types';

import { components } from 'react-select';

const ValueContainer = ({ children, getValue, ...props1 }) => {
  var length = getValue().length;
  const allSelected = props1.selectProps.value;

  return (
    <components.ValueContainer {...props1}>
      {!props1.selectProps.inputValue && (length === 1 ? allSelected[0].label : `${length} Item${length !== 1 ? 's' : ''} selected`)}
      {React.Children.map(children, child => {
        return child.type !== components.MultiValue && child.type !== components.Placeholder
          ?
          child
          :
          null;
      })}
    </components.ValueContainer>
  );
};

ValueContainer.propTypes = {
  children: PropTypes.any,
  getValue: PropTypes.any,
  selectProps: PropTypes.any,
  className: PropTypes.any,
  cx: PropTypes.any,
  isMulti: PropTypes.any,
  getStyles: PropTypes.any,
  hasValue: PropTypes.any,
};


ValueContainer.displayName = 'LocationDetailsValueContainer';
export default ValueContainer;


export const Option = props => {
  const { data, isSelected } = props;
  return (components.Option && <components.Option {...props}>
    <div role="option">
      <span className="text">{data.label} {'count' in data ? `(${data.count})` : ''}<small className={`${!isSelected && 'text-muted'}`}> {data.subLabel}</small></span>
      {isSelected && <span className="fa fa-check check-mark p-1" aria-hidden="true"></span>}
    </div>
  </components.Option>);
};

Option.propTypes = {
  data: PropTypes.any,
  isSelected: PropTypes.any,
};
Option.displayName = 'LocationDetailsOption';


export const Option2 = props => {
  const { data, isSelected } = props;
  return (components.Option && <components.Option {...props}>
    <div role="option">
      <span className="text">{data.label} ({data.count})</span>
      {isSelected && <span className="fa fa-check check-mark p-1" aria-hidden="true"></span>}
    </div>
  </components.Option>);
};

Option2.propTypes = {
  data: PropTypes.any,
  isSelected: PropTypes.any,
};
Option2.displayName = 'LocationDetailsOption2';


export const ValueContainer2 = ({ children, getValue, ...props1 }) => {
  var length = getValue().length;
  const allSelected = props1.selectProps.value;

  return (
    <components.ValueContainer {...props1}>
      {!props1.selectProps.inputValue && (length === 0 ? 'All' : length === 1 ? allSelected[0].label : `${length} Item${length !== 1 ? 's' : ''} selected`)}
      {React.Children.map(children, child => {
        return child.type !== components.MultiValue && child.type !== components.Placeholder
          ?
          child
          :
          null;
      })}
    </components.ValueContainer>
  );
};

ValueContainer2.propTypes = {
  children: PropTypes.any,
  getValue: PropTypes.any,
  selectProps: PropTypes.any,
  className: PropTypes.any,
  cx: PropTypes.any,
  isMulti: PropTypes.any,
  getStyles: PropTypes.any,
  hasValue: PropTypes.any,
};

ValueContainer2.displayName = 'LocationDetailsValueContainer2';
