import React, { createContext, useEffect } from "react";
import { useState } from "react";
import { app } from "../Firebase/firebase.config";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
export const AuthContext = createContext(null);

const auth = getAuth(app);

const AuthProvider = ({ children }) => {
  const [searchField, setSearchField] = useState("");
  // console.log(searchField)
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const googleProvider = new GoogleAuthProvider();

  // create user

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // updateUserProfile

  // const updateUserProfile = (name, photo) => {
  //     setLoading(true);
  //     return updateProfile(auth.currentUser, {
  //         displayName: name, photoURL: photo
  //     })
  // }

  // sign in
  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // googleSignIn (

  // const googleSignIn = () => {
  //     setLoading(true);
  //     return signInWithPopup(auth, googleProvider)
  // }

  //reset password

  const resetPassword = (email) => {
    setLoading(true);
    return sendPasswordResetEmail(auth, email);
  };

  // logOut

  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };
  // state change
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const authInfo = {
    user,
    setUser,
    loading,
    setLoading,
    createUser,
    signIn,
    logOut,
    resetPassword,
    // updateUserProfile,

    searchField,
    setSearchField,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
