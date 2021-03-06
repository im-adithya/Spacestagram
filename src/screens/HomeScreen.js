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
import {
  generateDates,
  generateES,
  generateNS,
  generateReplenishedFeedDates,
  generateReplenishedFeedNS
} from '../actions/feedHelpers';

import { AuthContext } from '../Auth';
import Loader from '../components/Loader';
import APOD from '../components/APOD';
import Post from '../components/Post';
import spinner from '../assets/spinner.svg';
import none from '../assets/none.svg';

const HomeScreen = () => {
  const [load, setLoad] = useState(true);
  const [repLoad, setRepLoad] = useState(false);
  const [progress, setProgress] = useState(0);
  const history = useHistory();
  const user = useContext(AuthContext).currentUser;

  const storedDate = JSON.parse(localStorage.getItem('home-date'));

  const storedDateMatch =
    storedDate?.date === new Date().getDate() && storedDate?.month === new Date().getMonth();
  const storedFeed = JSON.parse(localStorage.getItem('feed'));
  const storedApod = JSON.parse(localStorage.getItem('apod'));
  const storedReplenish = parseInt(localStorage.getItem('home-replenish'));

  const { feed, setFeed } = useContext(AuthContext).feed;
  const { apod, setApod } = useContext(AuthContext).apod;
  const [replenish, setReplenish] = useState(storedDateMatch ? storedReplenish : 0);
  const { setFollowing } = useContext(AuthContext).following;
  const following = useContext(AuthContext).following.following
    ? useContext(AuthContext).following.following
    : [];
  const { setPopup } = useContext(AuthContext).popup;

  const followHandler = async (account_id) => {
    if (following.includes(account_id)) {
      let newFollowing = following.filter((a) => a !== account_id);
      setFollowing(newFollowing);
      followAccount(newFollowing);

      setPopup(`Unfollowed ${USERNAMES[account_id]}`);
      setTimeout(() => {
        setPopup(null);
      }, 1200);

      const newFeed = feed.filter((post) => post.account !== account_id);
      setFeed(newFeed);
      localStorage.setItem(
        'home-date',
        JSON.stringify({ date: new Date().getDate(), month: new Date().getMonth() })
      );
      localStorage.setItem('feed', JSON.stringify(newFeed));
    } else {
      const existingFeed = feed;
      if (account_id === 0)
        existingFeed.push(
          ...APODRespHandler(
            await axios.all(APODRequests(generateReplenishedFeedDates(2, replenish)))
          )
        );
      if (account_id === 0) setApod(APODTodayRespHandler(await axios.get(APODTodayRequest)));
      if (account_id === 1)
        existingFeed.push(
          ...EPICRespHandler(
            await axios.all(EPICRequests(generateReplenishedFeedDates(2, replenish)))
          )
        );
      if (account_id === 2)
        existingFeed.push(
          ...NASARespHandler(
            await axios.all(NASARequests(generateReplenishedFeedNS(replenish).fiveDCodes)),
            generateReplenishedFeedNS(replenish).fiveDCodes,
            true,
            generateReplenishedFeedNS(replenish).actualNS
          )
        );
      if (account_id === 3)
        existingFeed.push(
          ...MaRoPhoRespHandler(
            await axios.all(MaRoPhoRequests(generateReplenishedFeedDates(2, replenish)))
          )
        );
      if (account_id === 4)
        existingFeed.push(
          ...earthRespHandler(
            await axios.get(EarthRequest),
            generateES(),
            true,
            5 * (replenish + 1)
          )
        );

      existingFeed.sort((a, b) =>
        hyphenToDate(a.date) > hyphenToDate(b.date)
          ? -1
          : hyphenToDate(b.date) > hyphenToDate(a.date)
          ? 1
          : 0
      );
      localStorage.setItem(
        'home-date',
        JSON.stringify({ date: new Date().getDate(), month: new Date().getMonth() })
      );
      localStorage.setItem('feed', JSON.stringify(existingFeed));
      setFeed(existingFeed);
      setPopup(`Started following ${USERNAMES[account_id]}`);
      setTimeout(() => {
        setPopup(null);
      }, 1200);

      setFollowing([...following, account_id]);
      followAccount([...following, account_id]);
    }
  };

  useEffect(() => {
    const scrolling_function = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 10 &&
        !repLoad &&
        following.length > 0
      ) {
        window.removeEventListener('scroll', scrolling_function);
        setRepLoad(true);
        setReplenish(replenish + 1);
        localStorage.setItem('home-replenish', replenish + 1);
      }
    };
    if (!repLoad) window.addEventListener('scroll', scrolling_function);
    return () => {
      window.removeEventListener('scroll', scrolling_function);
    };
  }, [repLoad]);

  useEffect(() => {
    const feedPosts = [];
    const loader = async () => {
      var apodtod = {};
      if (following.includes(0))
        feedPosts.push(...APODRespHandler(await axios.all(APODRequests(generateDates(2)))));
      setProgress(20);
      if (following.includes(0)) apodtod = APODTodayRespHandler(await axios.get(APODTodayRequest));
      setProgress(35);
      if (following.includes(1))
        feedPosts.push(...EPICRespHandler(await axios.all(EPICRequests(generateDates(2)))));
      setProgress(60);
      if (following.includes(2))
        feedPosts.push(
          ...NASARespHandler(
            await axios.all(NASARequests(generateNS().fiveDCodes)),
            generateNS().fiveDCodes,
            true,
            generateNS().actualNS
          )
        );
      setProgress(70);
      if (following.includes(3))
        feedPosts.push(...MaRoPhoRespHandler(await axios.all(MaRoPhoRequests(generateDates(2)))));
      setProgress(85);
      if (following.includes(4))
        feedPosts.push(...earthRespHandler(await axios.get(EarthRequest), generateES(), true, 5));
      setProgress(100);

      feedPosts.sort((a, b) =>
        hyphenToDate(a.date) > hyphenToDate(b.date)
          ? -1
          : hyphenToDate(b.date) > hyphenToDate(a.date)
          ? 1
          : 0
      );

      localStorage.setItem(
        'home-date',
        JSON.stringify({ date: new Date().getDate(), month: new Date().getMonth() })
      );
      localStorage.setItem('feed', JSON.stringify(feedPosts));
      setFeed(feedPosts);
      localStorage.setItem('apod', JSON.stringify(apodtod));
      setApod(apodtod);
      setLoad(false);
    };

    const replenisher = async (replenish) => {
      const newFeedPosts = [];
      if (following.includes(0))
        newFeedPosts.push(
          ...APODRespHandler(await axios.all(APODRequests(generateDates(2 + replenish * 5))))
        );
      if (following.includes(1))
        newFeedPosts.push(
          ...EPICRespHandler(await axios.all(EPICRequests(generateDates(2 + replenish * 5))))
        );
      if (following.includes(2))
        newFeedPosts.push(
          ...NASARespHandler(
            await axios.all(NASARequests(generateNS().fiveDCodes)),
            generateNS().fiveDCodes,
            true,
            generateNS().actualNS
          )
        );
      if (following.includes(3))
        newFeedPosts.push(
          ...MaRoPhoRespHandler(await axios.all(MaRoPhoRequests(generateDates(2 + replenish * 5))))
        );
      if (following.includes(4))
        newFeedPosts.push(
          ...earthRespHandler(await axios.get(EarthRequest), generateES(), true, 5)
        );
      newFeedPosts.sort((a, b) =>
        hyphenToDate(a.date) > hyphenToDate(b.date)
          ? -1
          : hyphenToDate(b.date) > hyphenToDate(a.date)
          ? 1
          : 0
      );
      setRepLoad(!repLoad);
      localStorage.setItem(
        'home-date',
        JSON.stringify({ date: new Date().getDate(), month: new Date().getMonth() })
      );
      localStorage.setItem('feed', JSON.stringify([...feed, ...newFeedPosts]));
      setFeed([...feed, ...newFeedPosts]);
      // Here we are ignoring the case where the user misses the APOD
      // post while passing the day in the middle during replenishment
    };

    setProgress(10);
    if (feed?.length === 0) {
      if (storedDateMatch) {
        setFeed(storedFeed);
        setApod(storedApod);
        setProgress(100);
        setLoad(false);
      } else loader();
    } else if (replenish > 0) replenisher(replenish);
    else setLoad(false);
  }, [replenish]);

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
          {!following.length && (
            <>
              <Image src={none} className="d-block mx-auto mt-5" width="250px" />
              <p className="text-17 mt-3 text-center">Follow accounts to view images here.</p>
            </>
          )}
          {repLoad && <Image src={spinner} width="100px" className="d-block mx-auto" />}
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
