import firebase from '../firebase';

export const starPost = (starred) => {
  firebase
    .database()
    .ref('user/' + firebase.auth().currentUser.uid + '/starred')
    .set(starred);
};
