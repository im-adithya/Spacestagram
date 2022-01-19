import React from 'react';
import { useHistory } from 'react-router-dom';
import { Image } from 'react-bootstrap';

import notfound from '../assets/404.svg';

const NotFound = () => {
  const history = useHistory();
  return (
    <div
      className="position-fixed d-flex justify-content-center align-items-center"
      style={{ width: '100vw' }}>
      <div className="d-flex mt-5 pt-5 flex-column align-items-center">
        <Image src={notfound} className="notfound" />
        <div className="mt-3 text-center text-19">
          Sorry, we did not find what you are looking for.
        </div>
        <div className="text-center text-19 mt-1">
          Return to{' '}
          <span className="text-20 pointer" onClick={() => history.push('/')}>
            homepage
          </span>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
