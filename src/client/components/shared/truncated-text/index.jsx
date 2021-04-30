import React from 'react';
import PropTypes from 'prop-types';

const TruncateText = ({ text, length }) => {
  const truncTxt = (text && text.length > length) ? text.substring(0, length) + '...' : text;
  return (<>{truncTxt}</>);
};

TruncateText.propTypes = {
  text: PropTypes.string.isRequired,
  length: PropTypes.number,
};

TruncateText.displayName = 'TruncateText';
export default TruncateText;
