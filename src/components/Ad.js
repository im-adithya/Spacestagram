import React from 'react';
import { Container, Image } from 'react-bootstrap';

import logo from '../assets/logo-bg.svg';
import { useLogin } from '../hooks/useLogin';

const Ad = () => {
  const loginHandler = useLogin();
  return (
    <Container className="w-100 top-space-3">
      <div className="ad p-3 px-md-4 mb-4">
        <div className="w-100 d-flex flex-row justify-content-between align-items-center">
          <div className="d-flex justify-content-center">
            <Image src={logo} width="60px" />
            <div className="ml-4 d-flex flex-column justify-content-center">
              <div className="text-9 mb-1">
                Spacestagram is free. All you need is a google account!
              </div>
              <div className="text-10">
                Explore the entire universe with us, powered by NASA API
              </div>
            </div>
          </div>
          <button className="button-2 d-none d-md-block" onClick={loginHandler}>
            Log in/Sign Up
          </button>
        </div>
        <button className="button-2 w-100 mt-2 d-md-none py-2">Log in/Sign Up</button>
      </div>
    </Container>
  );
};

export default Ad;
