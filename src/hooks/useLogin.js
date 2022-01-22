import React from 'react';
import firebase from '../firebase';
import { AuthContext } from '../Auth';

export const useLogin = () => {
  const authContext = React.useContext(AuthContext);
  const provider = new firebase.auth.GoogleAuthProvider();
  const loginHandler = () => {
    authContext.userLoading.setUserLoading(true);
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        // if first time take him to welcome, set your schedule first screen
        if (result.additionalUserInfo.isNewUser) {
          firebase
            .database()
            .ref('user/' + result.user.uid)
            .set({ liked: ['0'], starred: ['0'], following: [0, 1, 3] })
            .then(() => {
              authContext.following.setFollowing([0, 1, 3]);
              authContext.liked.setLiked([]);
              authContext.starred.setStarred([]);
              authContext.userLoading.setUserLoading(false);
              window.location.reload();
            });
        } else {
          authContext.userLoading.setUserLoading(false);
          window.location.reload();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return loginHandler;
};
