import firebase from '../firebase';

export const likePost = (liked) => {
  firebase
    .database()
    .ref('user/' + firebase.auth().currentUser.uid + '/liked')
    .set(liked);
};
