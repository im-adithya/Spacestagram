import React from 'react';
import { Image } from 'react-bootstrap';

import loader from '../assets/loader.svg';

const Loader = ({ message }) => {
  return (
    <div className="position-fixed bottom-0 start-0 py-2 px-3 m-2 m-md-4 d-flex justify-content-center align-items-center popup">
      <Image src={loader} width="30px" />
      <p className="mb-0 text-18 ml-2">{message}</p>
    </div>
  );
};

export default Loader;
