import firebase from '../firebase';

export const useLogout = () => {
  firebase
    .auth()
    .signOut()
    .then(
      function () {
        // Sign-out successful.
        localStorage.removeItem('earth');
        localStorage.removeItem('nasa');
        localStorage.removeItem('today');
        localStorage.removeItem('home-date');
        localStorage.removeItem('home-replenish');
        localStorage.removeItem('feed');
        localStorage.removeItem('apod');
        localStorage.removeItem('profile-date');
        localStorage.removeItem('profile');
        localStorage.removeItem('profile-replenish');
        window.location.reload();
      },
      function (error) {
        console.log(error);
      }
    );
};
