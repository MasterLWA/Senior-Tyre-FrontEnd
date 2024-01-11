import React, { useEffect, useState } from "react";
import { ENDPOINT } from "../config";

const Loging = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userpassword, setUserpassword] = useState("");
  const [adminpassword, setAdminpassword] = useState("");
  const [error, setError] = useState(null);

      // get user and admin password from the database get call = /sendpasswords when the page loads {
//     "user": "seniorSL949",
//     "admin": "L3tM3In2314"
// }
      useEffect(() => {
        fetch(`${ENDPOINT}/sendpasswords`)
          .then((res) => res.json())
          .then((data) => {
            setUserpassword(data.user);
            setAdminpassword(data.admin);
          })
          .catch((err) => console.log(err));
      }
      , []);


  const handleSubmit = (e) => {
    e.preventDefault();

    // Check username and password
    if (username === "user" && password === userpassword) {
      // Redirect to the billing page for regular users
      window.location.href = '/billing';
    } else if (username === "admin" && password === adminpassword) {
      // Redirect to the admin dashboard for admins
      window.location.href = '/dashboard';
    } else {
      // Display an error message for invalid credentials
      setError("Invalid username or password");
    }
  };

  // User is not logged in, render the login form
  return (
    <div className="mt-5 d-flex flex-column vh-100">
      <div className="form container text-center mt-5 mb-5 p-5 border border-dark rounded bg-light shadow rounded mx-auto w-75">
        <h1 className="text-center mb-3">Log in</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="UserName"
            className="mt-1 form-control mx-auto"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <br />
          <input
            type="password"
            placeholder="Password"
            className="mt-1 form-control mx-auto"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <input
            type="submit"
            value="Sign In"
            className="btn btn-success btn-lg btn-block"
          />
        </form>
        {error && <p className="text-danger">{error}</p>}
      </div>
    </div>
  );
};

export default Loging;
