import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import MemberBooks from "./pages/MemberBooks";
import Transactions from "./pages/Transactions";
import Users from "./pages/Users";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

import "./App.css";

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = sessionStorage.getItem("loggedInUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  function handleLogout() {
    sessionStorage.removeItem("loggedInUser");
    setCurrentUser(null);
  }

  function handleUpdateUser(updatedUser) {
    setCurrentUser(updatedUser);
  }

  const canManage =
    currentUser?.role === "Admin" ||
    currentUser?.role === "Librarian";

  return (
    <BrowserRouter>
      {!currentUser ? (
        <Routes>
          <Route
            path="/login"
            element={<Login onLogin={setCurrentUser} />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="*"
            element={<Navigate to="/login" replace />}
          />
        </Routes>
      ) : (
        <div className="app-layout">
          <Sidebar
            currentUser={currentUser}
            onLogout={handleLogout}
          />

          <main className="main-content">
            <Routes>
              <Route
                path="/"
                element={
                  <Dashboard currentUser={currentUser} />
                }
              />

              <Route
                path="/profile"
                element={
                  <Profile
                    currentUser={currentUser}
                    onUpdateUser={handleUpdateUser}
                  />
                }
              />

              <Route
                path="/browse"
                element={
                  <MemberBooks currentUser={currentUser} />
                }
              />

              <Route
                path="/books"
                element={
                  canManage
                    ? <Books />
                    : <Navigate to="/browse" replace />
                }
              />

              <Route
                path="/transactions"
                element={
                  canManage
                    ? <Transactions />
                    : <Navigate to="/browse" replace />
                }
              />

              <Route
                path="/users"
                element={
                  currentUser.role === "Admin"
                    ? <Users />
                    : <Navigate to="/browse" replace />
                }
              />

              <Route
                path="*"
                element={<Navigate to="/" replace />}
              />
            </Routes>
          </main>
        </div>
      )}
    </BrowserRouter>
  );
}

export default App;