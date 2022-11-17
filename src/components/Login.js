import React from "react";
import Button from "@mui/material/Button";
import "./Login.css";
import { auth, provider, signInWithPopup } from "../firebase";
import { useStateValue } from "../StateProvider";

function Login() {
  const [{}, dispatch] = useStateValue();
  const signIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        dispatch({
          type: "SET_USER",
          user: result.user,
        });
      })
      .catch((error) => alert(error.message));
  };

  return (
    <div className="login">
      <div className="login_container">
        <div className="login_text">
          <h1>Sign in</h1>
        </div>
        <Button onClick={signIn}>Sign in with Google</Button>
      </div>
    </div>
  );
}

export default Login;
