import firebase from '../firebase';

export const useLogout = () => {
  firebase
    .auth()
    .signOut()
    .then(
      function () {
        // Sign-out successful.
        window.location.reload();
      },
      function (error) {
        console.log(error);
      }
    );
};
