import React, { useEffect, useState } from 'react';
import firebase from './firebase.js';

import Loader from './components/Loader';

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [following, setFollowing] = useState([]);
  const [liked, setLiked] = useState([]);
  const [starred, setStarred] = useState([]);
  const [userLoading, setUserLoading] = useState(true);
  const [popup, setPopup] = useState('');
  const [fullView, setFullView] = useState('');

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        setUserLoading(false);
        return;
      }
      const ref = firebase.database().ref('user/' + user?.uid);
      ref.once('value').then((snapshot) => {
        setFollowing(snapshot.val() ? snapshot.val().following : [0, 1, 3]);
        setLiked(snapshot.val() ? snapshot.val().liked : []);
        setStarred(snapshot.val() ? snapshot.val().starred : []);
        setCurrentUser(user);
        setUserLoading(false);
      });
    });
  }, [userLoading]);

  if (userLoading) return <Loader />;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        following: { following, setFollowing },
        liked: { liked, setLiked },
        starred: { starred, setStarred },
        userLoading: { userLoading, setUserLoading },
        popup: { popup, setPopup },
        fv: { fullView, setFullView }
      }}>
      {children}
    </AuthContext.Provider>
  );
};
