import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Container } from 'react-bootstrap';

import Loader from '../components/Loader';
import Post from '../components/Post';

import {
  APODSingleRespHandler,
  EPICSingleRespHandler,
  NASASingleRespHandler,
  MaRoPhoSingleRespHandler
} from '../constants/requests';
import {
  createAPODRequests,
  createEPICRequests,
  createNASARequests,
  createMaRoPhoRequests
} from '../constants/requests';

const LandingScreen = () => {
  const [load, setLoad] = useState(true);
  const location = useLocation();
  const path = location.pathname.substring(1).split('/');
  const [post, setPost] = useState({});

  useEffect(() => {
    const load = async () => {
      switch (parseInt(path[1])) {
        case 0:
          createAPODRequests(path[2]).then((res) => {
            setPost(APODSingleRespHandler(res.data));
            setLoad(false);
          });
          break;
        case 1:
          createEPICRequests(path[2]).then((res) => {
            setPost(EPICSingleRespHandler(res.data));
            setLoad(false);
            console.log(post);
          });
          break;
        case 2:
          createNASARequests(path[2], false).then((res) => {
            setPost(NASASingleRespHandler(res.data, path[2], false));
            setLoad(false);
          });
          break;
        case 3:
          createMaRoPhoRequests(path[2]).then((res) => {
            setPost(MaRoPhoSingleRespHandler(res.data));
            setLoad(false);
          });
          break;
        case 4:
          createNASARequests(path[2], false).then((res) => {
            setPost(NASASingleRespHandler(res.data, path[2], true));
            setLoad(false);
          });
          break;
        default:
          return;
      }
    };
    load();
  }, []);

  if (load) return <Loader />;

  return (
    <Container>
      <Post
        account_id={parseInt(path[1])}
        id={post.id}
        description={post.description}
        photoURL={post.photoURL}
        date={post.date}
        fullpage
      />
    </Container>
  );
};

export default LandingScreen;
