import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Dashboard({ currentUser }) {
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    function loadData() {
      setBooks(
        JSON.parse(localStorage.getItem("libraryBooks")) || []
      );

      setUsers(
        JSON.parse(localStorage.getItem("libraryUsers")) || []
      );

      setTransactions(
        JSON.parse(localStorage.getItem("libraryTransactions")) || []
      );
    }

    loadData();

    window.addEventListener("storage", loadData);

    return () => window.removeEventListener("storage", loadData);
  }, []);

  const isMember = currentUser.role === "Member";

  const myTransactions = transactions.filter(
    (transaction) =>
      transaction.memberId === currentUser.membershipId &&
      transaction.type === "Borrow Book"
  );

  const myActiveBooks = myTransactions.filter(
    (transaction) => !transaction.returned
  );

  const myReturnedBooks = myTransactions.filter(
    (transaction) => transaction.returned
  );

  const availableCopies = books.reduce(
    (total, book) => total + Number(book.quantity || 0),
    0
  );

  const borrowedCopies = transactions.reduce(
    (total, transaction) =>
      transaction.type === "Borrow Book" && !transaction.returned
        ? total + Number(transaction.quantity || 1)
        : total,
    0
  );

  const totalMembers = users.filter(
    (user) => user.role === "Member"
  ).length;

  const lowStockBooks = books.filter(
    (book) => Number(book.quantity) < 2
  );

  const recentTransactions = transactions.slice(0, 5);

  if (isMember) {
    return (
      <div className="dashboard-page">
        <div className="page-heading">
          <div>
            <h1>Welcome, {currentUser.name}!</h1>
            <p>Manage your library account and borrowed books.</p>
          </div>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Available Book Titles</h3>
            <h2>
              {books.filter((book) => Number(book.quantity) > 0).length}
            </h2>
            <p>Titles ready to borrow</p>
          </div>

          <div className="stat-card">
            <h3>My Borrowed Books</h3>
            <h2>{myActiveBooks.length}</h2>
            <p>Books currently borrowed</p>
          </div>

          <div className="stat-card">
            <h3>Books Returned</h3>
            <h2>{myReturnedBooks.length}</h2>
            <p>Completed returns</p>
          </div>

          <div className="stat-card">
            <h3>Total Borrowing Records</h3>
            <h2>{myTransactions.length}</h2>
            <p>Your borrowing history</p>
          </div>
        </div>

        <section className="dashboard-section">
          <h2>My Account</h2>

          <div className="profile-details">
            <p>
              <strong>Full Name:</strong> {currentUser.name}
            </p>

            <p>
              <strong>Membership ID:</strong>{" "}
              {currentUser.membershipId}
            </p>

            <p>
              <strong>Account Role:</strong> {currentUser.role}
            </p>
          </div>
        </section>

        <section className="dashboard-section">
          <h2>My Current Borrowed Books</h2>

          {myActiveBooks.length === 0 ? (
            <p>You have no borrowed books at the moment.</p>
          ) : (
            <div className="book-table-wrapper">
              <table className="book-table">
                <thead>
                  <tr>
                    <th>Book Title</th>
                    <th>Borrowed On</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {myActiveBooks.map((transaction) => (
                    <tr key={transaction.id}>
                      <td>{transaction.bookTitle}</td>
                      <td>{transaction.date}</td>
                      <td>
                        <span className="stock-low">
                          Borrowed
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <Link to="/browse" className="dashboard-action-link">
            Browse Books
          </Link>
        </section>

        <section className="dashboard-section">
          <h2>My Borrowing History</h2>

          {myTransactions.length === 0 ? (
            <p>You have no borrowing history yet.</p>
          ) : (
            <div className="book-table-wrapper">
              <table className="book-table">
                <thead>
                  <tr>
                    <th>Book</th>
                    <th>Borrowed On</th>
                    <th>Returned On</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {myTransactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td>{transaction.bookTitle}</td>
                      <td>{transaction.date}</td>
                      <td>{transaction.returnDate || "—"}</td>
                      <td>
                        {transaction.returned
                          ? "Returned"
                          : "Borrowed"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="page-heading">
        <div>
          <h1>Dashboard</h1>
          <p>
            Welcome, {currentUser.name}. Here is your library overview.
          </p>
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Book Titles</h3>
          <h2>{books.length}</h2>
          <p>Titles in the collection</p>
        </div>

        <div className="stat-card">
          <h3>Available Copies</h3>
          <h2>{availableCopies}</h2>
          <p>Copies ready to borrow</p>
        </div>

        <div className="stat-card">
          <h3>Borrowed Copies</h3>
          <h2>{borrowedCopies}</h2>
          <p>Copies currently borrowed</p>
        </div>

        <div className="stat-card">
          <h3>Registered Members</h3>
          <h2>{totalMembers}</h2>
          <p>Member accounts</p>
        </div>
      </div>

      <section className="dashboard-section">
        <h2>Book Availability</h2>

        {books.length === 0 ? (
          <p>No books have been added yet.</p>
        ) : (
          <div className="book-table-wrapper">
            <table className="book-table">
              <thead>
                <tr>
                  <th>Book</th>
                  <th>Author</th>
                  <th>Available Copies</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {books.map((book) => (
                  <tr key={book.id}>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.quantity}</td>
                    <td>
                      {Number(book.quantity) === 0 ? (
                        <span className="stock-low">
                          Out of Stock
                        </span>
                      ) : Number(book.quantity) < 2 ? (
                        <span className="stock-low">
                          Low Stock
                        </span>
                      ) : (
                        <span className="stock-good">
                          Available
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="dashboard-section">
        <h2>Low Stock Alerts ({lowStockBooks.length})</h2>

        {lowStockBooks.length === 0 ? (
          <p>All books have sufficient available stock.</p>
        ) : (
          <div className="book-table-wrapper">
            <table className="book-table">
              <thead>
                <tr>
                  <th>Book</th>
                  <th>Available Copies</th>
                </tr>
              </thead>

              <tbody>
                {lowStockBooks.map((book) => (
                  <tr key={book.id}>
                    <td>{book.title}</td>
                    <td>{book.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="dashboard-section">
        <h2>Recent Transactions</h2>

        {recentTransactions.length === 0 ? (
          <p>No transactions recorded yet.</p>
        ) : (
          <div className="book-table-wrapper">
            <table className="book-table">
              <thead>
                <tr>
                  <th>Book</th>
                  <th>Transaction</th>
                  <th>Member</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {recentTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{transaction.bookTitle}</td>
                    <td>{transaction.type}</td>
                    <td>{transaction.memberName || "Library"}</td>
                    <td>
                      {transaction.type === "Add Stock"
                        ? "Stock Added"
                        : transaction.returned
                        ? "Returned"
                        : "Borrowed"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;