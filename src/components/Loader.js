import React from 'react';
import { Image } from 'react-bootstrap';

import loader from '../assets/loader.svg';

const Loader = ({ showProgress, progress }) => {
  return (
    <div
      className="d-flex justify-content-center align-items-center position-relative"
      style={{ height: '100vh', zIndex: 1050, backgroundColor: 'white' }}>
      <div>
        <Image src={loader} width="50px" />
        {showProgress && (
          <div className="progress mt-2">
            <div className="progress-bar" style={{ width: progress + '%' }}></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Loader;
