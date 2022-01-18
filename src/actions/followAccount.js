import firebase from '../firebase';

export const followAccount = (following) => {
  firebase
    .database()
    .ref('user/' + firebase.auth().currentUser.uid + '/following')
    .set(following);
};
