import { useEffect, useState } from "react";

function Users() {
  const [users, setUsers] = useState(() => {
    return JSON.parse(localStorage.getItem("libraryUsers")) || [];
  });

  const [name, setName] = useState("");
  const [membershipId, setMembershipId] = useState("");
  const [role, setRole] = useState("Member");
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    localStorage.setItem("libraryUsers", JSON.stringify(users));
  }, [users]);

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !membershipId || !role) {
      setError("Please complete all user details.");
      return;
    }

    const duplicateId = users.some(
      (user) =>
        user.membershipId === membershipId &&
        user.id !== editId
    );

    if (duplicateId) {
      setError("Membership ID already exists.");
      return;
    }

    if (editId) {
      const updatedUsers = users.map((user) =>
        user.id === editId
          ? {
              ...user,
              name,
              membershipId,
              role,
            }
          : user
      );

      setUsers(updatedUsers);
      setEditId(null);
    } else {
      const newUser = {
        id: Date.now(),
        name,
        membershipId,
        role,
      };

      setUsers([...users, newUser]);
    }

    clearForm();
  }

  function handleEdit(user) {
    setName(user.name);
    setMembershipId(user.membershipId);
    setRole(user.role);
    setEditId(user.id);
    setError("");
  }

  function handleDelete(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (confirmDelete) {
      setUsers(users.filter((user) => user.id !== id));
    }
  }

  function clearForm() {
    setName("");
    setMembershipId("");
    setRole("Member");
    setError("");
  }

  function cancelEdit() {
    setEditId(null);
    clearForm();
  }

  return (
    <div className="users-page">

      <div className="page-heading">
        <div>
          <h1>Users</h1>
          <p>Manage library user accounts.</p>
        </div>
      </div>

      <div className="users-layout">

        <section className="user-form-panel">

          <h2>
            {editId ? "Update User" : "Add New User"}
          </h2>

          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label>Name</label>

              <input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Membership ID</label>

              <input
                type="text"
                placeholder="e.g. MEM001"
                value={membershipId}
                onChange={(e) =>
                  setMembershipId(e.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label>Role</label>

              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option>Member</option>
                <option>Librarian</option>
                <option>Admin</option>
              </select>
            </div>

            {error && (
              <p className="form-error">{error}</p>
            )}

            <button
              type="submit"
              className="add-book-button"
            >
              {editId ? "Save Changes" : "Add User"}
            </button>

            {editId && (
              <button
                type="button"
                className="cancel-button"
                onClick={cancelEdit}
              >
                Cancel
              </button>
            )}

          </form>

        </section>

        <section className="user-list-panel">

          <h2>User List</h2>

          {users.length === 0 ? (
            <div className="simple-empty">
              No users have been added yet.
            </div>
          ) : (
            <div className="book-table-wrapper">

              <table className="book-table">

                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Membership ID</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>

                      <td>{user.name}</td>
                      <td>{user.membershipId}</td>
                      <td>{user.role}</td>

                      <td className="action-buttons">

                        <button
                          className="edit-button"
                          onClick={() =>
                            handleEdit(user)
                          }
                        >
                          Update
                        </button>

                        <button
                          className="delete-button"
                          onClick={() =>
                            handleDelete(user.id)
                          }
                        >
                          Delete
                        </button>

                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>

            </div>
          )}

        </section>

      </div>

    </div>
  );
}

export default Users;