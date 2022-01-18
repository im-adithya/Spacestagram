import apod from '../assets/apod.png';
import epic from '../assets/epic.png';
import nasa from '../assets/nasa.jpg';
import maropho from '../assets/maropho.png';
import earth from '../assets/earth.jpg';

export const pictureFetcher = (account_id) => {
  switch (account_id) {
    case 0:
      return apod;
    case 1:
      return epic;
    case 2:
      return nasa;
    case 3:
      return maropho;
    case 4:
      return earth;
    default:
      return;
  }
};
