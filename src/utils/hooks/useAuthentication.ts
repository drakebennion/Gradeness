import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import React, { useState } from 'react';

const auth = getAuth();

export function useAuthentication() {
  const [user, setUser] = useState<User>();
  const [isOwner, setIsOwner] = useState(false);
  const db = getFirestore();

  React.useEffect(() => {
    const unsubscribeFromAuthStatusChanged = onAuthStateChanged(
      auth,
      async user => {
        if (user) {
          const userDetails = await getDoc(
            doc(db, 'userDetails', user.uid),
          ).catch(() =>
            console.log('something went wrong fetching user details'),
          );

          if (
            userDetails &&
            userDetails.exists() &&
            userDetails.data().accountType === 'owner'
          ) {
            setIsOwner(true);
          }

          setUser(user);
        } else {
          // User is signed out
          setUser(undefined);
        }
      },
    );

    return unsubscribeFromAuthStatusChanged;
  }, []);

  return {
    user,
    isOwner,
  };
}
