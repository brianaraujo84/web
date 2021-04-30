import React from 'react';
import { useSelector } from 'react-redux';

import { phoneFormat } from '../../../utils';

const Header = () => {
  const profile = useSelector(state => state.profile.data);

  const {
    firstName,
    lastName,
    phone,
    imgThumb,
  } = profile;

  return (
    <>
      <div className="row justify-content-center">
        <div className="col-12 col-md-6">
          <img className="d-block mt-4 mx-auto profile-pic profile-pic-lg" src={imgThumb} />
          <h1 className="text-center mb-1 mt-2">
            {firstName}
            {!!lastName && ` ${lastName.substring(0, 1)}.`}
          </h1>
          <p className="text-center">{phoneFormat(phone)}</p>
        </div>
      </div>
    </>
  );
};
Header.displayName = 'Header';
export default Header;
