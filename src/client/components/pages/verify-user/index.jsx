import React from 'react';
import { useParams, useHistory } from 'react-router-dom';

import { useActionDispatch } from '../../../hooks';
import { postStandardObject } from '../../../redux/actions/object';

import * as URLS from '../../../urls';


const OBJECT_VALIDATIE = 'validatePasscode';

const VerifyUser = () => {
  const history = useHistory();
  const { userId, verifyCode } = useParams();

  const validateCode = useActionDispatch(postStandardObject(OBJECT_VALIDATIE));

  const onSubmit = async (userName, oneTimePasscode) => {
    const data = {
      oneTimePasscode,
      userName,
      action: 'signup',
    };

    try {
      await validateCode(data);
      history.push({
        pathname: URLS.LOGIN(),
        data: { username: userName, welcome: true }
      });
    } catch (e) {
      history.push(URLS.PAGE_400);
    }
  };

  React.useEffect(() => {
    onSubmit(userId, verifyCode);
  }, []);


  return (
    <div className="content-wrapper">
      <div className="text-center mt-3">
        <i className="far fa-spinner fa-spin fa-3x" aria-hidden="true"></i>
      </div>
    </div>
  );
};

VerifyUser.displayName = 'VerifyUser';
export default VerifyUser;
