import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Image } from 'react-bootstrap';

import { AuthContext } from '../Auth';
import { Timer } from '../constants/timer';
import logo from '../assets/logo-font-white.svg';
import link from '../assets/link.svg';
import cross from '../assets/cross.svg';

const FullViewer = ({ fullView }) => {
  const redir = fullView.split('///')[0];
  const photoURL = fullView.split(':')[1];
  const history = useHistory();
  const [time, setTime] = useState(null);
  const [flag, setFlag] = useState(false);
  const setFullView = useContext(AuthContext).fv.setFullView;

  const pausePlay = () => {
    if (flag) time.resume();
    else time.pause();
    setFlag(!flag);
  };

  useEffect(() => {
    setTime(
      new Timer(function () {
        setFullView(null);
      }, 5000)
    );
  }, []);

  return (
    <div className="position-fixed fullview" style={{ height: '100vh', width: '100vw' }}>
      <div className="d-flex flex-column justify-content-center align-items-center">
        <div className="w-100 p-3 d-flex justify-content-between align-items-center">
          <Image src={logo} className="pl-3" width="140px" />
          <div className="mr-1 mr-md-3">
            <Image
              src={link}
              className="p-2 mr-2 pointer"
              width="34px"
              onClick={() => {
                setFullView(null);
                history.push(redir);
              }}
            />
            <Image src={cross} className="p-2 pointer" width="34px" onClick={() => time.kill()} />
          </div>
        </div>
        <div
          className="display d-flex justify-content-center align-items-center"
          onClick={pausePlay}>
          <Image src={photoURL} className="fullviewimg" />
        </div>
        <div className="fv-progress mt-3">
          <div className={'fv-progress-bar ' + (flag ? 'paused' : '')}></div>
        </div>
      </div>
    </div>
  );
};

export default FullViewer;
