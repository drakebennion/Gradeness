import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';
import React from 'react';

const auth = getAuth();

export function useAuthentication() {
  const [user, setUser] = React.useState<User>();

  React.useEffect(() => {
    const unsubscribeFromAuthStatusChanged = onAuthStateChanged(auth, user => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User

        // todo: check if user has verified email
        // if they do not, AND their account was created more than 3 days ago, set their user to undefined
        // better pop a toast to say they need to verify their email

        setUser(user);
      } else {
        // User is signed out
        setUser(undefined);
      }
    });

    return unsubscribeFromAuthStatusChanged;
  }, []);

  return {
    user,
  };
}
