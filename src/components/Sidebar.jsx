import { NavLink, useNavigate } from "react-router-dom";

function Sidebar({ currentUser, onLogout }) {
  const navigate = useNavigate();

  const canManage =
    currentUser.role === "Admin" ||
    currentUser.role === "Librarian";

  function handleLogout() {
    onLogout();
    navigate("/login");
  }

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">LH</div>

        <div>
          <h2>Library Hub</h2>
          <span>Community Library</span>
        </div>
      </div>

      <nav className="sidebar-menu">
        <NavLink to="/">Dashboard</NavLink>
        <NavLink to="/browse">Browse Books</NavLink>

        {canManage && (
          <>
            <NavLink to="/books">Manage Books</NavLink>
            <NavLink to="/transactions">Transactions</NavLink>
          </>
        )}

        {currentUser.role === "Admin" && (
          <NavLink to="/users">Users</NavLink>
        )}
      </nav>

      <div className="sidebar-bottom">
        <p>
          {currentUser.name} ({currentUser.role})
        </p>

        <button
          type="button"
          className="logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;