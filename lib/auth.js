import { createContext, useContext, useEffect, useState } from 'react';
import firebase from './firebase';

const authContext = createContext();

export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => {
  return useContext(authContext);
};

function useProvideAuth() {
  const [user, setUser] = useState(null);

  const signInWithGitHub = async () => {
    const res = await firebase.auth().signInWithPopup(new firebase.auth.GithubAuthProvider());
    setUser(res.user);
    return res.user;
  };

  const signOut = async () => {
    await firebase.auth().signOut();
    setUser(false);
  };

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(false);
      }
    });

    return () => unsubscribe();
  });

  return {
    user,
    signInWithGitHub,
    signOut,
  };
}
