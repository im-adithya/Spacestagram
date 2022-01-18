import { USERNAMES } from '../constants/usernames';

export const idFetcher = (account) => {
  if (account === 'me') return 5;
  return USERNAMES.map((u) => u.toLowerCase()).indexOf(account);
};
