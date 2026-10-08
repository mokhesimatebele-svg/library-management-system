import { useNavigate } from "react-router-dom";

function Profile({ currentUser }) {
  const navigate = useNavigate();

  return (
    <div className="profile-page">
      <div className="page-heading">
        <div>
          <h1>My Profile</h1>
          <p>View your library account information.</p>
        </div>
      </div>

      <div className="profile-form-card">
        <h2>Account Information</h2>

        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            value={currentUser.name}
            readOnly
          />
        </div>

        <div className="form-group">
          <label>Membership ID</label>
          <input
            type="text"
            value={currentUser.membershipId}
            readOnly
          />
        </div>

        <div className="form-group">
          <label>Account Role</label>
          <input
            type="text"
            value={currentUser.role}
            readOnly
          />
        </div>

        <p className="profile-notice">
          Account information can only be updated
          by the Library Administrator.
        </p>

        <button
          type="button"
          className="profile-cancel-button"
          onClick={() => navigate("/")}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default Profile;