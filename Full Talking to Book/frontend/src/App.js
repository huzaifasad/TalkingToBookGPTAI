import React, { useState } from "react";
import ChatGpt from "./Chat/ChatGpt";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Pricing from "./Chat/Pricing";
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "./firebase";
import Success from "./Chat/Success";
import Responsive from "./Chat/Responsive";

export default function App() {
  const [user, loading] = useAuthState(auth);
  const [id,setid]=useState()
 
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            exact
            path="/"
            element={<ChatGpt />}
          />
          <Route
            exact
            path="/pricing"
            element={loading ? null : user ? <Pricing /> : <Navigate to="/" />}
          />
          <Route
          exact
          path="/success"
          element={loading ? null : user ? <Success /> : <Navigate to="/" />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}
