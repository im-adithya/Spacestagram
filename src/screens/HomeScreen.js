import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { Row, Col, Container, Image } from 'react-bootstrap';

import { pictureFetcher } from '../actions/pictureFetcher';
import { hyphenToDate } from '../actions/hyphenToDate';
import { followAccount } from '../actions/followAccount';
import { ACCOUNTS } from '../constants/accounts';
import { USERNAMES } from '../constants/usernames';
import { ALL_ACCOUNTS } from '../constants/allAccounts';
import {
  APODRespHandler,
  APODTodayRespHandler,
  EPICRespHandler,
  NASARespHandler,
  MaRoPhoRespHandler,
  earthRespHandler
} from '../constants/requests';
import {
  APODRequests,
  APODTodayRequest,
  EPICRequests,
  NASARequests,
  MaRoPhoRequests,
  EarthRequest
} from '../constants/requests';

import { AuthContext } from '../Auth';
import Loader from '../components/Loader';
import APOD from '../components/APOD';
import Post from '../components/Post';

const HomeScreen = () => {
  const [load, setLoad] = useState(true);
  const [progress, setProgress] = useState(0);
  const history = useHistory();
  const user = useContext(AuthContext).currentUser;
  const { feed, setFeed } = useContext(AuthContext).feed;
  const { apod, setApod } = useContext(AuthContext).apod;
  const { following, setFollowing } = useContext(AuthContext).following;

  const followHandler = (account_id) => {
    if (following.includes(account_id)) {
      let newFollowing = following.filter((a) => a !== account_id);
      setFollowing(newFollowing);
      followAccount(newFollowing);
    } else {
      setFollowing([...following, account_id]);
      followAccount([...following, account_id]);
    }
  };

  useEffect(() => {
    let dates = [];
    const date = new Date();
    date.setDate(date.getDate() - 2);
    for (let i = 0; i < 5; i++) {
      dates.push(date.toISOString().split('T')[0]);
      date.setDate(date.getDate() - 1);
    }

    // For Earth
    if (!localStorage.getItem('earth')) localStorage.setItem('earth', 0);
    const earthStart = parseInt(localStorage.getItem('earth'));
    const actualES = earthStart - 2 < 0 ? 0 : earthStart - 2;

    // For NASA
    if (localStorage.getItem('nasa') === null) localStorage.setItem('nasa', 1);
    const nasaStart = parseInt(localStorage.getItem('nasa'));
    let actualNS = nasaStart - 2 < 0 ? 1 : nasaStart - 2;

    let fiveDCodes = [];
    for (let i = 0; i < 5; i++) {
      fiveDCodes.push(actualNS);
      actualNS++;
    }

    fiveDCodes = fiveDCodes.map((c) => c.toString().padStart(5, '0'));

    const loader = async () => {
      const feedPosts = [];
      var apodtod = {};
      if (following.includes(0))
        feedPosts.push(...APODRespHandler(await axios.all(APODRequests(dates))));
      setProgress(20);
      if (following.includes(0)) apodtod = APODTodayRespHandler(await axios.get(APODTodayRequest));
      setProgress(35);
      if (following.includes(1))
        feedPosts.push(...EPICRespHandler(await axios.all(EPICRequests(dates))));
      setProgress(60);
      if (following.includes(2))
        feedPosts.push(
          ...NASARespHandler(await axios.all(NASARequests(fiveDCodes)), fiveDCodes, true, actualNS)
        );
      setProgress(70);
      if (following.includes(3))
        feedPosts.push(...MaRoPhoRespHandler(await axios.all(MaRoPhoRequests(dates))));
      setProgress(85);
      if (following.includes(4))
        feedPosts.push(...earthRespHandler(await axios.get(EarthRequest), actualES, true));
      setProgress(100);

      feedPosts.sort((a, b) =>
        hyphenToDate(a.date) > hyphenToDate(b.date)
          ? -1
          : hyphenToDate(b.date) > hyphenToDate(a.date)
          ? 1
          : 0
      );

      setFeed(feedPosts);
      setApod(apodtod);
      setLoad(false);
    };
    setProgress(10);
    if (feed.length === 0) loader();
    else setLoad(false);
  }, []);

  if (load) return <Loader showProgress progress={progress} />;

  return (
    <Container>
      <Row>
        <Col xs={12} md={8} className="top-space-1">
          {following.includes(0) && (
            <APOD photoURL={apod.photoURL} description={apod.description} date={apod.date} />
          )}
          {feed.map((post, index) => {
            return (
              <Post
                key={index}
                account_id={post.account}
                id={post.id}
                photoURL={post.photoURL}
                description={post.description}
                date={post.date}
              />
            );
          })}
        </Col>
        <Col className="d-none d-md-block" md={4}>
          <div className="top-space-1 sticky-top">
            <div
              className="d-flex align-items-center justify-content-between mb-3 pointer"
              onClick={() => {
                history.push('/me');
              }}>
              <div className="d-flex align-items-center">
                <Image src={user.photoURL} width="56px" className="rounded-circle home-dp" />
                <div className="ml-3">
                  <p className="text-2 mb-0">{user.email.split('@')[0]}</p>
                  <p className="text-3 mb-0">{user.displayName}</p>
                </div>
              </div>
              <div
                className="text-4 ml-2 pointer"
                onClick={() => {
                  history.push('/me');
                }}>
                Profile
              </div>
            </div>
            <div className="mb-3">
              <p className="text-3">Accounts you follow</p>
              {following.map((value, index) => {
                return (
                  <div
                    className="d-flex align-items-center justify-content-between mb-2"
                    key={index}>
                    <div
                      className="d-flex align-items-center pointer"
                      onClick={() => {
                        history.push('/' + USERNAMES[value].toLowerCase());
                      }}>
                      <Image
                        src={pictureFetcher(value)}
                        width="40px"
                        className="rounded-circle home-dp"
                      />
                      <div className="ml-3">
                        <p className="text-5 mb-0">{USERNAMES[value]}</p>
                        <p className="text-6 mb-0">{ACCOUNTS[value]}</p>
                      </div>
                    </div>
                    <div className="text-7 ml-2 pointer" onClick={() => followHandler(value)}>
                      Unfollow
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mb-3">
              <p className="text-3">Suggestions for you</p>
              {ALL_ACCOUNTS.filter((a) => !following.includes(a)).map((value, index) => {
                return (
                  <div
                    className="d-flex align-items-center justify-content-between mb-2"
                    key={index}>
                    <div
                      className="d-flex align-items-center pointer"
                      onClick={() => {
                        history.push('/' + USERNAMES[value].toLowerCase());
                      }}>
                      <Image
                        src={pictureFetcher(value)}
                        width="40px"
                        className="rounded-circle home-dp"
                      />
                      <div className="ml-3">
                        <p className="text-5 mb-0">{USERNAMES[value]}</p>
                        <p className="text-6 mb-0">{ACCOUNTS[value]}</p>
                      </div>
                    </div>
                    <div className="text-4 ml-2 pointer" onClick={() => followHandler(value)}>
                      Follow
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-8 mb-0">
              &copy; 2022{' '}
              <a href="https://github.com/im-adithya" target="_blank" rel="noreferrer">
                Adithya Vardhan
              </a>{' '}
              |{' '}
              <a href="https://api.nasa.gov/" target="_blank" rel="noreferrer">
                NASA API
              </a>
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default HomeScreen;
