import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [membershipId, setMembershipId] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleRegister(e) {
    e.preventDefault();

    const cleanName = name.trim();
    const cleanId = membershipId.trim();

    if (!cleanName || !cleanId) {
      setError("Please complete all fields.");
      return;
    }

    const users =
      JSON.parse(localStorage.getItem("libraryUsers")) || [];

    const exists = users.some(
      (user) =>
        user.membershipId.toLowerCase() === cleanId.toLowerCase()
    );

    if (exists) {
      setError("This Membership ID already exists.");
      return;
    }

    const newUser = {
      id: crypto.randomUUID(),
      name: cleanName,
      membershipId: cleanId,
      role: "Member",
    };

    localStorage.setItem(
      "libraryUsers",
      JSON.stringify([...users, newUser])
    );

    alert("Account created successfully! Please log in.");
    navigate("/login");
  }

  return (
    <div className="login-page">
      <div className="login-box">
        <h1>Library Hub</h1>
        <p>Create your library account</p>

        <h2>Create Account</h2>

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Membership ID</label>
            <input
              type="text"
              placeholder="e.g. MEM002"
              value={membershipId}
              onChange={(e) => setMembershipId(e.target.value)}
              required
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="add-book-button">
            Create Account
          </button>
        </form>

        <p className="account-link">
          Already have an account?{" "}
          <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;