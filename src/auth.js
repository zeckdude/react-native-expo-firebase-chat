import { AsyncStorage } from 'react-native';

export const USER_KEY = 'chat-a-lot-signed-in';

export const signInApp = () => AsyncStorage.setItem(USER_KEY, 'true');

export const signOutApp = () => AsyncStorage.removeItem(USER_KEY);

export const isSignedIn = () => new Promise((resolve, reject) => {
  AsyncStorage.getItem(USER_KEY)
    .then((res) => {
      if (res !== null) {
        resolve(true);
      } else {
        resolve(false);
      }
    })
    .catch(err => reject(err));
});
