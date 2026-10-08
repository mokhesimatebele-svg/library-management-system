import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login({ onLogin }) {
  const [name, setName] = useState("");
  const [membershipId, setMembershipId] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  function handleLogin(e) {
    e.preventDefault();

    const users =
      JSON.parse(localStorage.getItem("libraryUsers")) || [];

    const user = users.find(
      (user) =>
        user.name.toLowerCase() === name.trim().toLowerCase() &&
        user.membershipId === membershipId.trim()
    );

    if (!user) {
      setError("Incorrect name or membership ID.");
      return;
    }

    sessionStorage.setItem(
      "loggedInUser",
      JSON.stringify(user)
    );

    onLogin(user);
    navigate("/");
  }

  return (
    <div className="login-page">
      <div className="login-box">

        <h1>Library Hub</h1>
        <p>Community Library Management System</p>

        <h2>Login</h2>

        <form onSubmit={handleLogin}>

          <div className="form-group">
            <label>Full Name</label>

            <input
              type="text"
              placeholder="Enter full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Membership ID</label>

            <input
              type="text"
              placeholder="Enter membership ID"
              value={membershipId}
              onChange={(e) => setMembershipId(e.target.value)}
              required
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="add-book-button">
            Login
          </button>

        </form>

        <div className="account-link">
          <p>Don't have an account?</p>

          <Link to="/register" className="create-account-button">
            Create Account
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Login;