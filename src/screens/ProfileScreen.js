import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory, useLocation } from 'react-router-dom';
import { Container, Image } from 'react-bootstrap';

import { idFetcher } from '../actions/idFetcher';
import { pictureFetcher } from '../actions/pictureFetcher';
import { hyphenToDate } from '../actions/hyphenToDate';
import { followAccount } from '../actions/followAccount';
import { ACCOUNTS } from '../constants/accounts';
import { BIOS } from '../constants/bios';
import { USERNAMES } from '../constants/usernames';
import {
  APODRespHandler,
  EPICRespHandler,
  NASARespHandler,
  MaRoPhoRespHandler,
  earthRespHandler,
  starLikeRespHandler
} from '../constants/requests';
import {
  APODRequests,
  EPICRequests,
  NASARequests,
  MaRoPhoRequests,
  EarthRequest,
  starLikeRequests
} from '../constants/requests';

import { AuthContext } from '../Auth';
import Loader from '../components/Loader';

import none from '../assets/none.svg';

const ProfileScreen = () => {
  const history = useHistory();
  const location = useLocation();
  const [load, setLoad] = useState(true);

  const user = useContext(AuthContext).currentUser;

  const account = location.pathname.substring(1);
  let id = idFetcher(account);
  if (!user && account === 'me') id = -1;

  const liked = useContext(AuthContext).liked.liked;
  const starred = useContext(AuthContext).starred.starred;

  const { wall, setWall } = useContext(AuthContext).wall;
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
    for (let i = 0; i < 18; i++) {
      dates.push(date.toISOString().split('T')[0]);
      date.setDate(date.getDate() - 1);
    }

    // For NASA
    let actualNS = 1;

    let fiveDCodes = [];
    for (let i = 0; i < 18; i++) {
      fiveDCodes.push(actualNS);
      actualNS++;
    }

    fiveDCodes = fiveDCodes.map((c) => c.toString().padStart(5, '0'));

    const load = async () => {
      const profilePosts = [];
      const starredPosts = [];
      const likedPosts = [];
      if (id === 0) profilePosts.push(...APODRespHandler(await axios.all(APODRequests(dates))));
      if (id === 1) profilePosts.push(...EPICRespHandler(await axios.all(EPICRequests(dates))));
      if (id === 2)
        profilePosts.push(
          ...NASARespHandler(await axios.all(NASARequests(fiveDCodes)), fiveDCodes, false, 0)
        );
      if (id === 3)
        profilePosts.push(...MaRoPhoRespHandler(await axios.all(MaRoPhoRequests(dates))));
      if (id === 4)
        profilePosts.push(...earthRespHandler(await axios.get(EarthRequest), 0, false, 18));
      if (id === 5 && starred.length > 1)
        starredPosts.push(
          ...starLikeRespHandler(await axios.all(starLikeRequests(starred)), starred)
        );
      if (id === 5 && liked.length > 1)
        likedPosts.push(...starLikeRespHandler(await axios.all(starLikeRequests(liked)), liked));

      profilePosts.sort((a, b) =>
        hyphenToDate(a.date) > hyphenToDate(b.date)
          ? -1
          : hyphenToDate(b.date) > hyphenToDate(a.date)
          ? 1
          : 0
      );

      if (id === 5) {
        wall[5] = starredPosts.reverse();
        wall[6] = likedPosts.reverse();
      } else wall[id] = profilePosts;
      setWall(wall);
      setLoad(false);
    };
    if (!wall[id]) load();
    /*if (id !== 5 && !wall[id] === 0) load();
    else if (id === 5 && ((starred.length !==0 && wall[5].length === 0) || (liked.length !==0 && wall[6].length === 0))) load();*/ else
      setLoad(false);
  }, [id]);

  {
    /* if (id === -1) return <404 /> */
  }
  if (load) return <Loader />;

  return (
    <Container className={'px-0 ' + (user ? 'top-space-2' : '')}>
      <div className="profile mt-3 mt-md-0 d-flex align-items-center pl-4">
        <Image
          src={id === 5 ? user.photoURL : pictureFetcher(id)}
          className="rounded-circle profile-dp m-md-5"
        />
        <div className="w-100 mb-3 mb-md-0 ml-4 ml-md-5">
          <div className="d-flex align-items-center">
            <div className="text-15 mr-4">
              {id === 5 ? user.email.split('@')[0] : USERNAMES[id]}
            </div>
            {id !== 5 && !following.includes(id) && (
              <button className="button-3 pointer" onClick={() => followHandler(id)}>
                Follow
              </button>
            )}
            {id !== 5 && following.includes(id) && (
              <div className="text-4 pointer" onClick={() => followHandler(id)}>
                Following
              </div>
            )}
          </div>
          <div className="text-1 mt-2">{id === 5 ? user.displayName : ACCOUNTS[id]}</div>
          {id !== 5 && <div className="text-2 mt-1">{BIOS[id]}</div>}
          {id === 5 && (
            <div className="text-3 mt-2">
              <span className="text-2">{following.length}</span> following
            </div>
          )}
          {id === 5 && (
            <div className="d-flex align-items-center mt-1">
              {following.map((account, index) => {
                return (
                  <div
                    key={index}
                    className="text-2 mr-1 pointer"
                    onClick={() => {
                      history.push('/' + USERNAMES[account].toLowerCase());
                    }}>
                    {USERNAMES[account]}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <div className="">
        <div className="text-16 text-center py-3 line">
          {id !== 5 ? `ALL POSTS BY ${USERNAMES[id]}` : 'STARRED POSTS'}
        </div>
        {id === 5 && wall[5].length === 0 && (
          <div className="d-flex flex-column align-items-center justify-content-center my-5">
            <Image src={none} className="" width="250px" />
            <p className="text-17 mt-3">You haven&apos;t starred any posts yet.</p>
          </div>
        )}
        {id === 5 && wall[5].length !== 0 && (
          <div className="gallery">
            {wall[5].map((post, index) => {
              return (
                <div className="gallery-item" tabIndex="0" key={index}>
                  <img
                    src={post.photoURL}
                    onClick={() => history.push(`p/${post.id}`)}
                    className="gallery-image"
                    alt=""
                  />
                </div>
              );
            })}
          </div>
        )}

        {id === 5 && <div className="text-16 text-center py-3 line">LIKED POSTS</div>}
        {id === 5 && wall[6].length === 0 && (
          <div className="d-flex flex-column align-items-center justify-content-center mt-5">
            <Image src={none} className="" width="250px" />
            <p className="text-17 mt-3">You haven&apos;t liked any posts yet.</p>
          </div>
        )}
        {id === 5 && wall[6].length !== 0 && (
          <div className="gallery">
            {wall[6].map((post, index) => {
              return (
                <div className="gallery-item" tabIndex="0" key={index}>
                  <img
                    src={post.photoURL}
                    onClick={() => history.push(`p/${post.id}`)}
                    className="gallery-image"
                    alt=""
                  />
                </div>
              );
            })}
          </div>
        )}

        {id !== 5 && (
          <div className="gallery">
            {wall[id].map((post, index) => {
              return (
                <div className="gallery-item" tabIndex="0" key={index}>
                  <img
                    src={post.photoURL}
                    onClick={() => history.push(`p/${id}/${post.id}`)}
                    className="gallery-image"
                    alt=""
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Container>
  );
};

export default ProfileScreen;
