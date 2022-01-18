import React, { useContext, useState } from 'react';
import { Container, Image } from 'react-bootstrap';

import { useLogin } from '../hooks/useLogin';
import { AuthContext } from '../Auth';
import HomeScreen from './HomeScreen';

import logo from '../assets/logo-full.svg';
import glogo from '../assets/g-logo.svg';
import universe from '../assets/universe-2.png';

const LandingScreen = () => {
  const loginHandler = useLogin();
  const user = useContext(AuthContext).currentUser;
  const [onButton, setOnButton] = useState(false);

  if (user) return <HomeScreen />;

  return (
    <div className="flex-wrapper">
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ height: '100vh' }}>
        <div>
          <Image className="mx-auto d-block mb-4" src={logo} height="50px" />
          <div className="ld-container d-flex justify-content-center align-items-center">
            <div
              className={
                'd-none d-md-block box-shadow landing-display-1 ' + (onButton && 'opacity-1')
              }></div>
            <div className="box-shadow landing-display-2 d-flex flex-column align-items-center">
              <Image src={universe} width="100%" />
              <div className="d-flex flex-column justify-content-center align-items-center my-4">
                <h6 className="text-1 mt-2 text-center">
                  Explore the universe, powered by NASA API
                </h6>
                <button
                  className="button-1 mt-3 mb-2 d-flex justify-content-center align-items-center hover-effect"
                  onMouseEnter={() => setOnButton(true)}
                  onMouseLeave={() => setOnButton(false)}>
                  <Image src={glogo} width="20px" />
                  <p className="mb-0 pl-2" onClick={loginHandler}>
                    Sign in with Google
                  </p>
                </button>
              </div>
            </div>
            <div
              className={
                'd-none d-md-block box-shadow landing-display-3 ' + (onButton ? 'opacity-1' : '')
              }></div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default LandingScreen;
