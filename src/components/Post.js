import React, { useState, useContext } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Container, Image } from 'react-bootstrap';

import { ACCOUNTS } from '../constants/accounts';
import { USERNAMES } from '../constants/usernames';
import { dateString } from '../actions/dateString';
import { pictureFetcher } from '../actions/pictureFetcher';
import { AuthContext } from '../Auth';

import heart from '../assets/heart.svg';
import share from '../assets/share.svg';
import star from '../assets/star.svg';
import full from '../assets/full.svg';

import heartfillwhite from '../assets/heart-fill-white.svg';
import heartfill from '../assets/heart-fill.svg';
import starfill from '../assets/star-fill.svg';
import { likePost } from '../actions/likePost';
import { starPost } from '../actions/starPost';

const Post = ({ account_id, id, photoURL, description, date, fullpage }) => {
  const history = useHistory();
  const location = useLocation();

  const postScreen = location.pathname.substring(1).charAt(0) === 'p';

  const user = useContext(AuthContext).currentUser;
  const { liked, setLiked } = useContext(AuthContext).liked;
  const { starred, setStarred } = useContext(AuthContext).starred;
  const { setPopup } = useContext(AuthContext).popup;
  const { setFullView } = useContext(AuthContext).fv;

  const [heartAnimate, setHeartAnimate] = useState(false);

  const [desc, setDesc] = useState(fullpage ? description : description.slice(0, 120));
  const [descReq, setDescReq] = useState(fullpage ? false : description.length > 120);

  const [sLiked, setSLiked] = useState(liked);
  const [sStarred, setSStarred] = useState(starred);

  const handleClick = (e) => {
    if (e.detail === 2) likeHandler();
  };

  const likeHandler = () => {
    const identifier = `${account_id}/${id}`;
    if (liked.includes(identifier)) {
      let likes = liked;
      likes.splice(liked.indexOf(identifier), 1);
      setLiked(likes);
      setSLiked(likes);
      likePost(likes);
    } else {
      setHeartAnimate(true);
      setTimeout(() => {
        setHeartAnimate(false);
      }, 1200);

      setLiked([...liked, identifier]);
      setSLiked([...liked, identifier]);
      likePost([...liked, identifier]);
    }
  };

  const starHandler = () => {
    const identifier = `${account_id}/${id}`;
    if (starred.includes(identifier)) {
      let stars = starred;
      stars.splice(starred.indexOf(identifier), 1);
      setStarred(stars);
      setSStarred(stars);
      starPost(stars);
    } else {
      setPopup('Post Starred');
      setTimeout(() => {
        setPopup(null);
      }, 1200);
      setStarred([...starred, identifier]);
      setSStarred([...starred, identifier]);
      starPost([...starred, identifier]);
    }
  };

  const shareHandler = () => {
    navigator.clipboard.writeText(`https://space-stagram.web.app/p/${account_id}/${id}`);
    setPopup('Link Copied To Clipboard');
    setTimeout(() => {
      setPopup(null);
    }, 1200);
  };

  return (
    <Container
      className={
        'w-100 post d-flex flex-column p-0 ' + (user && postScreen ? 'top-space-3 mb-4' : ' mb-4')
      }>
      <div className={fullpage ? 'fp' : ''}>
        <div className="d-flex justify-content-between align-items-center p-2">
          <div
            className="d-flex justify-content-between align-items-center pointer"
            onClick={() => {
              history.push('/' + USERNAMES[account_id].toLowerCase());
            }}>
            <Image
              className="post-dp rounded-circle"
              src={pictureFetcher(account_id)}
              width="36px"
            />
            <div className="ml-3 d-flex flex-column align-items-start">
              <div className="text-2">{USERNAMES[account_id]}</div>
              <div className="text-3">{ACCOUNTS[account_id]}</div>
            </div>
          </div>
          {!fullpage && (
            <Image
              src={full}
              className="pointer action-icon p-2"
              onClick={() => {
                setFullView(`/p/${account_id}/${id}///${photoURL}`);
              }}
              width="34px"
            />
          )}
        </div>
        <div className="position-relative">
          <Image
            src={heartfillwhite}
            className={
              'heart-pop position-absolute top-50 start-50 translate-middle ' +
              (heartAnimate ? 'like' : '')
            }
          />
          <Image src={photoURL} className="w-100 h-auto" onClick={handleClick} />
        </div>
        {user && (
          <div className="controls d-flex justify-content-between align-items-center p-2">
            <div>
              <Image
                src={sLiked.includes(`${account_id}/${id}`) ? heartfill : heart}
                onClick={likeHandler}
                className="pointer action-icon p-1"
                width="34px"
              />
              <Image
                src={share}
                onClick={shareHandler}
                className="pointer action-icon p-1 ml-1"
                width="34px"
              />
            </div>
            <Image
              src={sStarred.includes(`${account_id}/${id}`) ? starfill : star}
              onClick={starHandler}
              className="pointer action-icon p-1"
              width="34px"
            />
          </div>
        )}
        <div className={'p-2 ' + (user ? 'pt-0' : '')}>
          <span
            className="text-12 pointer"
            onClick={() => {
              history.push('/' + USERNAMES[account_id].toLowerCase());
            }}>
            {USERNAMES[account_id]}
          </span>
          &nbsp;&nbsp;
          <span className="text-13">{desc}</span>
          {descReq && (
            <span className="text-13">
              ...{' '}
              <span
                className="text-14 pointer"
                onClick={() => {
                  setDesc(description);
                  setDescReq(false);
                }}>
                more
              </span>
            </span>
          )}
          <p className="text-3 mt-2 mb-0">{dateString(date)}</p>
        </div>
      </div>
    </Container>
  );
};

export default Post;
